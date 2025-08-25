// ReserveComplete.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Paper, Stack, Text, Divider, Group, Button } from "@mantine/core";

interface ReservationData {
  date: string;
  time: string;
  endTime: string;
  services: {
    id: number;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
  }[];
  totalDuration: number;
  totalPrice: number;
}

const generateReservationNumber = (): string => {
  return "R" + Math.floor(100000 + Math.random() * 900000).toString();
};

const ReserveComplete: React.FC = () => {
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const [reservationNumber, setReservationNumber] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("reservationData");
    if (data) {
      setReservationData(JSON.parse(data));
      setReservationNumber(generateReservationNumber());
    }
  }, []);

  if (!reservationData) {
    return (
      <Paper p="md" mt="md" shadow="sm" radius="md">
        <Text>予約情報が見つかりません。最初からやり直してください。</Text>
        <Button mt="md" onClick={() => navigate("/")}>
          メニュー選択へ戻る
        </Button>
      </Paper>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <Paper p="lg" shadow="sm" radius="md" withBorder>
        <Stack gap="sm">
          <Text fw={700} size="xl" c="pink.7" ta="center">
            予約が完了致しました！
          </Text>

          <Divider my="sm" />

          <Text fw={600}>
            予約番号: {reservationNumber}
          </Text>

          <Divider my="sm" />

          <Stack gap="xs">
            <Text fw={600} c="pink.8">予約メニュー</Text>
            {reservationData.services.map((service) => (
              <Group key={service.id} justify="space-between">
                <div>
                  <Text fw={500}>{service.name}</Text>
                  <Text size="sm" c="dimmed">
                    {service.duration}分
                  </Text>
                </div>
                <Text fw={600}>¥{service.price.toLocaleString()}</Text>
              </Group>
            ))}
          </Stack>

          <Divider my="sm" />

          <Group justify="space-between">
            <Text fw={700}>所用時間</Text>
            <Text fw={700}>{reservationData.totalDuration}分</Text>
          </Group>
          <Group justify="space-between">
            <Text fw={700}>合計金額</Text>
            <Text fw={700} c="pink.8">
              ¥{reservationData.totalPrice.toLocaleString()}
            </Text>
          </Group>

          <Divider my="sm" />

          <Stack gap="xs">
            <Text fw={600} c="pink.8">予約日時</Text>
            <Text>日付: {dayjs(reservationData.date).format("YYYY年MM月DD日(ddd)")}</Text>
            <Text>
              時間: {reservationData.time} - {reservationData.endTime}
            </Text>
          </Stack>

          <Divider my="sm" />

          <Stack gap="xs">
            <Text fw={600} c="pink.8">サロン情報</Text>
            <Text>店名: ネイルサロン SKnails</Text>
            <Text>住所: 神奈川県横浜市中区</Text>
            <Text>電話番号: 080-1234-5678</Text>
          </Stack>

          <Divider my="sm" />

          <Stack gap="xs">
            <Text fw={600} c="pink.8">注意事項</Text>
            <Text size="sm" c="dimmed">
              ・キャンセルは前日までにご連絡ください。<br/>
              ・予約時間に遅れる場合は必ずお電話ください。<br/>
            </Text>
          </Stack>

          <Button
            mt="md"
            color="pink"
            fullWidth
            onClick={() => window.location.href = "https://line.me/R/"}
          >
            LINEに戻る
          </Button>
        </Stack>
      </Paper>
    </div>
  );
};

export default ReserveComplete;

// ReserveConfirm.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Paper, Stack, Text, Divider, Group, Button } from "@mantine/core";
import { postReserve } from "@/api/calendarApi";

interface ReservationData {
  date: string;
  time: string;
  endTime: string;
  services: {
    id: number;
    service_name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
  }[];
  totalDuration: number;
  totalPrice: number;
}

const ReservationConfirm: React.FC = () => {
  const navigate = useNavigate();
  const [reservationData, setReservationData] = useState<ReservationData | null>(
    null
  );

  useEffect(() => {
    const data = localStorage.getItem("reservationData");
    if (data) {
      setReservationData(JSON.parse(data));
    }
  }, []);

  const handleConfirm = async () => {
    if (!reservationData) return;

    try {
      const result = await postReserve(reservationData);
      console.log("予約成功:", result);

      navigate("/complete");
    } catch (error) {
      console.error("予約失敗:", error);
      alert("予約に失敗しました。もう一度お試しください。");
    }
  };

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
            予約内容確認
          </Text>

          <Divider my="sm" />

          <Stack gap="xs">
            <Text fw={600} c="pink.8">選択メニュー</Text>
            {reservationData.services.map((service) => (
              <Group key={service.id} justify="space-between">
                <div>
                  <Text fw={500}>{service.service_name}</Text>
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

          <Group grow mt="md">
            <Button variant="outline" color="gray" onClick={() => navigate("/datetime")}>
              戻る
            </Button>
            <Button color="pink" onClick={handleConfirm}>
              予約を確定する
            </Button>
          </Group>
        </Stack>
      </Paper>
    </div>
  );
};

export default ReservationConfirm;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Paper, Stack, Text, Divider, Group, Button } from "@mantine/core";
import { useAtom } from "jotai";
import { selectedDateAtom, selectedTimeAtom } from "@/atoms/dateAtom";
import { selectedServiceAtom } from "@/atoms/serviceAtom";
import { postReserve } from "@/api/calendarApi";
import type { ReservationData } from "@/types/confirm";
import { initLiff, getUserProfile } from "@/api/liff";

const ReservationConfirm: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate] = useAtom(selectedDateAtom);
  const [selectedTime] = useAtom(selectedTimeAtom);
  const [selectedServices] = useAtom(selectedServiceAtom);
  const [lineId, setLineId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLineId = async () => {
      try {
        await initLiff();
        const profile = await getUserProfile();
        setLineId(profile.userId); // LIFF から取得した lineId をセット
      } catch (err) {
        console.error("LIFF 初期化またはプロフィール取得に失敗:", err);
        setLineId(null); // デフォルト値は設定せず null のまま
      }
    };

    fetchLineId();
  }, []);

  // Calculate end time based on start time and total duration
  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`;
  };

  const reservationData: ReservationData | null =
    selectedDate && selectedTime && selectedServices.length > 0 && lineId
      ? (() => {
          const totalDuration = selectedServices.reduce((acc, service) => acc + service.duration, 0);
          const totalPrice = selectedServices.reduce((acc, service) => acc + service.price, 0);
          const endTime = calculateEndTime(selectedTime, totalDuration);

          return {
            date: selectedDate,
            time: selectedTime,
            endTime,
            services: selectedServices.map(service => ({
              id: service.id,
              service_name: service.service_name,
              description: service.description,
              duration: service.duration,
              price: service.price,
              category: service.category,
            })),
            totalDuration,
            totalPrice,
            line_id: lineId,
          };
        })()
      : null;

  const handleConfirm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reservationData) return;

    try {
      await postReserve(reservationData);
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
        <form onSubmit={handleConfirm}>
          <input type="hidden" name="date" value={reservationData.date} />
          <input type="hidden" name="time" value={reservationData.time} />
          <input type="hidden" name="endTime" value={reservationData.endTime} />
          <input type="hidden" name="totalDuration" value={reservationData.totalDuration.toString()} />
          <input type="hidden" name="totalPrice" value={reservationData.totalPrice.toString()} />
          <input type="hidden" name="services" value={JSON.stringify(reservationData.services)} />

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
                    <Text size="sm" c="dimmed">{service.duration}分</Text>
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
              <Text fw={700} c="pink.8">¥{reservationData.totalPrice.toLocaleString()}</Text>
            </Group>

            <Divider my="sm" />

            <Stack gap="xs">
              <Text fw={600} c="pink.8">予約日時</Text>
              <Text>日付: {dayjs(reservationData.date).format("YYYY年MM月DD日(ddd)")}</Text>
              <Text>時間: {reservationData.time} - {reservationData.endTime}</Text>
            </Stack>

            <Divider my="sm" />

            <Group grow mt="md">
              <Button variant="outline" color="gray" onClick={() => navigate("/datetime")}>
                戻る
              </Button>
              <Button type="submit" color="pink">予約を確定する</Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </div>
  );
};

export default ReservationConfirm;

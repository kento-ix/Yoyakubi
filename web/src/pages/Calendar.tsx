import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { useAtom } from "jotai";
import {
  selectedDateAtom,
  selectedTimeAtom,
  setSelectedDateTimeAtom,
} from "@/atoms/dateAtom";
import { fetchReservedSlots } from "@/api/calendarApi";
import type { ReservedSlot } from "@/types/date";
import { Button, Card, Stack, Text, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { selectedServiceAtom } from "@/atoms/serviceAtom";

dayjs.locale("ja");

const Calendar: React.FC = () => {
  const [reservedSlots, setReservedSlots] = useState<ReservedSlot[]>([]);
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);
  const [selectedDate] = useAtom(selectedDateAtom);
  const [selectedTime] = useAtom(selectedTimeAtom);
  const [, setSelectedDateTime] = useAtom(setSelectedDateTimeAtom);
  const [selectedServices] = useAtom(selectedServiceAtom);
  const navigate = useNavigate();

  // 予約データをGoogle Calendarから取得
  useEffect(() => {
    const loadReservedSlots = async () => {
      try {
        const data = await fetchReservedSlots(); // Google Calendarデータ取得API
        if (data.success) setReservedSlots(data.reserved_slots);
      } catch (err) {
        console.error("予約データ取得エラー:", err);
      }
    };
    loadReservedSlots();
  }, []);

  // 月間カレンダーの日付生成（例：当月）
  useEffect(() => {
    const today = dayjs();
    const start = today.startOf("month");
    const end = today.endOf("month");
    const dates: Date[] = [];
    for (let d = start; d.isBefore(end) || d.isSame(end, "day"); d = d.add(1, "day")) {
      dates.push(d.toDate());
    }
    setCalendarDates(dates);
  }, []);

  // サービスの合計時間
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);

  // 選択した開始時間から終了時間を計算
  const calcEndTime = (startTime: string, duration: number): string => {
    const [h, m] = startTime.split(":").map(Number);
    const total = h * 60 + m + duration;
    const endH = Math.floor(total / 60);
    const endM = total % 60;
    return `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;
  };

  // その日が予約されている時間帯を取得
  const getReservedTimes = (date: string): string[] => {
    return reservedSlots
      .filter(slot => slot.date === date)
      .flatMap(slot => [
        ...(slot.times || []),
        ...(slot.bookings?.flatMap(b => b.times || []) || []),
      ]);
  };

  // 時間リストを作成（9:00〜18:00まで30分刻み）
  const times = Array.from({ length: 18 }, (_, i) =>
    dayjs().hour(9).minute(0).add(i * 30, "minute").format("HH:mm")
  );

  const handleDateSelect = (date: Date) => {
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    setSelectedDateTime({ date: dateStr, time: null });
  };

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) return;
    setSelectedDateTime({ date: selectedDate, time });
  };

  const handleNext = () => {
    if (selectedDate && selectedTime && selectedServices.length > 0) {
      navigate("/confirm");
    }
  };

  // 現在選択中の日の予約済時間を取得
  const reservedTimes = selectedDate ? getReservedTimes(selectedDate) : [];

  return (
    <div style={{ padding: 16 }}>
      <Text fw={700} fz="lg" mb="sm">
        日付を選択
      </Text>

      {/* 日付選択セクション */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "6px",
          marginBottom: "20px",
        }}
      >
        {calendarDates.map((d, i) => {
          const dateStr = dayjs(d).format("YYYY-MM-DD");
          const isSelected = selectedDate === dateStr;
          return (
            <Card
              key={i}
              onClick={() => handleDateSelect(d)}
              style={{
                cursor: "pointer",
                textAlign: "center",
                backgroundColor: isSelected ? "#ec4881ff" : "#f5f5f5",
                color: isSelected ? "white" : "#333",
                padding: "10px 0",
                borderRadius: 8,
              }}
            >
              <Text>{dayjs(d).format("D")}</Text>
              <Text fz="xs">{dayjs(d).format("ddd")}</Text>
            </Card>
          );
        })}
      </div>

      {/* 時間選択セクション */}
      {selectedDate && (
        <div>
          <Text fw={700} fz="lg" mb="sm">
            {dayjs(selectedDate).format("YYYY年MM月DD日(ddd)")}
          </Text>

          <Stack gap="xs">
            {times.map((t, i) => {
              const isReserved = reservedTimes.includes(t);
              const isSelected = selectedTime === t;

              return (
                <Button
                  key={i}
                  fullWidth
                  color={isReserved ? "gray" : isSelected ? "pink" : "pink.4"}
                  variant={isReserved ? "outline" : isSelected ? "filled" : "light"}
                  disabled={isReserved}
                  onClick={() => handleTimeSelect(t)}
                >
                  {t}
                  {isReserved && "（予約済）"}
                </Button>
              );
            })}
          </Stack>
        </div>
      )}

      {/* 選択中の情報表示 */}
      {selectedDate && selectedTime && (
        <Card mt="lg" shadow="sm" radius="md" style={{ background: "#fdecef" }}>
          <Stack gap="xs">
            <Text fw={600} c="pink.8">選択中の予約時間</Text>
            <Text>日付: {dayjs(selectedDate).format("YYYY年MM月DD日(ddd)")}</Text>
            <Text>開始時間: {selectedTime}</Text>
            <Text>終了時間: {calcEndTime(selectedTime, totalDuration)}</Text>
            <Text>所要時間: {totalDuration}分</Text>
          </Stack>
        </Card>
      )}

      {selectedDate && selectedTime && selectedServices.length > 0 && (
        <Group justify="space-between" mt="md">
          <Button onClick={() => navigate("/menu")} variant="outline" color="gray">
            戻る
          </Button>
          <Button onClick={handleNext} color="pink">
            次へ進む
          </Button>
        </Group>
      )}
    </div>
  );
};

export default Calendar;

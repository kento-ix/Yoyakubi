import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Badge,
  Box,
  ScrollArea,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCalendar, IconChevronRight } from "@tabler/icons-react";
import { useAtom } from "jotai";
import {
  weekStartDateAtom,
  weekDaysAtom,
  selectedDateAtom,
  selectedTimeAtom,
} from "../atoms/dateAtom";
import { selectedServiceAtom } from "../atoms/serviceAtom";

const DateTimeSelection: React.FC = () => {
  const navigate = useNavigate();

  const [weekStartDate, setWeekStartDate] = useAtom(weekStartDateAtom);
  const [weekDays] = useAtom(weekDaysAtom);
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [selectedTime, setSelectedTime] = useAtom(selectedTimeAtom);
  const [selectedServices] = useAtom(selectedServiceAtom); // Get selected services from atom

  const isMobile = useMediaQuery("(max-width: 800px)");

  // Calculate total duration from selected services
  const totalDuration = selectedServices.reduce(
    (acc, service) => acc + service.duration,
    0
  );

  // Calculate end time based on start time and total duration
  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMins
      .toString()
      .padStart(2, "0")}`;
  };

  // Check if a time slot conflicts with selected duration
  const isTimeSlotAvailable = (
    startTime: string,
    duration: number
  ): boolean => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = startTotalMinutes + duration;

    // Check if end time goes beyond business hours (18:00 = 1080 minutes)
    if (endTotalMinutes > 18 * 60) {
      return false;
    }

    return true;
  };

  // 時間スロット
  const timeSlots: string[] = [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ];

  // モック：予約状況取得
  const getAvailability = (date: Date, time: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate < today) return false;

    if (targetDate.getTime() === today.getTime()) {
      const [hours, minutes] = time.split(":").map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      if (slotTime <= new Date()) return false;
    }

    if (date.getDay() === 0) return false;

    // Check if the time slot can accommodate the total duration
    if (!isTimeSlotAvailable(time, totalDuration)) return false;

    const unavailableSlots = [
      { date: "2025-08-21", time: "10:00" },
      { date: "2025-08-25", time: "14:30" },
    ];
    const dateStr = date.toISOString().split("T")[0];
    return !unavailableSlots.some((s) => s.date === dateStr && s.time === time);
  };

  // 選択スロット判定 - 時間範囲で判定
  const isSlotSelected = (date: Date, time: string) => {
    if (!selectedDate || !selectedTime) return false;

    const dateStr = date.toISOString().split("T")[0];
    if (selectedDate !== dateStr) return false;

    // 選択開始時間を分単位に変換
    const [startHour, startMin] = selectedTime.split(":").map(Number);
    const startTotal = startHour * 60 + startMin;

    // 現在ボタンの時間を分単位に変換
    const [slotHour, slotMin] = time.split(":").map(Number);
    const slotTotal = slotHour * 60 + slotMin;

    // 選択時間の範囲内に入っているか判定
    return slotTotal >= startTotal && slotTotal < startTotal + totalDuration;
  };

  const handleSlotSelect = (date: Date, time: string) => {
    if (!getAvailability(date, time)) return;

    setSelectedDate(date.toISOString().split("T")[0]);
    setSelectedTime(time);
  };

  // 週移動
  const handleNextWeek = () => {
    const nextWeek = new Date(weekStartDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setWeekStartDate(nextWeek);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handlePrevWeek = () => {
    const prevWeek = new Date(weekStartDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setWeekStartDate(prevWeek);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNext = () => {
    if (selectedDate && selectedTime && selectedServices.length > 0) {
      const endTime = calculateEndTime(selectedTime, totalDuration);
      const reservationData = {
        date: selectedDate,
        time: selectedTime,
        endTime: endTime,
        services: selectedServices,
        totalDuration: totalDuration,
        totalPrice: selectedServices.reduce(
          (acc, service) => acc + service.price,
          0
        ),
      };
      localStorage.setItem("reservationData", JSON.stringify(reservationData));
      navigate("/confirm");
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });

  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const formatWeekRange = (startDate: Date) => {
    const jstStart = new Date(
      startDate.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
    );
    const jstEnd = new Date(jstStart);
    jstEnd.setDate(jstStart.getDate() + 6);
    return `${jstStart.toLocaleDateString("ja-JP", {
      month: "numeric",
      day: "numeric",
    })} - ${jstEnd.toLocaleDateString("ja-JP", {
      month: "numeric",
      day: "numeric",
    })}`;
  };

  

  return (
    <>
      <>
        <div>
          <Title order={2} ta="center" c="pink.6" mb="xs">
            日時選択
          </Title>
          <Text ta="center" c="dimmed">
            ご希望の予約日時をお選びください
          </Text>
        </div>

        {/* 週間カレンダー */}
        <>
          <Group justify="space-between" align="center" mb="md">
            <Group gap="xs">
              <IconCalendar size={20} color="var(--mantine-color-pink-6)" />
              <Text fw={600} size="lg">
                予約可能時間
              </Text>
              {totalDuration > 0 && (
                <Badge color="pink" variant="light">
                  {totalDuration}分枠
                </Badge>
              )}
            </Group>
            <Group gap="xs">
              <Button
                variant="light"
                color="pink"
                size="sm"
                onClick={handlePrevWeek}
              >
                前の1週間
              </Button>
              <Button
                variant="light"
                color="pink"
                size="sm"
                rightSection={<IconChevronRight size={16} />}
                onClick={handleNextWeek}
              >
                次の1週間
              </Button>
            </Group>
          </Group>

          <Text size="sm" c="dimmed" mb="md" ta="center">
            {formatWeekRange(weekStartDate)}
          </Text>

          {/* カレンダーグリッド */}
          {isMobile ? (
            <Box style={{ width: "100%", overflow: "hidden" }}>
              {/* ヘッダー */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto repeat(7, 1fr)",
                  gap: "2px",
                  marginBottom: "12px",
                }}
              >
                {/* <Box></Box> */}
                {weekDays.map((day) => (
                  <Paper
                    key={day.date.toISOString()}
                    p="4px"
                    bg={
                      day.isPast
                        ? "gray.2"
                        : day.isSunday
                        ? "red.0"
                        : day.isSaturday
                        ? "blue.0"
                        : "gray.0"
                    }
                    ta="center"
                    radius="sm"
                    style={{ opacity: day.isPast ? 0.6 : 1 }}
                  >
                    <Text
                      size="10px"
                      fw={600}
                      c={
                        day.isPast
                          ? "gray.6"
                          : day.isSunday
                          ? "red.7"
                          : day.isSaturday
                          ? "blue.7"
                          : "gray.7"
                      }
                    >
                      {formatDate(day.date)}
                    </Text>
                    <Text
                      size="9px"
                      c={
                        day.isPast
                          ? "gray.5"
                          : day.isSunday
                          ? "red.6"
                          : day.isSaturday
                          ? "blue.6"
                          : "gray.6"
                      }
                    >
                      ({day.dayName})
                    </Text>
                    {day.isToday && (
                      <Badge
                        size="xs"
                        variant="filled"
                        color="pink"
                        style={{ fontSize: "6px", height: "12px" }}
                      >
                        今日
                      </Badge>
                    )}
                  </Paper>
                ))}
              </div>

              {/* 時間スロット */}
              {timeSlots.map((time) => (
                <div
                  key={time}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto repeat(7, 1fr)",
                    gap: "2px",
                    marginBottom: "2px",
                  }}
                >
                  <Box
                    p="4px"
                    ta="center"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "var(--mantine-color-gray-1)",
                      borderRadius: "6px",
                      minHeight: "38px",
                    }}
                  >
                    <Text size="11px" fw={500}>
                      {time}
                    </Text>
                  </Box>
                  {weekDays.map((day) => {
                    const available = getAvailability(day.date, time);
                    const selected = isSlotSelected(day.date, time);
                    return (
                      <Button
                        key={`${day.date.toISOString()}-${time}`}
                        variant={selected ? "filled" : "light"}
                        color={selected ? "pink" : available ? "gray" : "red"}
                        size="xs"
                        disabled={!available}
                        onClick={() => handleSlotSelect(day.date, time)}
                        style={{
                          height: "40px",
                          fontSize: "12px",
                          fontWeight: 600,
                          opacity: available ? 1 : 0.4,
                          padding: 0,
                          minWidth: 0,
                          width: "40px",
                          borderRadius: "6px",
                        }}
                      >
                        {available ? "○" : "×"}
                      </Button>
                    );
                  })}
                </div>
              ))}
            </Box>
          ) : (
            <ScrollArea>
              <Box style={{ minWidth: "600px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px repeat(7, 1fr)",
                    gap: "2px",
                    marginBottom: "8px",
                  }}
                >
                  <Box></Box>
                  {weekDays.map((day) => (
                    <Paper
                      key={day.date.toISOString()}
                      p="xs"
                      bg={
                        day.isPast
                          ? "gray.2"
                          : day.isSunday
                          ? "red.0"
                          : day.isSaturday
                          ? "blue.0"
                          : "gray.0"
                      }
                      ta="center"
                      radius="sm"
                      style={{ opacity: day.isPast ? 0.6 : 1 }}
                    >
                      <Text
                        size="xs"
                        fw={600}
                        c={
                          day.isPast
                            ? "gray.6"
                            : day.isSunday
                            ? "red.7"
                            : day.isSaturday
                            ? "blue.7"
                            : "gray.7"
                        }
                      >
                        {formatDate(day.date)}
                      </Text>
                      <Text
                        size="xs"
                        c={
                          day.isPast
                            ? "gray.5"
                            : day.isSunday
                            ? "red.6"
                            : day.isSaturday
                            ? "blue.6"
                            : "gray.6"
                        }
                      >
                        ({day.dayName})
                      </Text>
                      {day.isToday && (
                        <Badge size="xs" variant="filled" color="pink">
                          今日
                        </Badge>
                      )}
                    </Paper>
                  ))}
                </div>

                {timeSlots.map((time) => (
                  <div
                    key={time}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px repeat(7, 1fr)",
                      gap: "2px",
                      marginBottom: "2px",
                    }}
                  >
                    <Box
                      p="xs"
                      ta="center"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "var(--mantine-color-gray-1)",
                        borderRadius: "4px",
                      }}
                    >
                      <Text size="sm" fw={500}>
                        {time}
                      </Text>
                    </Box>
                    {weekDays.map((day) => {
                      const available = getAvailability(day.date, time);
                      const selected = isSlotSelected(day.date, time);
                      return (
                        <Button
                          key={`${day.date.toISOString()}-${time}`}
                          variant={selected ? "filled" : "light"}
                          color={selected ? "pink" : available ? "gray" : "red"}
                          size="xs"
                          disabled={!available}
                          onClick={() => handleSlotSelect(day.date, time)}
                          style={{
                            height: "32px",
                            fontSize: "12px",
                            opacity: available ? 1 : 0.3,
                          }}
                        >
                          {available ? "○" : "×"}
                        </Button>
                      );
                    })}
                  </div>
                ))}
              </Box>
            </ScrollArea>
          )}
        </>

        {/* 選択確認 */}
        {selectedDate && selectedTime && (
          <Paper p="md" bg="pink.0" radius="md">
            <Stack gap="xs">
              <Text fw={600} c="pink.8" size="md">
                選択中の予約時間
              </Text>
              <Group justify="space-between">
                <Text size="sm">日付:</Text>
                <Text size="sm" fw={500}>
                  {formatFullDate(selectedDate)}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">開始時間:</Text>
                <Text size="sm" fw={500}>
                  {selectedTime}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">終了時間:</Text>
                <Text size="sm" fw={500}>
                  {calculateEndTime(selectedTime, totalDuration)}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">所要時間:</Text>
                <Text size="sm" fw={500}>
                  {totalDuration}分
                </Text>
              </Group>
            </Stack>
          </Paper>
        )}

        {/* 予約内容確認 */}
        {selectedDate && selectedTime && selectedServices.length > 0 && (
          <Button
            onClick={handleNext}
            color="pink"
            size="lg"
            mt="md"
            fullWidth
            disabled={selectedServices.length === 0}
          >
            次へ進む
          </Button>
        )}
      </>
    </>
  );
};

export default DateTimeSelection;

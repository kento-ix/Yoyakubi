import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { useAtom } from "jotai";
import {
    weekStartDateAtom,
    weekDaysAtom,
    selectedDateAtom,
    selectedTimeAtom,
} from "../atoms/dateAtom";
import { Button, Group } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { selectedServiceAtom } from "../atoms/serviceAtom";
import { Paper, Stack, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

dayjs.locale("ja");

type SlotStatus = "available" | "unavailable" | "selected";

interface CalendarProps {
    unavailable?: (date: string, time: string) => boolean;
}

const Calendar: React.FC<CalendarProps> = ({ unavailable }) => {
    const [weekStartDate, setWeekStartDate] = useAtom(weekStartDateAtom);
    const [weekDays] = useAtom(weekDaysAtom);
    const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
    const [selectedTime, setSelectedTime] = useAtom(selectedTimeAtom);
    const [selectedServices] = useAtom(selectedServiceAtom);
    const navigate = useNavigate();

    const totalDuration = selectedServices.reduce(
        (acc, service) => acc + service.duration,
        0
    );

    const calculateEndTime = (startTime: string, duration: number): string => {
        const [hours, minutes] = startTime.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes + duration;
        const endHours = Math.floor(totalMinutes / 60);
        const endMins = totalMinutes % 60;
        return `${endHours.toString().padStart(2, "0")}:${endMins
        .toString()
        .padStart(2, "0")}`;
    };

    const isSlotSelected = (date: Date, time: string) => {
        if (!selectedDate || !selectedTime) return false;
        const dateStr = dayjs(date).format("YYYY-MM-DD");
        if (selectedDate !== dateStr) return false;

        const [startHour, startMin] = selectedTime.split(":").map(Number);
        const startTotal = startHour * 60 + startMin;

        const [slotHour, slotMin] = time.split(":").map(Number);
        const slotTotal = slotHour * 60 + slotMin;

        return slotTotal >= startTotal && slotTotal < startTotal + totalDuration;
    };

    const times = Array.from({ length: 18 }, (_, i) =>
        dayjs()
        .hour(9)
        .minute(0)
        .add(i * 30, "minute")
        .format("HH:mm")
    );

    const handleSelect = (date: Date, time: string) => {
        if (unavailable?.(dayjs(date).format("YYYY-MM-DD"), time)) return;
        setSelectedDate(dayjs(date).format("YYYY-MM-DD"));
        setSelectedTime(time);
    };

    const getStatus = (date: Date, time: string): SlotStatus => {
        const dateStr = dayjs(date).format("YYYY-MM-DD");
        if (unavailable?.(dateStr, time)) return "unavailable";
        if (selectedDate === dateStr && selectedTime === time) return "selected";
        return "available";
    };

    // 次へ進む処理
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

    return (
        <div style={{ width: "100%", overflowX: "hidden" }}>
            <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginBottom: 8,
            }}
            >
                <div style={{ textAlign: "center", fontWeight: 500 }}>
                    {dayjs(weekDays[0].date).format("YYYY/MM/DD")} -{" "}
                    {dayjs(weekDays[6].date).format("MM/DD")}
                </div>

                <Group justify="center" gap="xs">
                    <Button
                        variant="light"
                        color="pink"
                        size="sm"
                        onClick={() =>
                            setWeekStartDate(dayjs(weekStartDate).subtract(7, "day").toDate())
                        }
                    >
                    前の1週間
                    </Button>
                    <Button
                        variant="light"
                        color="pink"
                        size="sm"
                        rightSection={<IconChevronRight size={16} />}
                        onClick={() =>
                            setWeekStartDate(dayjs(weekStartDate).add(7, "day").toDate())
                        }
                    >
                    次の1週間
                    </Button>
                </Group>
            </div>
                <table
                    style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        tableLayout: "fixed",
                    }}
                >
                    <thead>
                        <tr>
                        <th
                            style={{
                            width: "16%",
                            background: "#f5f5f5",
                            border: "1px solid #ccc",
                            }}
                        >
                            日時
                        </th>
                        {weekDays.map((d, i) => (
                            <th
                            key={i}
                            style={{
                                textAlign: "center",
                                padding: 2,
                                fontWeight: "bold",
                                fontSize: "12px",
                                background: d.isSunday
                                ? "#fdecea"
                                : d.isSaturday
                                ? "#e3f2fd"
                                : "#f5f5f5",
                                border: "1px solid #ccc",
                            }}
                            >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    lineHeight: "2.1",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "14px",
                                        color: d.isSunday
                                        ? "#d32f2f"
                                        : d.isSaturday
                                        ? "#1976d2"
                                        : "#333",
                                    }}
                                >
                                {dayjs(d.date).format("DD")}
                                </span>
                                <span
                                style={{
                                    fontSize: "11px",
                                    color: d.isSunday
                                    ? "#d32f2f"
                                    : d.isSaturday
                                    ? "#1976d2"
                                    : "#555",
                                }}
                                >
                                {d.dayName}
                                </span>
                            </div>
                            </th>
                        ))}
                        </tr>
                    </thead>
                        <tbody>
                            {times.map((time, row) => (
                            <tr key={row}>
                                <td
                                style={{
                                    width: "16%",
                                    textAlign: "center",
                                    padding: "2px",
                                    fontSize: "15px",
                                    backgroundColor: "#f0f0f0",
                                    border: "1px solid #ccc",
                                }}
                                >
                                {time}
                                </td>
                                {weekDays.map((d, col) => {
                                const status = getStatus(d.date, time);
                                const selected = isSlotSelected(d.date, time);

                                let bg = "#ffffffff";
                                let symbol: React.ReactNode = <span style={{ color: "gray", fontSize: "21px" }}>○</span>;

                                if (selected) {
                                    bg = "#ec4881ff";
                                    symbol = <span style={{ color: "white", fontSize: "21px" }}>○</span>;
                                } else if (status === "unavailable") {
                                    bg = "#cdccccff";
                                    symbol = <span style={{ color: "black", fontSize: "21px" }}>✕</span>;
                                }

                                return (
                                    <td
                                        key={col}
                                        onClick={() => handleSelect(d.date, time)}
                                        style={{
                                            cursor:
                                            status === "available" ? "pointer" : "not-allowed",
                                            height:60,
                                            textAlign: "center",
                                            verticalAlign: "middle",
                                            backgroundColor: bg,
                                            color: "#dbd8d8ff",
                                            border: "1px solid #ccc",
                                            fontSize: "14px",
                                            userSelect: "none",
                                        }}
                                    >
                                    {symbol}
                                    </td>
                                );
                                })}
                            </tr>
                            ))}
                        </tbody>
            </table>

            {selectedDate && selectedTime && (
                <Paper p="md" mt="md" shadow="sm" radius="md" style={{ backgroundColor: "#fdecef" }}>
                    <Stack gap="xs">
                        <Text fw={600} c="pink.8">選択中の予約時間</Text>
                        <Text>日付: {dayjs(selectedDate).format("YYYY年MM月DD日(ddd)")}</Text>
                        <Text>開始時間: {selectedTime}</Text>
                        <Text>終了時間: {calculateEndTime(selectedTime, totalDuration)}</Text>
                        <Text>所要時間: {totalDuration}分</Text>
                    </Stack>
                </Paper>
            )}

            {selectedDate && selectedTime && selectedServices.length > 0 && (
                <Button
                    onClick={handleNext}
                    color="pink"
                    size="lg"
                    mt="md"
                    fullWidth
                >
                    次へ進む
                </Button>
            )}
        </div>
    );
};

export default Calendar;

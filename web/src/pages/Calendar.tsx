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

  const times = Array.from({ length: 18 }, (_, i) =>
    dayjs()
      .hour(9)
      .minute(0)
      .add(i * 30, "minute")
      .format("HH:mm")
  );

  const handleSelect = (date: Date, time: string) => {
    if (
      unavailable?.(dayjs(date).format("YYYY-MM-DD"), time) ||
      date.getDay() === 0
    )
      return;
    setSelectedDate(dayjs(date).format("YYYY-MM-DD"));
    setSelectedTime(time);
  };

  const getStatus = (date: Date, time: string): SlotStatus => {
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    if (date.getDay() === 0 || unavailable?.(dateStr, time))
      return "unavailable";
    if (selectedDate === dateStr && selectedTime === time) return "selected";
    return "available";
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
                    lineHeight: "1.5",
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
                  fontSize: "12px",
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #ccc",
                }}
              >
                {time}
              </td>
              {weekDays.map((d, col) => {
                const status = getStatus(d.date, time);

                let bg = "#e0e0e0";
                let symbol: React.ReactNode = <span style={{ color: "gray" }}>○</span>;

                if (status === "selected") {
                  bg = "#f06595";
                  symbol = <span style={{ color: "white" }}>○</span>;
                } else if (status === "unavailable") {
                  bg = "#cdccccff";
                  symbol = <span style={{ color: "black" }}>✕</span>;
                }

                return (
                  <td
                    key={col}
                    onClick={() => handleSelect(d.date, time)}
                    style={{
                      cursor:
                        status === "available" ? "pointer" : "not-allowed",
                      height: 40,
                      textAlign: "center",
                      verticalAlign: "middle",
                      backgroundColor: bg,
                      color: "#b0b0b0",
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
    </div>
  );
};

export default Calendar;

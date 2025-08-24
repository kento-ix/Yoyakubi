// atoms/dateAtom.ts
import { atom } from "jotai";
import type { WeekDay } from "../types/date";

const generateWeekDays = (startDate: Date): WeekDay[] => {
  const jstStart = new Date(
    startDate.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
  );
  jstStart.setHours(0, 0, 0, 0);

  const weekDays: WeekDay[] = [];
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

  for (let i = 0; i < 7; i++) {
    const date = new Date(jstStart);
    date.setDate(jstStart.getDate() + i);

    weekDays.push({
      date,
      dayName: dayNames[date.getDay()],
      isToday: i === 0,
      isSunday: date.getDay() === 0,
      isSaturday: date.getDay() === 6,
      isPast: date < jstStart,
    });
  }

  return weekDays;
};

// Atom: current week start date
export const weekStartDateAtom = atom<Date>(new Date());

// Derived atom: weekDays from current weekStartDate
export const weekDaysAtom = atom((get) => generateWeekDays(get(weekStartDateAtom)));

// Selected date/time atoms
export const selectedDateAtom = atom<string | null>(null);
export const selectedTimeAtom = atom<string | null>(null);


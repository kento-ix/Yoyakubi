// atoms/dateAtom.ts
import { atom } from "jotai";
import type { WeekDay, StoredDateTime } from "@/types/date";

const EXPIRATION_MINUTES = 30;

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


const loadInitial = (): { date: string | null; time: string | null } => {
  const raw = localStorage.getItem("selectedDateTime");
  if (!raw) return { date: null, time: null };
  try {
    const parsed: StoredDateTime = JSON.parse(raw);
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem("selectedDateTime");
      return { date: null, time: null };
    }
    return { date: parsed.date, time: parsed.time };
  } catch {
    return { date: null, time: null };
  }
};

// Starting Date data
export const weekStartDateAtom = atom<Date>(new Date());
export const weekDaysAtom = atom((get) => generateWeekDays(get(weekStartDateAtom)));

// declare atom to use within app
export const selectedDateAtom = atom<string | null>(loadInitial().date);
export const selectedTimeAtom = atom<string | null>(loadInitial().time);


// set serices to this atom and save expration time
export const setSelectedDateTimeAtom = atom(
  null,
  (_get, set, { date, time }: { date: string | null; time: string | null }) => {
    const expiresAt = Date.now() + EXPIRATION_MINUTES * 60 * 1000;
    const data: StoredDateTime = { date, time, expiresAt };
    localStorage.setItem("selectedDateTime", JSON.stringify(data));

    set(selectedDateAtom, date);
    set(selectedTimeAtom, time);
  }
);

export interface WeekDay {
  date: Date;
  dayName: string;
  isToday: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  isPast: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
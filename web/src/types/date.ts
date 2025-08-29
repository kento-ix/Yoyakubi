export interface WeekDay {
  date: Date;
  dayName: string;
  isToday: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  isPast: boolean;
}

interface Booking {
  id: string;
  title: string;
  times: string[];
}

export interface ReservedSlot {
  times: string[];
  date: string;
  bookings: Booking[];
}
import React, { useEffect, useState } from "react";
import Calendar from "../../pages/Calendar";

const CalendarWrapper = () => {
  const [reservedSlots, setReservedSlots] = useState<{date: string, time: string}[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/calendar/reserved_slots")
      .then(res => res.json())
      .then(data => {
        if(data.success) setReservedSlots(data.reserved_slots);
      });
  }, []);

  const isUnavailable = (date: string, time: string) => {
    return reservedSlots.some(slot => slot.date === date && slot.time === time);
  };

  return <Calendar unavailable={isUnavailable} />;
};

export default CalendarWrapper;

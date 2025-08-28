import axios from "axios";

export const fetchReservedSlots = async () => {
  try {
    const response = await axios.get("http://localhost:8000/calendar/reserved_slots");
    return response.data;  // { success: true, reserved_slots: [...] }
  } catch (error) {
    console.error("Fail to get time slot:", error);
    throw error;
  }
};

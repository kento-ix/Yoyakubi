import axios from "axios";

export const fetchReservedSlots = async () => {
  try {
    const response = await axios.get("http://localhost:8000/calendar/get_reserved");
    return response.data;  // { success: true, reserved_slots: [...] }
  } catch (error) {
    console.error("Fail to get time slot:", error);
    throw error;
  }
};

export async function postReserve(reservationData: any) {
  try {
    const response = await axios.post("http://localhost:8000/reserve/add_reserve", reservationData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("予約送信エラー:", error);
    throw error.response?.data || error;
  }
}

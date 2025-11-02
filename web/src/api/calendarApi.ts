import axios from "axios";
import { API_URL } from "./config";

export const fetchReservedSlots = async () => {
  try {
    const response = await axios.get(`${API_URL}/calendar/get_reserved`);
    return response.data;  // { success: true, reserved_slots: [...] }
  } catch (error) {
    console.error("Fail to get time slot:", error);
    throw error;
  }
};

export async function postReserve(reservationData: any) {
  try {
    const response = await axios.post(`${API_URL}/reserve/add_reserve`, reservationData, {
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

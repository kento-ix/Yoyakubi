// src/api/calendarApi.ts
import axios from "axios";
import type { AxiosInstance } from "axios";

const API_BASE = (import.meta.env.VITE_API_BASE as string) || "http://localhost:8000";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(cfg => {
  console.debug("[API req]", cfg.method, cfg.url, cfg.data ?? "");
  return cfg;
});
api.interceptors.response.use(
  res => {
    console.debug("[API res]", res.status, res.config.url, res.data);
    return res;
  },
  err => {
    console.debug("[API err]", err?.response?.status, err?.config?.url, err?.response?.data ?? err.message);
    return Promise.reject(err);
  }
);

export const fetchReservedSlots = async () => {
  try {
    const response = await api.get("/calendar/get_reserved");
    return response.data;
  } catch (error: any) {
    throw formatAxiosError(error);
  }
};

export async function postReserve(reservationData: any) {
  try {
    const response = await api.post("/reserve/add_reserve", reservationData);
    return response.data;
  } catch (error: any) {
    throw formatAxiosError(error);
  }
}

function formatAxiosError(error: any): Error {
  if (error?.isAxiosError) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const msg = `HTTP ${status ?? "?"} - ${error.message}`;
    const e = new Error(msg);
    // @ts-ignore;
    e.data = data;
    return e;
  }
  return new Error(error?.message ?? String(error));
}

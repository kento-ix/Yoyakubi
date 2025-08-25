import { atom } from "jotai";
import type { ServiceMenu } from "../types/menu";

interface StoredServices {
  services: ServiceMenu[];
  expiresAt: number;
}

const EXPIRATION_MINUTES = 30;

const loadInitial = (): ServiceMenu[] => {
  const raw = localStorage.getItem("selectedServices");
  if (!raw) return [];
  try {
    const parsed: StoredServices = JSON.parse(raw);
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem("selectedServices");
      return [];
    }
    return parsed.services;
  } catch {
    return [];
  }
};

export const selectedServiceAtom = atom<ServiceMenu[]>(loadInitial());

// 更新用関数 atom
export const setSelectedServiceAtom = atom(
  null,
  (get, set, services: ServiceMenu[]) => {
    const expiresAt = Date.now() + EXPIRATION_MINUTES * 60 * 1000;
    const data: StoredServices = { services, expiresAt };
    localStorage.setItem("selectedServices", JSON.stringify(data));
    set(selectedServiceAtom, services);
  }
);

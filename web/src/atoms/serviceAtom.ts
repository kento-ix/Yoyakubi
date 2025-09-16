import { atom } from "jotai";
import type { ServiceMenu, StoredServices } from "@/types/menu";

const EXPIRATION_MINUTES = 30;

// load data from localstorage
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

// declare atom to use within app
export const selectedServiceAtom = atom<ServiceMenu[]>(loadInitial());

export const setSelectedServiceAtom = atom(
  null,
  (_get, set, services: ServiceMenu[]) => {
    const expiresAt = Date.now() + EXPIRATION_MINUTES * 60 * 1000;
    const data: StoredServices = { services, expiresAt };
    localStorage.setItem("selectedServices", JSON.stringify(data));
    set(selectedServiceAtom, services);
  }
);

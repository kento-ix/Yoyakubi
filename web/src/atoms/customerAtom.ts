import { atom } from 'jotai';

export const checkingUserAtom = atom(true);
export const customerErrorAtom = atom<string | null>(null);

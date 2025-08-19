import { atom } from 'jotai';
import type { ServiceMenu } from '../types/menu';

export const selectedServiceAtom = atom<ServiceMenu[]>([]);

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function pluralizeTvir(count: number): string {
  const abs = Math.abs(count);
  const lastTwo = abs % 100;
  const lastOne = abs % 10;

  if (lastTwo >= 11 && lastTwo <= 19) return "творів";
  if (lastOne === 1) return "твір";
  if (lastOne >= 2 && lastOne <= 4) return "твори";
  return "творів";
}

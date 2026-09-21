import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export function formatINR(n: number) {
  return INR.format(n);
}

export function spotsLeft(confirmed: number, pending: number, max: number) {
  return Math.max(0, max - confirmed - pending);
}

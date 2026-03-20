import { Product } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timestampToDate(date: Date | Timestamp): Date {
  if (date instanceof Date) return date;
  return new Date(date.seconds * 1000);
}

export function formatDate(date: Date | Timestamp): string {
  return timestampToDate(date).toLocaleDateString();
}

export const getProductName = (products: Product[], productId: string) => {
  return products.find((p) => p.id === productId)?.name ?? "Unknown";
};

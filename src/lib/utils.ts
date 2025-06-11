import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { timesOfDay } from "@/types/date";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateInviteCode() {
  const code = Array.from(
    { length: 6 },
    () => 
      "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
  ).join("");

  return code;
}

export function generateOrganizationId() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `org_${timestamp}_${randomPart}`;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
} 

export function generateInvokeId(prefix: string = "inv"): string {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, ""); // e.g., 20250603T153045Z → 20250603153045
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  const randomHex = Array.from(randomBytes, b => b.toString(16).padStart(2, "0")).join(""); // 32 hex chars

  return `${prefix}${timestamp}${randomHex}`;
}

export function formatGreeting(date: Date): string {
  const hour = date.getHours(); 

  const timeOfDay = timesOfDay.find(({ from, to }) => from < to ? hour >= from && hour < to : hour >= from || hour < to);

  return `Good ${timeOfDay?.time || "Day"}`;
}

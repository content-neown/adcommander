import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).format(new Date(date));
}

export function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 3) + "..." : str;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const STAGE_COLORS: Record<string, string> = {
  ideation:  "text-amber-400 bg-amber-400/10 border-amber-400/20",
  scripts:   "text-blue-400 bg-blue-400/10 border-blue-400/20",
  structure: "text-green-400 bg-green-400/10 border-green-400/20",
  creative:  "text-purple-400 bg-purple-400/10 border-purple-400/20",
  launch:    "text-teal-400 bg-teal-400/10 border-teal-400/20",
};

export const STATUS_COLORS: Record<string, string> = {
  draft:    "text-gray-400 bg-gray-400/10",
  active:   "text-green-400 bg-green-400/10",
  paused:   "text-amber-400 bg-amber-400/10",
  archived: "text-red-400 bg-red-400/10",
};

export type Platform = "LinkedIn" | "Facebook" | "Twitter";

export interface Post {
  platform: Platform;
  content: string;
  scheduledDate: string;
}

export interface ImageItem {
  name: string;
  preview: string;
  file?: File;
  blobUrl: string | null;
  uploading: boolean;
}

export interface SavedPost {
  id: string;
  title: string;
  platform: string;
  content: string;
  publishedAt: string;
  images: string[];
  published?: boolean;
}

export const PLATFORM_COLORS: Record<Platform, string> = {
  LinkedIn: "bg-blue-600 text-white",
  Facebook: "bg-indigo-600 text-white",
  Twitter: "bg-sky-400 text-white",
};

export const MONGOLIAN_MONTHS = [
  "1-р сар", "2-р сар", "3-р сар", "4-р сар",
  "5-р сар", "6-р сар", "7-р сар", "8-р сар",
  "9-р сар", "10-р сар", "11-р сар", "12-р сар",
];

export const WEEK_DAYS = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"];

export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function buildCalendarGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

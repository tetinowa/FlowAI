export type Platform = "LinkedIn" | "Twitter/X" | "Facebook" | "Instagram";

export interface CalendarEvent {
  id: number;
  platform: Platform;
  title: string;
  time: string;
  content: string;
  auto: boolean;
}

export type EventsMap = Record<string, CalendarEvent[]>;

export const PLATFORM_COLORS: Record<
  Platform,
  { pill: string; dot: string; badge: string }
> = {
  LinkedIn: {
    pill: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
    badge: "bg-blue-600",
  },
  "Twitter/X": {
    pill: "bg-slate-100 text-slate-700",
    dot: "bg-slate-500",
    badge: "bg-slate-800",
  },
  Facebook: {
    pill: "bg-indigo-100 text-indigo-700",
    dot: "bg-indigo-500",
    badge: "bg-indigo-600",
  },
  Instagram: {
    pill: "bg-pink-100 text-pink-600",
    dot: "bg-pink-500",
    badge: "bg-pink-500",
  },
};

export const PLATFORMS: Platform[] = [
  "LinkedIn",
  "Twitter/X",
  "Facebook",
  "Instagram",
];

export const DAY_NAMES = ["НЯМ", "ДАВ", "МЯГ", "ЛХА", "ПҮР", "БАА", "БМБ"];

export const MONTH_NAMES = [
  "1-р сар",
  "2-р сар",
  "3-р сар",
  "4-р сар",
  "5-р сар",
  "6-р сар",
  "7-р сар",
  "8-р сар",
  "9-р сар",
  "10-р сар",
  "11-р сар",
  "12-р сар",
];

export const INITIAL_EVENTS: EventsMap = {
  "2026-03-07": [
    {
      id: 1,
      platform: "LinkedIn",
      title: "Lin Ho...",
      time: "09:00",
      content:
        "Ready to scale your SaaS? 🚀 CloudSync Pro helps you manage multi-cloud environments from a single dashboard. Stop switching tabs and start shipping faster. ⚡ #SaaS #DevOps #CloudManagement #Efficiency",
      auto: true,
    },
  ],
  "2026-03-10": [
    {
      id: 2,
      platform: "Instagram",
      title: "Ins Re...",
      time: "14:00",
      content: "Behind the scenes of how we build for scale. ✨ #SaaS #Tech",
      auto: false,
    },
  ],
  "2026-03-11": [
    {
      id: 3,
      platform: "Twitter/X",
      title: "Tw...",
      time: "10:00",
      content: "🧵 Thread: 5 ways AI transforms your marketing workflow...",
      auto: true,
    },
    {
      id: 4,
      platform: "LinkedIn",
      title: "Li Ho...",
      time: "16:00",
      content: "How Acme Corp scaled 10x using CloudSync.",
      auto: false,
    },
  ],
};

export let eventIdCounter = 100;
export const nextId = () => ++eventIdCounter;

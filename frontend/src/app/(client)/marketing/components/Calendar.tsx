"use client";
import React, { useState } from "react";
import {
  CalendarEvent,
  EventsMap,
  DAY_NAMES,
  MONTH_NAMES,
  PLATFORM_COLORS,
  Platform,
} from "../types";

interface CalendarProps {
  events: EventsMap;
  selectedDate: string | null;
  onSelectDate: (key: string) => void;
  onDeleteEvent: (dateKey: string, eventId: number) => void;
}

function getKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function Calendar({
  events,
  selectedDate,
  onSelectDate,
  onDeleteEvent,
}: CalendarProps) {
  const [cur, setCur] = useState(new Date(2026, 2, 1));
  const [tooltip, setTooltip] = useState<{
    ev: CalendarEvent;
    x: number;
    y: number;
  } | null>(null);

  const y = cur.getFullYear();
  const m = cur.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();

  const days: { day: number; cur: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--)
    days.push({ day: prevDays - i, cur: false });
  for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, cur: true });
  while (days.length < 42)
    days.push({ day: days.length - daysInMonth - firstDay + 2, cur: false });

  const today = new Date(2026, 2, 11);
  const isToday = (d: number, c: boolean) =>
    c &&
    d === today.getDate() &&
    m === today.getMonth() &&
    y === today.getFullYear();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button className="px-3 py-1.5 text-[11px] font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">
              Сар
            </button>
            <button className="px-3 py-1.5 text-[11px] font-medium text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">
              Долоо хоног
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCur(new Date(y, m - 1, 1))}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span className="text-[13px] font-bold text-gray-800 dark:text-gray-100 min-w-[90px] text-center">
            {y} оны {MONTH_NAMES[m]}
          </span>
          <button
            onClick={() => setCur(new Date(y, m + 1, 1))}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 flex-1" style={{ gridAutoRows: "1fr" }}>
        {days.map(({ day, cur: isCur }, idx) => {
          const key = isCur ? getKey(y, m, day) : "";
          const dayEvs: CalendarEvent[] = isCur ? events[key] || [] : [];
          const tod = isToday(day, isCur);
          const sel = key === selectedDate;

          return (
            <div
              key={idx}
              onClick={() => isCur && onSelectDate(key)}
              className={`border-b border-r border-gray-100 dark:border-gray-800 p-1.5 cursor-pointer overflow-hidden transition-colors
                ${!isCur ? "bg-gray-50/60 dark:bg-gray-800/60" : sel ? "bg-[#5048e5]/10" : "hover:bg-gray-50 dark:hover:bg-gray-800"}
              `}
              style={{ minHeight: 72 }}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[11px] font-semibold w-5 h-5 flex items-center justify-center rounded-full
                  ${tod ? "bg-[#5048e5] text-white" : isCur ? "text-gray-700 dark:text-gray-200" : "text-gray-300 dark:text-gray-600"}`}
                >
                  {day}
                </span>
                {dayEvs.some((e) => e.auto) && (
                  <span className="text-[8px] font-bold text-[#5048e5]">
                    ⚡
                  </span>
                )}
              </div>

              {/* Event chips */}
              <div className="space-y-0.5">
                {dayEvs.slice(0, 2).map((ev) => {
                  const c = PLATFORM_COLORS[ev.platform as Platform];
                  return (
                    <div
                      key={ev.id}
                      className={`cal-event group relative flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold truncate ${c.pill}`}
                      onMouseEnter={(e) =>
                        setTooltip({ ev, x: e.clientX, y: e.clientY })
                      }
                      onMouseLeave={() => setTooltip(null)}
                    >
                      <span
                        className={`w-1 h-1 rounded-full flex-shrink-0 ${c.dot}`}
                      />
                      <span className="truncate">{ev.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteEvent(key, ev.id);
                        }}
                        className="hidden group-hover:flex absolute right-0.5 w-3 h-3 items-center justify-center bg-red-100 text-red-500 rounded text-[8px]"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
                {dayEvs.length > 2 && (
                  <p className="text-[9px] text-gray-400 dark:text-gray-500 pl-1">
                    +{dayEvs.length - 2}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-[11px] rounded-xl p-3 shadow-2xl max-w-[200px] pointer-events-none"
          style={{ left: tooltip.x + 10, top: tooltip.y - 8 }}
        >
          <div className="flex items-center gap-1.5 mb-1.5 font-semibold">
            <span
              className={`w-1.5 h-1.5 rounded-full ${PLATFORM_COLORS[tooltip.ev.platform as Platform].dot}`}
            />
            {tooltip.ev.platform} · {tooltip.ev.time}
          </div>
          <p className="text-gray-300 leading-relaxed text-[10px]">
            {tooltip.ev.content.slice(0, 100)}
            {tooltip.ev.content.length > 100 ? "..." : ""}
          </p>
        </div>
      )}

      <style>{`.cal-event { animation: fadeUp 0.15s ease; } @keyframes fadeUp { from{opacity:0;transform:translateY(-2px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
}

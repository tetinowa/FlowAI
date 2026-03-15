"use client";
import React, { useState } from "react";
import ContentForm, { GeneratedPreview } from "./components/ContentForm";
import Calendar from "./components/Calendar";
import PostPreview from "./components/PostPreview";
import { EventsMap, INITIAL_EVENTS, nextId } from "./types";

function getKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function MarketingApp() {
  const [activeNav, setActiveNav] = useState("Маркетинг AI");
  const [events, setEvents] = useState<EventsMap>(INITIAL_EVENTS);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [preview, setPreview] = useState<GeneratedPreview | null>(null);
  const [aiAdvice, setAiAdvice] = useState(
    "Илүү сайн үр дүнд хүрэхийн тулд тайлбар хэсэгт тодорхой боломжуудыг дурдаарай.",
  );
  const [autoPost, setAutoPost] = useState(true);
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [notif, setNotif] = useState<string | null>(null);

  const showNotif = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  const handleContentGenerated = (p: GeneratedPreview, advice: string) => {
    setPreview(p);
    setAiAdvice(advice);
  };

  const handleSchedule = (p: GeneratedPreview, time: string, auto: boolean) => {
    const today = new Date(2026, 2, 11);
    const key =
      selectedDate ||
      getKey(today.getFullYear(), today.getMonth(), today.getDate());
    setEvents((prev) => ({
      ...prev,
      [key]: [
        ...(prev[key] || []),
        {
          id: nextId(),
          platform: p.platform,
          title: p.title.length > 10 ? p.title.slice(0, 8) + "..." : p.title,
          time,
          content: p.content,
          auto,
        },
      ],
    }));
    setAutoPost(auto);
    setScheduledTime(time);
    setPreview({ ...p });
    showNotif(`✅ ${key} өдөр ${time}-д амжилттай нэмэгдлээ!`);
  };

  const handleDeleteEvent = (dateKey: string, eventId: number) => {
    setEvents((prev) => {
      const updated = (prev[dateKey] || []).filter((e) => e.id !== eventId);
      if (updated.length === 0) {
        const copy = { ...prev };
        delete copy[dateKey];
        return copy;
      }
      return { ...prev, [dateKey]: updated };
    });
    showNotif("🗑️ Устгагдлаа");
  };

  return (
    <div
      className="flex h-screen bg-gray-100 overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 999px; }
        textarea { resize: none; }
        .notif { animation: nSlide 0.3s ease; }
        @keyframes nSlide { from{opacity:0;transform:translateY(-12px) translateX(-50%)} to{opacity:1;transform:translateY(0) translateX(-50%)} }
      `}</style>

      {notif && (
        <div
          className="notif fixed top-4 left-1/2 z-50 px-4 py-2.5 bg-gray-900 text-white text-[12px] font-semibold rounded-full shadow-xl"
          style={{ transform: "translateX(-50%)" }}
        >
          {notif}
        </div>
      )}

      {/* Left form panel */}
      <div className="w-[280px] min-w-[280px] bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        <ContentForm
          onContentGenerated={handleContentGenerated}
          onSchedule={handleSchedule}
          generatedPreview={preview}
        />
      </div>

      {/* Center - Calendar */}
      <div className="flex-1 p-4 min-w-0 overflow-hidden flex flex-col">
        <Calendar
          events={events}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>

      {/* Right preview panel */}
      <div className="w-[268px] min-w-[268px] flex flex-col overflow-hidden">
        <PostPreview
          preview={preview}
          aiAdvice={aiAdvice}
          autoPost={autoPost}
          scheduledDate={selectedDate}
          scheduledTime={scheduledTime}
        />
      </div>
    </div>
  );
}

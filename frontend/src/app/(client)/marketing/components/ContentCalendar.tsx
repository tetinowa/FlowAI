"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Post, ImageItem, SavedPost, MONGOLIAN_MONTHS, WEEK_DAYS, toDateString, buildCalendarGrid } from "./constants";
import { PostCard } from "./PostCard";

interface ContentCalendarProps {
  posts: Post[];
  visiblePosts: number;
  images: ImageItem[];
  onSaved: (post: SavedPost) => void;
  onReset: () => void;
}

export function ContentCalendar({ posts, visiblePosts, images, onSaved, onReset }: ContentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const cells = buildCalendarGrid(year, month);
  const postDates = new Set(posts.map((p) => p.scheduledDate.slice(0, 10)));
  const todayStr = toDateString(new Date());

  function prevMonth() { setCurrentMonth(new Date(year, month - 1, 1)); setSelectedDate(null); }
  function nextMonth() { setCurrentMonth(new Date(year, month + 1, 1)); setSelectedDate(null); }

  function handleDayClick(day: number | null) {
    if (!day) return;
    const dateStr = toDateString(new Date(year, month, day));
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
  }

  const selectedPosts = selectedDate ? posts.filter((p) => p.scheduledDate.slice(0, 10) === selectedDate) : [];
  const displayedPosts = selectedDate ? selectedPosts : posts;

  return (
    <Card className="rounded-2xl shadow p-0">
      <CardHeader className="px-6 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Контент хуанли</CardTitle>
          {posts.length > 0 && (
            <button
              onClick={onReset}
              className="text-xs text-slate-400 dark:text-gray-500 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
              Цэвэрлэх
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mini calendar */}
          <div className="md:w-70 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors" aria-label="Өмнөх сар">
                <ChevronLeft className="size-4 text-slate-600 dark:text-gray-300" />
              </button>
              <span className="text-sm font-semibold text-slate-700 dark:text-gray-200">
                {year} оны {MONGOLIAN_MONTHS[month]}
              </span>
              <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors" aria-label="Дараах сар">
                <ChevronRight className="size-4 text-slate-600 dark:text-gray-300" />
              </button>
            </div>

            <div className="grid grid-cols-7 mb-1">
              {WEEK_DAYS.map((wd) => (
                <div key={wd} className="text-center text-xs font-medium text-slate-400 dark:text-gray-500 py-1">{wd}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />;
                const dateStr = toDateString(new Date(year, month, day));
                const hasPost = postDates.has(dateStr);
                const isSelected = selectedDate === dateStr;
                const isToday = todayStr === dateStr;
                return (
                  <button
                    key={dateStr}
                    onClick={() => handleDayClick(day)}
                    className={[
                      "flex flex-col items-center justify-center rounded-lg py-1 text-sm transition-colors",
                      isSelected ? "bg-[#5048e5] text-white font-semibold"
                        : isToday ? "bg-[#5048e5]/10 text-[#5048e5] font-semibold"
                        : "hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200",
                    ].join(" ")}>
                    <span>{day}</span>
                    {hasPost && (
                      <span className={["mt-0.5 size-1.5 rounded-full", isSelected ? "bg-white" : "bg-[#5048e5]"].join(" ")} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post detail */}
          <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-100 dark:border-gray-800 pt-4 md:pt-0 md:pl-6 overflow-y-auto max-h-105">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-gray-200 mb-3">
              Постын дэлгэрэнгүй
              {selectedDate && <span className="ml-2 text-slate-400 dark:text-gray-500 font-normal">— {selectedDate.slice(0, 10)}</span>}
            </h3>

            {!selectedDate && posts.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-gray-500">
                Контент стратеги үүсгэсний дараа цэнхэр цэгтэй өдрийг дарж постуудыг харна уу.
              </p>
            )}

            {selectedDate && selectedPosts.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-gray-500">Энэ өдөрт пост байхгүй байна.</p>
            )}

            {displayedPosts.length > 0 && (
              <div className="flex flex-col gap-3">
                {!selectedDate && (
                  <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">Нийт {posts.length} пост үүслээ.</p>
                )}
                {displayedPosts.map((post, i) => (
                  <div
                    key={i}
                    className="transition-all duration-300"
                    style={{
                      opacity: i < visiblePosts || visiblePosts === 0 ? 1 : 0,
                      transform: i < visiblePosts || visiblePosts === 0 ? "translateY(0)" : "translateY(8px)",
                    }}>
                    <PostCard
                      post={post}
                      images={images}
                      onSaved={onSaved}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

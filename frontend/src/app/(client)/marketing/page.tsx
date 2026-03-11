"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";

type Platform = "LinkedIn" | "Facebook" | "Twitter";

interface Post {
  platform: Platform;
  content: string;
  scheduledDate: string;
}

const MONGOLIAN_MONTHS = [
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

const WEEK_DAYS = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"];

const PLATFORM_COLORS: Record<Platform, string> = {
  LinkedIn: "bg-blue-600 text-white",
  Facebook: "bg-indigo-600 text-white",
  Twitter: "bg-sky-400 text-white",
};

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildCalendarGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun

  const offset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function MarketingPage() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  async function handleGenerate() {
    if (!productName.trim() || !description.trim() || !targetAudience.trim()) {
      return;
    }
    setLoading(true);
    setAdvice(null);
    setPosts([]);
    setSelectedDate(null);
    try {
      const res = await fetch("/api/marketing-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, description, targetAudience }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Алдаа гарлаа");
      setAdvice(data.advice ?? null);
      setPosts(data.posts ?? []);
    } catch (err) {
      console.error(err);
      setAdvice("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  }

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const cells = buildCalendarGrid(year, month);
  const postDates = new Set(posts.map((p) => p.scheduledDate));
  const todayStr = toDateString(new Date());

  function prevMonth() {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null);
  }
  function nextMonth() {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null);
  }

  function handleDayClick(day: number | null) {
    if (!day) return;
    const dateStr = toDateString(new Date(year, month, day));
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
  }

  const selectedPosts = selectedDate
    ? posts.filter((p) => p.scheduledDate === selectedDate)
    : [];

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Маркетинг</h1>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-100">
          <Card className="rounded-2xl shadow p-0">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-2xl font-bold text-slate-900">
                Стратеги боловсруулах
              </CardTitle>
              <p className="text-slate-500 text-sm mt-1">
                Маркетинг AI-тай ярьж тантай тохирсон 30 хоногийн контент
                төлөвлөгөө гаргаарай
              </p>
            </CardHeader>

            <CardContent className="px-6 pb-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="productName">Бүтээгдэхүүний нэр</Label>
                <Input
                  id="productName"
                  placeholder="е.g. CloudSync Pro"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Бүтээгдэхүүний тайлбар</Label>
                <Textarea
                  id="description"
                  placeholder="Ямар асуудлыг шийдэх вэ?"
                  className="h-24 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="targetAudience">Зорилгот хэрэглэгч</Label>
                <Input
                  id="targetAudience"
                  placeholder="е.g. Стартап болон жижиг бизнесүүд"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleGenerate}
                disabled={loading}>
                {loading ? "Үүсгэж байна..." : "Контент стратеги гаргах"}
              </Button>

              {/* Advice card */}
              {advice && (
                <div className="flex gap-3 rounded-xl bg-blue-50 border border-blue-100 p-4 mt-1">
                  <Lightbulb className="size-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-700 mb-1">
                      AI зөвлөгөө
                    </p>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      {advice}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 w-full">
          <Card className="rounded-2xl shadow p-0">
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-xl font-bold text-slate-900">
                Контент хуанли
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-70 shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={prevMonth}
                      className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                      aria-label="Өмнөх сар">
                      <ChevronLeft className="size-4 text-slate-600" />
                    </button>
                    <span className="text-sm font-semibold text-slate-700">
                      {year} оны {MONGOLIAN_MONTHS[month]}
                    </span>
                    <button
                      onClick={nextMonth}
                      className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                      aria-label="Дараах сар">
                      <ChevronRight className="size-4 text-slate-600" />
                    </button>
                  </div>

                  {/* Week day headers */}
                  <div className="grid grid-cols-7 mb-1">
                    {WEEK_DAYS.map((wd) => (
                      <div
                        key={wd}
                        className="text-center text-xs font-medium text-slate-400 py-1">
                        {wd}
                      </div>
                    ))}
                  </div>

                  {/* Day cells */}
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
                            isSelected
                              ? "bg-blue-600 text-white font-semibold"
                              : isToday
                                ? "bg-blue-50 text-blue-700 font-semibold"
                                : "hover:bg-slate-100 text-slate-700",
                          ].join(" ")}>
                          <span>{day}</span>
                          {hasPost && (
                            <span
                              className={[
                                "mt-0.5 size-1.5 rounded-full",
                                isSelected ? "bg-white" : "bg-blue-500",
                              ].join(" ")}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ---- Post detail (right) ---- */}
                <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 overflow-y-auto max-h-105">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">
                    Постын дэлгэрэнгүй
                    {selectedDate && (
                      <span className="ml-2 text-slate-400 font-normal">
                        — {selectedDate}
                      </span>
                    )}
                  </h3>

                  {!selectedDate && posts.length === 0 && (
                    <p className="text-sm text-slate-400">
                      Контент стратеги үүсгэсний дараа цэнхэр цэгтэй өдрийг дарж
                      постуудыг харна уу.
                    </p>
                  )}

                  {selectedDate && selectedPosts.length === 0 && (
                    <p className="text-sm text-slate-400">
                      Энэ өдөрт пост байхгүй байна.
                    </p>
                  )}

                  {selectedDate && selectedPosts.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {selectedPosts.map((post, i) => (
                        <PostCard key={i} post={post} />
                      ))}
                    </div>
                  )}

                  {!selectedDate && posts.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <p className="text-xs text-slate-500 mb-1">
                        Нийт {posts.length} пост үүслээ.
                      </p>
                      {posts.map((post, i) => (
                        <PostCard key={i} post={post} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { getToken } = useAuth();
  const badgeClass =
    PLATFORM_COLORS[post.platform] ?? "bg-slate-200 text-slate-700";

  async function handleSave() {
    setSaving(true);
    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: post.content,
          platform: post.platform,
          scheduledDate: post.scheduledDate,
        }),
      });
      setSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span
          className={[
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
            badgeClass,
          ].join(" ")}>
          {post.platform === "LinkedIn" && (
            <span className="font-bold leading-none">in</span>
          )}
          {post.platform}
        </span>
        <span className="text-xs text-slate-400">{post.scheduledDate}</span>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </p>

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={saving || saved}
          className={saved ? "border-green-500 text-green-600" : ""}>
          {saving ? "Хадгалж байна..." : saved ? "✓ Хадгалагдсан" : "Хадгалах"}
        </Button>
      </div>
    </div>
  );
}

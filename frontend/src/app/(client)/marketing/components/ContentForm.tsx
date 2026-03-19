"use client";
import React, { useState } from "react";
import { Platform, PLATFORMS, PLATFORM_COLORS } from "../types";

export interface GeneratedPreview {
  platform: Platform;
  content: string;
  title: string;
}

interface ContentFormProps {
  onContentGenerated: (preview: GeneratedPreview, advice: string) => void;
  onSchedule: (
    preview: GeneratedPreview,
    time: string,
    autoPost: boolean,
  ) => void;
  generatedPreview: GeneratedPreview | null;
}

function fallbackContent(
  name: string,
  desc: string,
  audience: string,
  platform: Platform,
): string {
  const map: Record<Platform, string> = {
    LinkedIn: `🚀 ${name} — ${desc || "Innovating the future"}.\n\nPerfect for ${audience || "SaaS founders"}. Stop switching tabs and start shipping faster. ⚡\n\n#SaaS #ProductLaunch #B2B #Efficiency`,
    "Twitter/X": `Just dropped: ${name} 🔥\n\n${desc || "Game-changing for teams"}\n\nThread below 👇 #SaaS #Tech #Startup`,
    Facebook: `We're excited to introduce ${name}! 🎉\n\n${desc || "Built for modern teams."}\n\nTag someone who needs this. ↓`,
    Instagram: `✨ Introducing ${name}\n\n${desc || "The tool you've been waiting for."}\n\n#${name.replace(/\s/g, "") || "SaaS"} #CloudTech #Innovation`,
  };
  return map[platform];
}

export default function ContentForm({
  onContentGenerated,
  onSchedule,
  generatedPreview,
}: ContentFormProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState<Platform>("LinkedIn");
  const [time, setTime] = useState("09:00");
  const [autoPost, setAutoPost] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleGenerate = async () => {
    if (!name.trim()) {
      setErr("Бүтээгдэхүүний нэрийг оруулна уу!");
      return;
    }
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system:
            "You are a professional social media copywriter. Return ONLY the post text, no preamble.",
          messages: [
            {
              role: "user",
              content: `Write a ${platform} post.\nProduct: ${name}\nDescription: ${desc || "A powerful SaaS tool"}\nAudience: ${audience || "SaaS founders"}`,
            },
          ],
        }),
      });
      const data = await res.json();
      const content =
        data.content?.[0]?.text ||
        fallbackContent(name, desc, audience, platform);
      const preview: GeneratedPreview = { platform, content, title: name };

      let advice = "Тайлбар хэсэгт тодорхой боломжуудыг дурдаарай.";
      try {
        const ar = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 150,
            messages: [
              {
                role: "user",
                content: `Give ONE brief Mongolian tip (1-2 sentences) to improve this ${platform} post: "${content.slice(0, 200)}"`,
              },
            ],
          }),
        });
        const ad = await ar.json();
        advice = ad.content?.[0]?.text || advice;
      } catch (_) {}

      onContentGenerated(preview, advice);
    } catch (_) {
      const content = fallbackContent(name, desc, audience, platform);
      onContentGenerated(
        { platform, content, title: name },
        "Тайлбар хэсэгт тодорхой боломжуудыг дурдаарай.",
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white dark:bg-gray-900">
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-[18px] font-bold text-gray-900 dark:text-white leading-tight">
          Стратеги боловсруулах
        </h1>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
          Манай AI-д өөрийн бүтээгдэхүүний мэдээллийг өгч 30 хоногийн контент
          төлөвлөгөөг гаргаарай.
        </p>
      </div>

      <div className="px-5 py-4 space-y-4 flex-1">
        {/* Product name */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
            Бүтээгдэхүүний нэр
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ж.нь: CloudSync Pro"
            className="w-full px-3 py-2.5 text-[13px] border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 placeholder-gray-300 dark:placeholder-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5048e5]/30 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
            Бүтээгдэхүүний тайлбар
          </label>
          <textarea
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Ямар асуудлыг шийддэг вэ?"
            className="w-full px-3 py-2.5 text-[13px] border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 placeholder-gray-300 dark:placeholder-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5048e5]/30 focus:border-transparent"
            style={{ resize: "none" }}
          />
        </div>

        {/* Target audience */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
            Зорилтот хэрэглэгч
          </label>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="ж.нь: Стартап үүсгэн байгуулагчид, SaaS хэ..."
            className="w-full px-3 py-2.5 text-[13px] border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 placeholder-gray-300 dark:placeholder-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5048e5]/30 focus:border-transparent"
          />
        </div>

        {err && <p className="text-[11px] text-red-500">{err}</p>}

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          style={{
            background: "#5048e5",
          }}
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Үүсгэж байна...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Контент төлөвлөгөө гаргах
            </>
          )}
        </button>

        {/* Schedule panel */}
        {generatedPreview && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800 space-y-3">
            <p className="text-[11px] font-bold text-gray-600 dark:text-gray-300">
              📅 Хуанлид нэмэх
            </p>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-[12px] px-2 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#5048e5]/30"
              />
              <label className="flex items-center gap-1.5 cursor-pointer ml-auto">
                <span className="text-[11px] text-gray-500 dark:text-gray-400">Авто</span>
                <div
                  onClick={() => setAutoPost(!autoPost)}
                  className={`relative w-8 h-4 rounded-full transition-colors cursor-pointer ${autoPost ? "bg-[#5048e5]" : "bg-gray-300 dark:bg-gray-600"}`}
                >
                  <div
                    className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${autoPost ? "translate-x-4" : "translate-x-0.5"}`}
                  />
                </div>
              </label>
            </div>
            <button
              onClick={() => onSchedule(generatedPreview, time, autoPost)}
              className="w-full py-2 rounded-lg text-[12px] font-bold text-white bg-[#5048e5] hover:bg-[#4038d4] transition-colors"
            >
              Хуанлид нэмэх →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

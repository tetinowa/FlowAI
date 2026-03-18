"use client";
import { Lightbulb } from "lucide-react";
import type { AiResult } from "../page";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface AISectionProps {
  aiResult: AiResult | null;
}

export const AISection = ({ aiResult }: AISectionProps) => {
  const { getToken } = useAuth();
  const [saved, setSaved] = useState<{ summary: string; tips: string[] } | null>(null);

  useEffect(() => {
    if (aiResult) return;
    async function fetchLatest() {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/analyses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setSaved({ summary: data.data[0].summary, tips: data.data[0].tips });
      }
    }
    fetchLatest();
  }, [aiResult]);

  const summary = aiResult?.summary ?? saved?.summary ?? "AI шинжилгээ хийснээр энд дүгнэлт харагдана.";
  const tips: string[] = aiResult?.tips ?? saved?.tips ?? [];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#5048e5]/10 dark:border-[#5048e5]/30 p-6 flex flex-col md:flex-row items-center gap-6 transition-colors">
      <div className="bg-blue-500 dark:bg-slate-800 w-full min-h-40 rounded-3xl flex flex-col md:flex-row items-start md:items-center p-6 md:p-10 gap-5 transition-colors">
        <div className="bg-blue-600 dark:bg-slate-700 text-white w-12 h-12 rounded-md flex items-center justify-center shrink-0">
          <Lightbulb strokeWidth={4} />
        </div>
        <div className="flex flex-col flex-1 min-w-0 gap-1">
          <p className="text-white text-[20px] font-bold">
            AI Санхүүгийн дүн шинжилгээ
          </p>
          <p className="text-white/90 dark:text-gray-300 text-[15px] leading-relaxed">
            {summary}
          </p>
          {tips.map((tip, i) => (
            <p key={i} className="text-white/75 text-sm mt-1">💡 {tip}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

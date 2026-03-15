"use client";
import { Lightbulb } from 'lucide-react';
import type { AiResult } from "../page";

interface AISectionProps {
    aiResult: AiResult | null;
}

export const AISection = ({ aiResult }: AISectionProps) => {
    const summary = aiResult?.summary ?? "AI шинжилгээ хийснээр энд дүгнэлт харагдана.";
    const firstTip = aiResult?.tips?.[0] ?? null;

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
                    {firstTip && (
                        <p className="text-white/75 text-sm mt-1">💡 {firstTip}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

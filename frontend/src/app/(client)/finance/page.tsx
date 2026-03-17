"use client";
import { useState } from "react";
import { AISection } from "./_components/AISection";
import { Dashboard } from "./_components/Dashboard";
import FileUpload from "./_components/FileUpload";
import { GraphicSection } from "./_components/GraphicSection";
import { HeadSection } from "./_components/HeadSection";
import FinanceForm from "./_components/FinanceForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface AiCategory {
  name: string;
  total: number;
}

export interface AiMonthly {
  month: string;
  income: AiCategory[];
  expenses: AiCategory[];
}

export interface AiResult {
  summary: string;
  monthly: AiMonthly[];
  income: AiCategory[];
  expenses: AiCategory[];
  tips: string[];
}

export default function Finance() {
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-muted/30 text-foreground">
      <HeadSection />
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 px-5 py-2.5 rounded-xl
        bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/30
        hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl
        active:translate-y-0 transition-all duration-200"
      >
        <span className="text-lg leading-none transition-transform duration-200 group-hover:rotate-90">
          +
        </span>
        Санхүү нэмэх
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <FinanceForm onClose={() => setOpen(false)} />
        </div>
      )}

      <FileUpload onResult={(result) => setAiResult(result)} />
      <Dashboard aiResult={aiResult} />
      <AISection aiResult={aiResult} />
      <GraphicSection aiResult={aiResult} />
    </div>
  );
}

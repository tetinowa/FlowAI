"use client";
import { useState } from "react";
import FileUpload from "./_components/FileUpload";
import { HeadSection } from "./_components/HeadSection";

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
      <FileUpload onResult={(result) => setAiResult(result)} />
    </div>
  );
}

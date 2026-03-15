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
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-muted/30 text-foreground">
      <div className="flex items-start justify-between gap-4">
        <HeadSection />
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 mt-4"
        >
          <Plus className="w-4 h-4 mr-1" /> Мэдээлэл нэмэх
        </Button>
      </div>
      {showForm && <FinanceForm onClose={() => setShowForm(false)} />}
      <FileUpload onResult={(result) => setAiResult(result)} />
      <Dashboard categories={aiResult?.expenses ?? null} />
      <AISection aiResult={aiResult} />
      <GraphicSection aiResult={aiResult} />
    </div>
  );
}

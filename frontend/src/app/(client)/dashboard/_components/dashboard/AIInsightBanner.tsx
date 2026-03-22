"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/apiFetch";

export function AIInsightBanner() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState<string | null>(null);
  const [tip, setTip] = useState<string | null>(null);

  useEffect(() => {
    getToken().then((token) => {
      apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/analysis`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((json) => {
          const latest = json.data?.[0];
          if (!latest) return;
          setSummary(latest.summary ?? null);
          const tips = latest.tips;
          if (Array.isArray(tips) && tips.length > 0) setTip(tips[0]);
        })
        .catch(console.error);
    });
  }, [getToken]);

  if (!summary && !tip) return null;

  return (
    <section className="bg-[#5048e5]/5 rounded-xl border border-[#5048e5]/10 p-6 flex flex-col md:flex-row items-center gap-6">
      <div className="w-12 h-12 rounded-full bg-[#5048e5]/20 flex items-center justify-center text-[#5048e5] shrink-0">
        <Lightbulb className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-foreground">AI Зөвлөмж</h4>
        <p className="text-sm text-muted-foreground mt-1">{tip ?? summary}</p>
      </div>
      <Button
        onClick={() => router.push("/finance")}
        className="bg-[#5048e5] hover:bg-[#4038d4] text-white whitespace-nowrap"
      >
        Дэлгэрэнгүй харах
      </Button>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Wallet } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { apiFetch } from "@/lib/apiFetch";
import { FinanceReportSmall } from "./FinanceReportSmall";
import { AiResult } from "@/app/(client)/finance/page";

export function FinanceSection() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [aiResult, setAiResult] = useState<AiResult | null>(null);

  useEffect(() => {
    getToken().then((token) => {
      apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/analysis`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((json) => {
          const analyses = json.data ?? [];
          if (analyses.length === 0) return;

          const allIncome: any[] = [];
          const allExpenses: any[] = [];
          const allMonthly: any[] = [];
          const allTips: string[] = [];
          let latestSummary = "";

          for (const item of analyses) {
            const cats = item.categories as any;
            if (cats?.income) allIncome.push(...cats.income);
            if (cats?.expenses) allExpenses.push(...cats.expenses);
            if (item.monthly) allMonthly.push(...item.monthly);
            if (item.tips) allTips.push(...item.tips);
            if (!latestSummary && item.summary) latestSummary = item.summary;
          }
          const mergeCategories = (arr: any[]) => {
            const map = new Map<string, number>();
            for (const c of arr) {
              map.set(c.name, (map.get(c.name) ?? 0) + (c.total ?? 0));
            }
            return Array.from(map, ([name, total]) => ({ name, total }));
          };

          const mergeMonthly = (arr: any[]) => {
            const map = new Map<string, any>();
            for (const m of arr) {
              const key = m.month;
              if (!map.has(key)) {
                map.set(key, {
                  month: key,
                  income: [...(m.income ?? [])],
                  expenses: [...(m.expenses ?? [])],
                });
              } else {
                const existing = map.get(key);
                existing.income.push(...(m.income ?? []));
                existing.expenses.push(...(m.expenses ?? []));
              }
            }
            // Сар бүрийн income/expenses доторх ижил ангилалыг нэгтгэнэ
            for (const val of map.values()) {
              val.income = mergeCategories(val.income);
              val.expenses = mergeCategories(val.expenses);
            }
            return Array.from(map.values()).sort((a, b) =>
              a.month.localeCompare(b.month),
            );
          };

          setAiResult({
            summary: latestSummary,
            tips: [...new Set(allTips)],
            monthly: mergeMonthly(allMonthly),
            income: mergeCategories(allIncome),
            expenses: mergeCategories(allExpenses),
          });
        })
        .catch(console.error);
    });
  }, [getToken]);

  const revenue = (aiResult?.income ?? []).reduce(
    (s, c: any) => s + (c.total ?? 0),
    0,
  );
  const expense = (aiResult?.expenses ?? []).reduce(
    (s, c: any) => s + (c.total ?? 0),
    0,
  );
  const netProfit = revenue - expense;

  const fmt = (n: number) => `₮${n.toLocaleString()}`;

  const monthlyData = aiResult?.monthly ?? [];
  const profitPct =
    revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : "0";
  const expensePct = revenue > 0 ? ((expense / revenue) * 100).toFixed(1) : "0";
  const maxRevenue = Math.max(
    ...monthlyData.map((m: any) =>
      (m.income ?? []).reduce((s: number, c: any) => s + (c.total ?? 0), 0),
    ),
    1,
  );
  const revenueBars = monthlyData.slice(0, 6).map((m: any) => {
    const rev = (m.income ?? []).reduce(
      (s: number, c: any) => s + (c.total ?? 0),
      0,
    );
    return Math.round((rev / maxRevenue) * 100);
  });
  while (revenueBars.length < 6) revenueBars.push(0);

  const maxExpense = Math.max(
    ...monthlyData.map((m: any) =>
      (m.expenses ?? []).reduce((s: number, c: any) => s + (c.total ?? 0), 0),
    ),
    1,
  );
  const expenseBars = monthlyData.slice(0, 5).map((m: any) => {
    const exp = (m.expenses ?? []).reduce(
      (s: number, c: any) => s + (c.total ?? 0),
      0,
    );
    return Math.round((exp / maxExpense) * 100);
  });
  while (expenseBars.length < 5) expenseBars.push(0);

  return (
    <section className="space-y-4">
      <SectionHeader
        icon={Wallet}
        title="Санхүүгийн тойм"
        linkLabel="Дэлгэрэнгүй харах"
        onLinkClick={() => router.push("/finance")}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Нийт орлого */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Нийт орлого
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[#16a34a]">
              {fmt(revenue)}
            </span>
            {/* <span className="text-xs font-bold text-emerald-500">
              +{profitPct}%
            </span> */}
          </div>
        </div>

        {/* Нийт зарлага */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Нийт зарлага
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[#dc2626]">
              {fmt(expense)}
            </span>
            {/* <span className="text-xs font-bold text-rose-500">
              -{expensePct}%
            </span> */}
          </div>
        </div>

        {/* Цэвэр ашиг */}
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Ашиг</p>
            <p
              className={`text-2xl font-bold ${netProfit >= 0 ? "text-[#16a34a]" : "text-rose-500"}`}
            >
              {netProfit >= 0 ? "+" : ""}
              {fmt(netProfit)}
            </p>
            <p className="text-xs text-muted-foreground">Орлого - Зарлага</p>
          </div>
          <div className="h-16 w-32 flex items-end gap-1"></div>
        </div>
      </div>
      <FinanceReportSmall aiResult={aiResult} />
    </section>
  );
}

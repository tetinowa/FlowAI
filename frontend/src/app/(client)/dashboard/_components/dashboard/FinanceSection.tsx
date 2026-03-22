"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Wallet } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { apiFetch } from "@/lib/apiFetch";
import { FinanceReport } from "@/app/(client)/finance/_components/FinanceReport";
import { FinanceReportSmall } from "./FinanceReportSmall";
import { AiResult } from "@/app/(client)/finance/page";
import { get } from "http";

interface FinanceRecord {
  revenue: number;
  expense: number;
  netProfit: number;
}

export function FinanceSection() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [revenue, setRevenue] = useState(0);
  const [expense, setExpense] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);

  useEffect(() => {
    getToken().then((token) => {
      apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance/analysis`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((json) => {
          const latest = json.data?.[0];
          if (!latest) return;
          setAiResult({
            summary: latest.summary,
            tips: latest.tips,
            monthly: latest.monthly,
            income: (latest.categories as any)?.income ?? [],
            expenses: (latest.categories as any)?.expenses ?? [],
          });
        })
        .catch(console.error);
    });

    getToken().then((token) => {
      apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((json) => {
          if (!json.data) return;
          const data: FinanceRecord[] = json.data;
          setRecords(data);
          setRevenue(data.reduce((s, r) => s + (r.revenue ?? 0), 0));
          setExpense(data.reduce((s, r) => s + (r.expense ?? 0), 0));
          setNetProfit(data.reduce((s, r) => s + (r.netProfit ?? 0), 0));
        })
        .catch(console.error);
    });
  }, [getToken]);

  const fmt = (n: number) => `₮${n.toLocaleString()}`;
  const profitPct =
    revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : "0";
  const expensePct = revenue > 0 ? ((expense / revenue) * 100).toFixed(1) : "0";
  const revenueProgress =
    revenue > 0 ? Math.min((revenue / (revenue + expense)) * 100, 100) : 0;

  const maxExpense = Math.max(...records.map((r) => r.expense ?? 0), 1);
  const expenseBars = records
    .slice(0, 5)
    .map((r) => Math.round(((r.expense ?? 0) / maxExpense) * 100));
  while (expenseBars.length < 5) expenseBars.push(0);

  const maxRevenue = Math.max(...records.map((r) => r.revenue ?? 0), 1);
  const revenueBars = records
    .slice(0, 6)
    .map((r) => Math.round(((r.revenue ?? 0) / maxRevenue) * 100));
  while (revenueBars.length < 6) revenueBars.push(0);

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
            <span className="text-2xl font-bold text-foreground">
              {fmt(revenue)}
            </span>
            <span className="text-xs font-bold text-emerald-500">
              +{profitPct}%
            </span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="bg-[#5048e5] h-full rounded-full"
              style={{ width: `${revenueProgress}%` }}
            />
          </div>
        </div>

        {/* Нийт зарлага */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Нийт зарлага
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-foreground">
              {fmt(expense)}
            </span>
            <span className="text-xs font-bold text-rose-500">
              -{expensePct}%
            </span>
          </div>
          <div className="mt-4 h-8 flex items-end gap-0.5">
            {expenseBars.map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm ${i === expenseBars.indexOf(Math.max(...expenseBars)) ? "bg-[#5048e5]" : "bg-[#5048e5]/30"}`}
                style={{ height: `${Math.max(h, 5)}%` }}
              />
            ))}
          </div>
        </div>

        {/* Цэвэр ашиг */}
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Цэвэр ашиг
            </p>
            <p
              className={`text-2xl font-bold ${netProfit >= 0 ? "text-foreground" : "text-rose-500"}`}
            >
              {netProfit >= 0 ? "+" : ""}
              {fmt(netProfit)}
            </p>
            <p className="text-xs text-muted-foreground">Орлого - Зарлага</p>
          </div>
          <div className="h-16 w-32 flex items-end gap-1">
            {revenueBars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${Math.max(h, 5)}%`,
                  backgroundColor: `rgba(80,72,229,${0.1 + i * 0.15})`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <FinanceReportSmall aiResult={aiResult} />
    </section>
  );
}

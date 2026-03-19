"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AiCategory, AiResult } from "../page";
import { useMemo, useState } from "react";
import { RevenueCard } from "./RevenueCard";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Sparkles } from "lucide-react";

interface GraphicSectionProps {
  aiResult: AiResult | null;
  transactions?: {
    date: string;
    description: string;
    amount: number;
    type: string;
  }[];
}

export const FinanceReport = ({
  aiResult,
  transactions = [],
}: GraphicSectionProps) => {
  const [revenue, setRevenue] = useState(0);
  const [expense, setExpense] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [monthIndex, setMonthIndex] = useState(0);

  const MONTH_NAMES = [
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

  const COLORS = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#f43f5e",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#84cc16",
    "#f97316",
  ];

  const monthlyGroups = useMemo(() => {
    const map = new Map<string, typeof transactions>();
    (transactions ?? []).forEach((tx) => {
      const d = tx.date ?? "";
      const key = d.length >= 7 ? d.slice(0, 7) : "unknown";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(tx);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [transactions]);

  const currentMonth = monthlyGroups[monthIndex];
  const currentKey = currentMonth?.[0] ?? "";
  const currentTransactions = currentMonth?.[1] ?? [];

  const monthLabel =
    currentKey !== "unknown"
      ? `${currentKey.slice(0, 4)} оны ${MONTH_NAMES[Number(currentKey.slice(5, 7)) - 1]}`
      : "Тодорхойгүй";

  const expenseData = (aiResult?.expenses ?? [])
    .filter((c: AiCategory) => c.total > 0)
    .map((c: AiCategory) => ({ name: c.name, value: c.total }));

  const totalExpense = expenseData.reduce(
    (s: number, c: any) => s + c.value,
    0,
  );

  const displayRevenue = aiResult?.income
    ? aiResult.income.reduce(
        (s: number, c: AiCategory) => s + (c.total ?? 0),
        0,
      )
    : revenue;
  const displayExpense = aiResult?.expenses
    ? aiResult.expenses.reduce(
        (s: number, c: AiCategory) => s + (c.total ?? 0),
        0,
      )
    : expense;
  const displayNetProfit = displayRevenue - displayExpense;

  const max = Math.max(displayRevenue, displayExpense, 1);
  const fmt = (n: number) => `₮${n.toLocaleString()}`;

  const cards = [
    {
      id: 1,
      title: "Нийт орлого",
      amount: fmt(displayRevenue),
      percentage:
        displayRevenue >= displayExpense
          ? `+${((displayRevenue / (displayExpense || 1)) * 100 - 100).toFixed(1)}%`
          : "0%",
      progress: Math.round((displayRevenue / max) * 100),
    },
    {
      id: 2,
      title: "Нийт зарлага",
      amount: fmt(displayExpense),
      percentage:
        displayExpense > 0
          ? `-${((displayExpense / (displayRevenue || 1)) * 100).toFixed(1)}%`
          : "0%",
      progress: Math.round((displayExpense / max) * 100),
    },
    {
      id: 3,
      title: "Цэвэр ашиг",
      amount: fmt(displayNetProfit),
      percentage:
        displayNetProfit >= 0
          ? `+${displayNetProfit > 0 ? ((displayNetProfit / (displayRevenue || 1)) * 100).toFixed(1) : 0}%`
          : `-${((Math.abs(displayNetProfit) / (displayRevenue || 1)) * 100).toFixed(1)}%`,
      progress:
        displayRevenue > 0
          ? Math.min(Math.round((displayNetProfit / displayRevenue) * 100), 100)
          : 0,
    },
  ];
  return (
    <div className="bg-slate-50 dark:bg-slate-900 px-2 py-6 md:p-8 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="font-bold text-lg text-slate-800 dark:text-slate-100">FlowAI Тайлан</div>
        <span className="text-xs text-slate-400">{new Date().toLocaleDateString("mn-MN")}</span>
      </div>

      <Card className="max-w-8xl mx-auto shadow-md rounded-2xl border border-slate-100 dark:border-slate-700">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-row justify-start mb-6 text-sm text-gray-500 gap-2">
            <p>Үүсгэсэн огноо:</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {new Date().toLocaleDateString("mn-MN")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {cards.map((item) => (
              <RevenueCard
                key={item.id}
                title={item.title}
                amount={item.amount}
                percentage={item.percentage}
                progress={item.progress}
              />
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-10 mb-10">
            {/* Зүүн тал — progress bar жагсаалт */}
            <div>
              <h3 className="font-semibold mb-4">Зардлын ангилал</h3>
              <div className="space-y-4">
                {expenseData.map((cat: any, i: number) => {
                  const pct =
                    totalExpense > 0
                      ? ((cat.value / totalExpense) * 100).toFixed(1)
                      : "0";
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{cat.name}</span>
                        <span>
                          ₮{cat.value.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded">
                        <div
                          className="h-2 rounded transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: COLORS[i % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Баруун тал — PieChart */}
            <div className="flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    dataKey="value"
                    paddingAngle={2}
                    stroke="none"
                  >
                    {expenseData.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [`₮${Number(val).toLocaleString()}`, name]}
                    contentStyle={{ borderRadius: "10px", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1 justify-center">
                {expenseData.map((cat: any, i: number) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-indigo-600 border-b-2 border-indigo-200 pb-2">
              Дэлгэрэнгүй гүйлгээнүүд
            </h3>

            {monthlyGroups.length > 0 && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMonthIndex((p) => Math.max(p - 1, 0))}
                  disabled={monthIndex === 0}
                  className="text-indigo-600 disabled:text-gray-300 font-bold text-lg"
                >
                  ←
                </button>
                <span className="font-semibold text-sm min-w-35 text-center">
                  {monthLabel} ({currentTransactions.length})
                </span>
                <button
                  onClick={() =>
                    setMonthIndex((p) =>
                      Math.min(p + 1, monthlyGroups.length - 1),
                    )
                  }
                  disabled={monthIndex === monthlyGroups.length - 1}
                  className="text-indigo-600 disabled:text-gray-300 font-bold text-lg"
                >
                  →
                </button>
              </div>
            )}

            {currentTransactions.length === 0 ? (
              <p className="text-gray-400 text-sm py-4">
                Гүйлгээ байхгүй байна.
              </p>
            ) : (
              <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 mt-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wide">
                      <th className="text-left py-3 px-3 font-semibold">Огноо</th>
                      <th className="text-left px-3 font-semibold">Гүйлгээний утга</th>
                      <th className="text-right px-3 font-semibold">Орлого</th>
                      <th className="text-right px-3 font-semibold">Зарлага</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showAll
                      ? currentTransactions
                      : currentTransactions.slice(0, 10)
                    ).map((tx, i) => (
                      <tr
                        key={i}
                        className={`border-t border-gray-50 dark:border-slate-700/50 transition-colors ${
                          tx.type === "income"
                            ? "bg-emerald-50/60 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                            : "bg-red-50/40 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20"
                        }`}
                      >
                        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {tx.date?.slice(0, 10)}
                        </td>
                        <td className="px-3 text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
                          {tx.description}
                        </td>
                        <td className="text-right px-3 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          {tx.type === "income" ? `+₮${tx.amount.toLocaleString()}` : ""}
                        </td>
                        <td className="text-right px-3 font-semibold text-red-500 dark:text-red-400 whitespace-nowrap">
                          {tx.type === "expense" ? `-₮${tx.amount.toLocaleString()}` : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {currentTransactions.length > 10 && (
                    <tbody>
                      <tr>
                        <td colSpan={4} className="text-center py-3 bg-white dark:bg-slate-800">
                          <button
                            onClick={() => setShowAll(!showAll)}
                            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 text-sm font-medium"
                          >
                            {showAll
                              ? "Хураах ▲"
                              : `Бүгдийг харах (${currentTransactions.length} гүйлгээ) ▼`}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  )}
                  <tfoot className="bg-gray-50 dark:bg-slate-800 font-semibold border-t-2 border-gray-100 dark:border-slate-700">
                    <tr>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-200" colSpan={2}>
                        Нийт ({currentTransactions.length} гүйлгээ)
                      </td>
                      <td className="text-emerald-600 dark:text-emerald-400 text-right px-3">
                        +₮{currentTransactions
                          .filter((t) => t.type === "income")
                          .reduce((s, t) => s + t.amount, 0)
                          .toLocaleString()}
                      </td>
                      <td className="text-red-500 dark:text-red-400 text-right px-3">
                        -₮{currentTransactions
                          .filter((t) => t.type === "expense")
                          .reduce((s, t) => s + t.amount, 0)
                          .toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="w-full mt-4 border-indigo-100 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-indigo-700 dark:text-indigo-300">
            <Sparkles className="h-5 w-5" />
            Ерөнхий дүгнэлт
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
            {aiResult?.summary ??
              "AI шинжилгээ хийснээр энд дүгнэлт харагдана."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

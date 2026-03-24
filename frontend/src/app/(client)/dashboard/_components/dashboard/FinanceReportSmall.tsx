"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { AiResult } from "@/app/(client)/finance/page";

interface GraphicSectionProps {
  aiResult: AiResult | null;
  transactions?: {
    date: string;
    description: string;
    amount: number;
    type: string;
  }[];
}

export const FinanceReportSmall = ({ aiResult }: GraphicSectionProps) => {
  const [monthIndex, setMonthIndex] = useState(-1);

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

  const monthlyData = aiResult?.monthly ?? [];
  const currentMonthData = monthlyData[monthIndex];
  const currentKey = currentMonthData?.month ?? "";

  const monthLabel =
    currentKey && currentKey.length >= 7
      ? `${currentKey.slice(0, 4)} оны ${MONTH_NAMES[Number(currentKey.slice(5, 7)) - 1]}`
      : "Бүх сар";


  const expenseData = (
    monthIndex === -1
      ? (aiResult?.expenses ?? [])
      : (currentMonthData?.expenses ?? [])
  )
    .filter((c: any) => c.total > 0)
    .map((c: any) => ({ name: c.name, value: c.total }));

  const incomeData = (
    monthIndex === -1
      ? (aiResult?.income ?? [])
      : (currentMonthData?.income ?? [])
  )
    .filter((c: any) => c.total > 0)
    .map((c: any) => ({ name: c.name, value: c.total }));

  const totalIncome = incomeData.reduce((s: number, c: any) => s + c.value, 0);

  const totalExpense = expenseData.reduce(
    (s: number, c: any) => s + c.value,
    0,
  );

  console.log("expenseData", expenseData);
  console.log("totalExpense", totalExpense);

  const downloadPDF = () => {
    if (!aiResult) return;
    const date = new Date().toLocaleDateString("mn-MN");
    const fmt = (n: number) => `₮${n.toLocaleString()}`;

    const totalIncome = (aiResult.income ?? []).reduce(
      (s: number, c: any) => s + (c.total ?? 0),
      0,
    );
    const totalExp = (aiResult.expenses ?? []).reduce(
      (s: number, c: any) => s + (c.total ?? 0),
      0,
    );

    const incomeRows = (aiResult.income ?? [])
      .map(
        (c: any) =>
          `<tr><td style="padding:6px 12px">${c.name}</td><td style="text-align:right;padding:6px 12px;color:#059669">${fmt(c.total)}</td></tr>`,
      )
      .join("");

    const expenseRows = (aiResult.expenses ?? [])
      .map(
        (c: any) =>
          `<tr><td style="padding:6px 12px">${c.name}</td><td style="text-align:right;padding:6px 12px;color:#e11d48">${fmt(c.total)}</td></tr>`,
      )
      .join("");

    const monthlyHtml = (aiResult.monthly ?? [])
      .map((m: any) => {
        const mInc = (m.income ?? [])
          .map(
            (c: any) =>
              `<tr><td style="padding:4px 24px">${c.name}</td><td style="text-align:right;padding:4px 12px;color:#059669">${fmt(c.total)}</td></tr>`,
          )
          .join("");
        const mExp = (m.expenses ?? [])
          .map(
            (c: any) =>
              `<tr><td style="padding:4px 24px">${c.name}</td><td style="text-align:right;padding:4px 12px;color:#e11d48">${fmt(c.total)}</td></tr>`,
          )
          .join("");
        return `
      <tr style="background:#f8fafc"><td colspan="2" style="font-weight:600;padding:8px 12px;border-top:2px solid #e2e8f0">${m.month}</td></tr>
      <tr><td style="padding-left:12px;font-weight:600;color:#059669">Орлого</td><td></td></tr>${mInc}
      <tr><td style="padding-left:12px;font-weight:600;color:#e11d48">Зарлага</td><td></td></tr>${mExp}`;
      })
      .join("");

    const tipsHtml = (aiResult.tips ?? [])
      .map((t: string, i: number) => `<li style="margin-bottom:8px">${i + 1}. ${t}</li>`)
      .join("");

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Санхүүгийн тайлан</title>
    <style>
      body{font-family:Arial,sans-serif;margin:0;padding:32px;color:#1e293b;font-size:13px}
      h1{font-size:22px;margin-bottom:4px;color:#1e40af}
      .date{color:#64748b;margin-bottom:24px;font-size:12px}
      .summary{background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin-bottom:20px}
      .totals{display:flex;gap:16px;margin-bottom:20px}
      .total-card{flex:1;border-radius:8px;padding:14px;text-align:center}
      .income-card{background:#f0fdf4;border:1px solid #bbf7d0}
      .expense-card{background:#fff1f2;border:1px solid #fecdd3}
      .net-card{background:#f0f9ff;border:1px solid #bae6fd}
      .total-card .label{font-size:11px;color:#64748b;margin-bottom:4px}
      .total-card .value{font-size:18px;font-weight:700}
      .income-card .value{color:#059669}
      .expense-card .value{color:#e11d48}
      .net-card .value{color:#0284c7}
      h2{font-size:15px;margin:20px 0 10px;border-bottom:2px solid #e2e8f0;padding-bottom:6px}
      table{width:100%;border-collapse:collapse;margin-bottom:16px}
      td{border-bottom:1px solid #f1f5f9}
      ul{padding-left:0;list-style:none}
      li{padding:8px 12px;background:#f8fafc;border-radius:6px;border-left:3px solid #3b82f6}
      @media print{body{padding:16px}@page{margin:15mm}}
    </style></head><body>
    <h1>Санхүүгийн дүн шинжилгээ</h1>
    <div class="date">Тайлан үүсгэсэн: ${date}</div>
    <div class="summary"><p>${aiResult.summary ?? ""}</p></div>
    <div class="totals">
      <div class="total-card income-card"><div class="label">Нийт орлого</div><div class="value">${fmt(totalIncome)}</div></div>
      <div class="total-card expense-card"><div class="label">Нийт зарлага</div><div class="value">${fmt(totalExp)}</div></div>
      <div class="total-card net-card"><div class="label">Цэвэр ашиг</div><div class="value">${fmt(totalIncome - totalExp)}</div></div>
    </div>
    <h2>Орлогын ангилал</h2>
    <table>${incomeRows}</table>
    <h2>Зарлагын ангилал</h2>
    <table>${expenseRows}</table>
    <h2>Сар бүрийн задаргаа</h2>
    <table>${monthlyHtml}</table>
    ${tipsHtml ? `<h2>AI Зөвлөмж</h2><ul>${tipsHtml}</ul>` : ""}
    <script>window.onload=()=>{window.print();}<\/script>
    </body></html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  return (
    <div className="w-full">
      <Card className="w-full shadow-md rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
        <div className="w-full flex items-center justify-between pt-4">
          <h3 className="font-semibold mb-4">Сар бүрийн задаргаа</h3>
          <button
            onClick={downloadPDF}
            disabled={!aiResult}
            className="text-indigo-600 disabled:text-gray-300 font-bold text-lg"
          >
            Тайлан татах
          </button>
        </div>
        <CardContent className="p-4 md:p-6 w-full border border-border rounded-lg bg-muted/50 flex flex-col">
          {monthlyData.length > 0 && (
            <>
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={() => setMonthIndex((p) => Math.max(p - 1, -1))}
                  disabled={monthIndex === -1}
                  className="text-indigo-600 disabled:text-gray-300 font-bold text-lg"
                >
                  ←
                </button>
                <span className="font-semibold text-sm min-w-35 text-center">
                  {monthIndex === -1 ? "Бүх сар" : monthLabel}
                </span>
                <button
                  onClick={() =>
                    setMonthIndex((p) =>
                      Math.min(p + 1, monthlyData.length - 1),
                    )
                  }
                  disabled={monthIndex === monthlyData.length - 1}
                  className="text-indigo-600 disabled:text-gray-300 font-bold text-lg"
                >
                  →
                </button>
              </div>
              {(currentMonthData || monthIndex === -1) && (
                <div className="grid md:grid-cols-2 gap-6 w-full mb-6">
                  {/* Орлогын ангилал */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-4 text-emerald-600">
                      Орлогын ангилал
                    </h3>
                    <div className="space-y-4">
                      {incomeData.map((cat: any, i: number) => {
                        const pct =
                          totalIncome > 0
                            ? ((cat.value / totalIncome) * 100).toFixed(1)
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
                                  backgroundColor: "#10b981",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

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
                    formatter={(val: any, name: any) => [
                      `₮${Number(val).toLocaleString()}`,
                      name,
                    ]}
                    contentStyle={{ borderRadius: "10px", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1 justify-center">
                {expenseData.map((cat: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

"use client";
import { useEffect, useState } from "react";
import { RevenueCard } from "./RevenueCard";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

interface FinanceRecord {
  revenue: number;
  expense: number;
  netProfit: number;
  month: string;
}

interface AiCategory {
  name: string;
  total: number;
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#f43f5e", "#8b5cf6"];

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

export const Dashboard = ({ aiResult }: { aiResult?: any }) => {
  const [revenue, setRevenue] = useState(0);
  const [expense, setExpense] = useState(0);
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const { getToken } = useAuth();

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
    <div className="bg-background dark:bg-sidebar w-full flex flex-col gap-6 p-4 md:p-5 transition-colors">
      <div className="flex flex-row gap-4 md:gap-10 flex-wrap">
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
    </div>
  );
};

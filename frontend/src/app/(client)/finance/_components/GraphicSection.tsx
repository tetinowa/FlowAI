"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import type { AiResult } from "../page";

const MONTH_NAMES = [
  "1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар",
  "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар",
];
const getMonthLabel = (key: string) => {
  const [year, month] = key.split("-");
  return `${year?.slice(2)}'${MONTH_NAMES[(parseInt(month) - 1)] ?? month}`;
};

const Colors = ["#10b981", "#3b82f6", "#f59e0b", "#f43f5e", "#8b5cf6"];

const PLACEHOLDER_BAR = [
  { огноо: "1-р сар", орлого: 0, зарлага: 0 },
  { огноо: "2-р сар", орлого: 0, зарлага: 0 },
];
const PLACEHOLDER_PIE = [
  { id: 0, name: "Өгөгдөл байхгүй", value: 1 },
];

interface GraphicSectionProps {
  aiResult: AiResult | null;
}

export const GraphicSection = ({ aiResult }: GraphicSectionProps) => {
  const barData = aiResult?.monthly && aiResult.monthly.length > 0
    ? aiResult.monthly.map((m) => ({
      огноо: getMonthLabel(m.month),
      орлого: m.income?.reduce((s, c) => s + c.total, 0) ?? 0,
      зарлага: m.expenses?.reduce((s, c) => s + c.total, 0) ?? 0,
    }))
    : PLACEHOLDER_BAR;

  const pieData = aiResult?.expenses && aiResult.expenses.length > 0
    ? aiResult.expenses.filter((c) => c.total > 0).map((c, i) => ({ id: i, name: c.name, value: c.total }))
    : PLACEHOLDER_PIE;

  return (
    <div className="bg-background dark:bg-sidebar w-full flex-1 flex flex-col lg:flex-row gap-8 lg:gap-10 p-4 md:p-5 transition-colors">
      <div className="flex w-full lg:w-1/2 flex-col justify-between bg-white dark:bg-sidebar-accent p-4 md:p-6 rounded-3xl border border-gray-100 dark:border-sidebar-border shadow-sm transition-colors">
        <p className="text-lg text-slate-900 dark:text-white font-bold mb-6">
          Орлого & Зарлагын график
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.2} />
            <XAxis dataKey="огноо" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => v === 0 ? "0" : `${(v / 1000000).toFixed(1)}M`} />
            <Tooltip formatter={(v) => `₮${Number(v).toLocaleString()}`} />
            <Bar dataKey="орлого" name="Орлого" fill="#10b981" radius={5} />
            <Bar dataKey="зарлага" name="Зарлага" fill="#f43f5e" radius={5} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex w-full lg:w-1/2 flex-col justify-between bg-white dark:bg-sidebar-accent p-4 md:p-6 rounded-3xl border border-gray-100 dark:border-sidebar-border shadow-sm transition-colors">
        <p className="text-lg text-slate-900 dark:text-white font-bold mb-6">
          Зарлагын ангилал
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} dataKey="value" stroke="none"
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}>
              {pieData.map((item, index) => (
                <Cell key={`cell-${item.id}`} fill={Colors[index % Colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `₮${Number(v).toLocaleString()}`} />
          </PieChart>
        </ResponsiveContainer>
        {aiResult?.expenses && (
          <div className="flex flex-wrap gap-3 mt-2">
            {aiResult.expenses.filter((c) => c.total > 0).map((c, i) => (
              <div key={i} className="flex items-center gap-1.5 text-sm text-slate-600">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: Colors[i % Colors.length] }} />
                {c.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

"use client";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const data = [
  { огноо: "1-р сар", орлого: 4000, зарлага: 2400 },
  { огноо: "2-р сар", орлого: 3000, зарлага: 1398 },
  { огноо: "3-р сар", орлого: 2000, зарлага: 9800 },
  { огноо: "4-р сар", орлого: 2780, зарлага: 3908 },
  { огноо: "5-р сар", орлого: 1890, зарлага: 4800 },
  { огноо: "6-р сар", орлого: 2390, зарлага: 3800 },
];
const data2 = [
  {
    id: 1,
    name: "Хоол",
    value: 400,
  },
  {
    id: 2,
    name: "Тээвэр",
    value: 300,
  },
  {
    id: 3,
    name: "Үйлчилгээ",
    value: 200,
  },
  {
    id: 4,
    name: "Бусад",
    value: 100,
  },
];

const Colors = ["#10b981", "#3b82f6", "#f59e0b", "#f43f5e", "#8b5cf6"];

interface AiCategory {
  name: string;
  total: number;
}

interface GraphicSectionProps {
  categories?: AiCategory[] | null;
}

export const GraphicSection = ({ categories }: GraphicSectionProps) => {
  const pieData =
    categories && categories.length > 0
      ? categories.map((c, i) => ({ id: i, name: c.name, value: c.total }))
      : data2;
  return (
    <div className="bg-gray-100 dark:bg-slate-900 w-full flex-1 flex flex-col lg:flex-row gap-8 lg:gap-10 p-4 md:p-5 transition-colors">
      <div className="flex w-full lg:w-1/2 flex-col justify-between bg-white dark:bg-slate-800 p-4 md:p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-center gap-4 sm:gap-0 mb-6">
          <p className="text-lg text-slate-900 dark:text-white font-bold">
            Орлого & Зарлагын график
          </p>
          <Button
            variant="outline"
            className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700 border-gray-300 dark:border-slate-600 w-full sm:w-auto transition-colors">
            <ChevronDown className="w-4 h-4 mr-2" />
            Сүүлийн 6 сар
          </Button>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#cbd5e1"
              opacity={0.2}
            />
            <XAxis
              dataKey="огноо"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip cursor={{ fill: "#e2e8f0", opacity: 0.1 }} />
            <Bar dataKey="орлого" fill="#10b981" radius={5} />
            <Bar dataKey="зарлага" fill="#f43f5e" radius={5} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex w-full lg:w-1/2 flex-col justify-between bg-white dark:bg-slate-800 p-4 md:p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-center gap-4 sm:gap-0 mb-6">
          <p className="text-lg text-slate-900 dark:text-white font-bold">
            Сүүлийн гүйлгээнүүд
          </p>
          <Button
            variant="outline"
            className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700 border-gray-300 dark:border-slate-600 w-full sm:w-auto transition-colors">
            Дэлгэрэнгүй харах
          </Button>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={130}
              dataKey="value"
              label={{ fill: "#94a3b8", fontSize: 12 }}
              stroke="none">
              {pieData.map((item, index) => (
                <Cell
                  key={`cell-${item.id}`}
                  fill={Colors[index % Colors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

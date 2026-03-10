"use client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface RevenueCardProps {
  title: string;
  amount: string;
  percentage: string;
  progress: number;
}

export const RevenueCard = ({ title, amount, percentage, progress }: RevenueCardProps) => {
  const isPositive = !percentage.startsWith("-");
  const colorClass = isPositive ? "text-emerald-500" : "text-rose-500";
  const bgClass = isPositive ? "bg-emerald-500" : "bg-rose-500";

  return (
    <div className="bg-white min-w-[280px] w-[30%] h-36 flex flex-col justify-center p-5 rounded-3xl border border-gray-100 shadow-sm">
      <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
      <div className="flex items-baseline gap-2 mb-3">
        <h2 className="text-[28px] font-bold text-gray-900">{amount}</h2>
        <span className={`${colorClass} text-sm font-medium`}>{percentage}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 flex mt-1">
        <div
          className={`${bgClass} h-1.5 rounded-full`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

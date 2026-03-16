"use client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const HeadSection = () => {
  return (
    <div className="bg-background dark:bg-sidebar w-full flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-5 gap-4 transition-colors">

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl text-slate-900 dark:text-white font-bold">
          Санхүүгийн хиймэл оюун ухаан
        </h1>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium">
          Таны орлого, зарлагын шинжилгээ
        </p>
      </div>

    </div>
  );
};

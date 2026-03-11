"use client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const HeadSection = () => {
  return (
    <div className="bg-gray-100 w-full flex-1 flex flex-row justify-between p-5">
      <div className="flex flex-col">
        <p className="text-3xl text-slate-900 font-bold">
          Санхүүгийн хиймэл оюун ухаан
        </p>
        <p className="text-1xl text-slate-400 font-medium">
          Таны орлого, зарлагын шинжилгээ
        </p>
      </div>
      <Button
        variant="outline"
        className="bg-white text-slate-900 hover:bg-gray-200 border-gray-300"
      >
        <Download />
        Тайлан татах
      </Button>
    </div>
  );
};

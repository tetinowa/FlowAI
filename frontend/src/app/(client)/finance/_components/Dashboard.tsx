"use client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { RevenueCard } from "./RevenueCard";

const data = [
  {
    id: 1,
    title: "Нийт орлого",
    amount: "₮45,200.00",
    percentage: "+12.5%",
    progress: 60,
  },
  {
    id: 2,
    title: "Нийт зарлага",
    amount: "₮20,500.00",
    percentage: "-5.2%",
    progress: 40,
  },
  {
    id: 3,
    title: "Цэвэр ашиг",
    amount: "₮24,700.00",
    percentage: "+8.4%",
    progress: 75,
  },
];

export const Dashboard = () => {
  return (
    <div className="bg-gray-100 w-screen flex flex-row gap-10 p-5 flex-wrap">
      {data.map((item) => (
        <RevenueCard
          key={item.id}
          title={item.title}
          amount={item.amount}
          percentage={item.percentage}
          progress={item.progress}
        />
      ))}
    </div>
  );
};

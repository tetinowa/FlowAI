"use client";

import { FinanceSection } from "@/app/(client)/dashboard/_components/dashboard/FinanceSection";
import { MarketingSection } from "@/app/(client)/dashboard/_components/dashboard/MarketingSection";
import { useUser } from "@clerk/nextjs";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();
  const name =
    user?.firstName ??
    user?.emailAddresses[0]?.emailAddress?.split("@")[0] ??
    "Та";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Өглөөний мэнд" : hour < 18 ? "Өдрийн мэнд" : "Оройн мэнд";

  return (
    <div className="flex-1 overflow-y-auto bg-muted/30 text-foreground no-scrollbar">
      {/* Hero banner */}
      <div
        className="relative overflow-hidden px-8 pt-8 pb-10"
        style={{ background: "linear-gradient(135deg, #5048e5 0%, #7c3aed 50%, #4f46e5 100%)" }}
      >
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, white, transparent)" }} />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, white, transparent)" }} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span className="text-indigo-200 text-sm font-medium">{greeting}</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {name} 👋
            </h2>
            <p className="text-indigo-200 mt-1 text-sm">
              Өнөөдрийн байдлаарх таны платформын гүйцэтгэлийн хураангуй
            </p>
          </div>

          <div className="flex gap-3 shrink-0">
            <Link
              href="/marketing"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
            >
              <TrendingUp className="w-4 h-4" />
              Маркетинг
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/finance"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "rgba(255,255,255,0.95)", color: "#5048e5" }}
            >
              Санхүү
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <FinanceSection />
        <MarketingSection />
      </div>
    </div>
  );
}

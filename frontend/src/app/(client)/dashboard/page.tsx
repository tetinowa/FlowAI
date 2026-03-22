"use client";

import { FinanceSection } from "@/app/(client)/dashboard/_components/dashboard/FinanceSection";
import { MarketingSection } from "@/app/(client)/dashboard/_components/dashboard/MarketingSection";
import { AIInsightBanner } from "@/app/(client)/dashboard/_components/dashboard/AIInsightBanner";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { user } = useUser();
  const name =
    user?.firstName ??
    user?.emailAddresses[0]?.emailAddress?.split("@")[0] ??
    "Та";
  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-muted/30 text-foreground">
      {/* Welcome */}
      <section>
        <h2 className="text-3xl font-black text-foreground tracking-tight">
          Сайн байна уу, {name}
        </h2>
        <p className="text-muted-foreground mt-1">
          Өнөөдрийн байдлаарх таны платформын гүйцэтгэлийн хураангуй.
        </p>
      </section>

      <FinanceSection />
      <MarketingSection />
      {/* <AIInsightBanner /> */}
    </div>
  );
}

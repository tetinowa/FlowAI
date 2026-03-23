
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, TrendingUp } from "lucide-react";
import { useAdmin } from "../provider/adminProvider";
const MOCK_STATS = {
  totalRegisteredOrgs: 124,
  activeUsers: 3_841,
  monthlyIncome: "$18,240",
};

export function Lobby() {
  const { auditLog } = useAdmin();
  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-muted/30 text-foreground">
      <section>
        <h2 className="text-3xl font-black text-foreground tracking-tight">
          Dashboard
        </h2>
        <p className="text-white mt-1">Platform overview and recent activity</p>
      </section>

      <div className="grid grid-cols-3 gap-6">
        <StatCard
          icon={<Building2 className="w-5 h-5 text-[#5048e5]" />}
          label="Total Registered Org."
          value={String(MOCK_STATS.totalRegisteredOrgs)}
          iconBg="bg-[#5048e5]/10"
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          label="Active Users"
          value={MOCK_STATS.activeUsers.toLocaleString()}
          iconBg="bg-blue-500/10"
        />
        <StatCard
          icon={
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          }
          label="Monthly Income"
          value={MOCK_STATS.monthlyIncome}
          iconBg="bg-green-500/10"
        />
      </div>

      {/* Audit / Activity Log */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="flex flex-col divide-y divide-border max-h-120 overflow-y-auto">
            {auditLog.length === 0 ? (
              <div
                className={`w-full h-full flex justify-center items-center text-gray-400`}
              >
                No entry has found
              </div>
            ) : (
              <>
                {auditLog.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-[#5048e5] shrink-0" />
                      <p className="text-sm text-foreground truncate">
                        {entry.clientId} {entry.action} {entry.target}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 ml-6 font-mono">
                      {JSON.stringify(entry.date)}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  iconBg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6 flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-medium">{label}</p>
          <p className="text-2xl font-black text-foreground mt-0.5">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, TrendingUp } from "lucide-react";

// [MOCK_DATA] - replace with real stats from API
const MOCK_STATS = {
  totalRegisteredOrgs: 124,
  activeUsers: 3_841,
  monthlyIncome: "$18,240",
};

// [MOCK_DATA] - replace with real audit log entries from API
// Each entry is a plain string describing the event + timestamp
const MOCK_AUDIT_LOG: { id: string; message: string; timestamp: string }[] = [
  {
    id: "1",
    message: "john.doe has registered with company Id acme_corp_001",
    timestamp: "03/21/2025 | 06:18",
  },
  {
    id: "2",
    message: "jane.smith has upgraded plan from Starter to Pro under techstart_002",
    timestamp: "03/21/2025 | 07:43",
  },
  {
    id: "3",
    message: "bob.johnson account was deactivated by admin",
    timestamp: "03/20/2025 | 22:05",
  },
  {
    id: "4",
    message: "alice.brown has registered with company Id devstudio_004",
    timestamp: "03/20/2025 | 19:30",
  },
  {
    id: "5",
    message: "mike.wilson changed role from Member to Admin under cloudbase_005",
    timestamp: "03/20/2025 | 17:12",
  },
  {
    id: "6",
    message: "sara.lee subscription payment of $19.00 received for alphNet_006",
    timestamp: "03/20/2025 | 14:55",
  },
  {
    id: "7",
    message: "acme_corp_001 plan upgraded from Pro to Enterprise",
    timestamp: "03/19/2025 | 11:22",
  },
  {
    id: "8",
    message: "tom.harris has registered with company Id betaworks_008",
    timestamp: "03/19/2025 | 09:04",
  },
  {
    id: "9",
    message: "mega_corp_003 status changed to inactive by admin",
    timestamp: "03/18/2025 | 16:47",
  },
  {
    id: "10",
    message: "password reset requested for alice.brown",
    timestamp: "03/18/2025 | 13:31",
  },
  {
    id: "11",
    message: "cloudbase_005 created 12 new member seats",
    timestamp: "03/17/2025 | 10:08",
  },
  {
    id: "12",
    message: "subscription payment of $299.00 received for cloudbase_005",
    timestamp: "03/17/2025 | 08:55",
  },
];

export function Dashboard() {
  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-muted/30 text-foreground">
      <section>
        <h2 className="text-3xl font-black text-foreground tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Platform overview and recent activity
        </p>
      </section>

      {/* Stat Cards */}
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
          icon={<TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />}
          label="Monthly Income"
          value={MOCK_STATS.monthlyIncome}
          iconBg="bg-green-500/10"
        />
      </div>

      {/* Audit / Activity Log */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="flex flex-col divide-y divide-border max-h-120 overflow-y-auto">
            {MOCK_AUDIT_LOG.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#5048e5] shrink-0" />
                  <p className="text-sm text-foreground truncate">{entry.message}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-6 font-mono">
                  {entry.timestamp}
                </span>
              </div>
            ))}
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
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
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

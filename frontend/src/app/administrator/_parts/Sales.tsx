// "use client";

// export function Sales() {
//   return <>Sales Display</>;
// }

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, TrendingUp, Building2, Users } from "lucide-react";

// [MOCK_DATA] - replace with real transaction/audit log data from API
const MOCK_TRANSACTIONS = [
  {
    id: "txn_001",
    companyId: "YBDSRDSQYFBS",
    clientId: "user_3BAt3sVybHdKcLslDvMkev49roj",
    date: "2025-03-01",
    stripeCustomerId: "cus_001",
    stripeId: "sub_001",
  },
  {
    id: "txn_002",
    companyId: "YSBBWEBWEQSF",
    clientId: "_devGenerated_01",
    date: "2025-03-01",
    stripeCustomerId: "cus_002",
    stripeId: "sub_002",
  },
  {
    id: "txn_003",
    companyId: "SSSDBCCDUCDQ",
    clientId: "_devGenerated_02",
    date: "2025-03-02",
    stripeCustomerId: "cus_003",
    stripeId: "sub_003",
  },
  {
    id: "txn_004",
    companyId: "BYWQWFCYRBWU",
    clientId: "_devGenerated_03",
    date: "2025-03-05",
    stripeCustomerId: "cus_004",
    stripeId: "sub_004",
  },
  {
    id: "txn_005",
    companyId: "RWQYFXYWUUQC",
    clientId: "_devGenerated_04",
    date: "2025-03-07",
    stripeCustomerId: "cus_005",
    stripeId: "sub_005",
  },
  {
    id: "txn_006",
    companyId: "UBSURQQCXUWY",
    clientId: "_devGenerated_05",
    date: "2025-03-10",
    stripeCustomerId: "cus_006",
    stripeId: "sub_006",
  },
  {
    id: "txn_007",
    companyId: "YBDSRDSQYFBS",
    clientId: "user_3BAt3sVybHdKcLslDvMkev49roj",
    date: "2025-03-12",
    stripeCustomerId: "cus_001",
    stripeId: "sub_007",
  },
  {
    id: "txn_008",
    companyId: "DCWFBFBBFCIY",
    clientId: "_devGenerated_03",
    date: "2025-03-15",
    stripeCustomerId: "cus_007",
    stripeId: "sub_008",
  },
];

// [MOCK_DATA] - replace with real summary stats
const MOCK_STATS = {
  totalRevenue: "$1,083.00",
  activeSubscriptions: 6,
  companiesOnPlan: 8,
  failedPayments: 1,
};

const statusColors: Record<string, string> = {
  paid: "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
  failed: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  pending:
    "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  refunded: "bg-secondary text-secondary-foreground border-border",
};

const typeColors: Record<string, string> = {
  subscription: "bg-[#5048e5]/10 text-[#5048e5] border-[#5048e5]/20",
  upgrade:
    "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
};

export function Sales() {
  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-muted/30 text-foreground">
      <section>
        <h2 className="text-3xl font-black text-foreground tracking-tight">
          Subscriptions
        </h2>
        <p className="text-muted-foreground mt-1 text-white">
          Transaction and payment audit log
        </p>
      </section>

      <div className="grid grid-cols-4 gap-6">
        <StatCard
          icon={
            <TrendingUp
              size={16}
              className="text-green-600 dark:text-green-400"
            />
          }
          label="Total Revenue"
          value={MOCK_STATS.totalRevenue}
          valueClass="text-green-600 dark:text-green-400"
        />
        <StatCard
          icon={<CreditCard size={16} className="text-[#5048e5]" />}
          label="Active Subscriptions"
          value={String(MOCK_STATS.activeSubscriptions)}
          valueClass="text-[#5048e5]"
        />
        <StatCard
          icon={
            <Building2 size={16} className="text-blue-600 dark:text-blue-400" />
          }
          label="Companies on Plan"
          value={String(MOCK_STATS.companiesOnPlan)}
          valueClass="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={<Users size={16} className="text-destructive" />}
          label="Failed Payments"
          value={String(MOCK_STATS.failedPayments)}
          valueClass="text-destructive"
        />
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Transaction Log
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto h-[400px]">
          {" "}
          {/* 👈 fixed height + overflow */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-medium">
                  Transaction ID
                </TableHead>
                <TableHead className="text-xs font-medium">Company</TableHead>
                <TableHead className="text-xs font-medium">User</TableHead>
                <TableHead className="text-xs font-medium">Stripe CI</TableHead>
                <TableHead className="text-xs font-medium">Stripe ID</TableHead>
                <TableHead className="text-xs font-medium">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_TRANSACTIONS.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="text-muted-foreground text-xs font-mono py-3">
                    {txn.id}
                  </TableCell>
                  <TableCell className="text-sm font-medium py-3">
                    {txn.clientId}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3">
                    {txn.companyId}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3">
                    {txn.stripeCustomerId}
                  </TableCell>
                  <TableCell className="text-sm font-semibold py-3">
                    {txn.stripeId}
                  </TableCell>

                  <TableCell className="text-muted-foreground text-xs py-3">
                    {txn.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-muted-foreground text-xs">{label}</span>
        </div>
        <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

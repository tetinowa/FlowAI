"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Download,
  Send,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Loader2,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";

interface FinanceRecord {
  id: string;
  month: string | null;
  revenue: number | null;
  expense: number | null;
  netProfit: number | null;
}

const QUARTERS = [
  { label: "I улирал (1–3-р сар)", value: 1, months: [1, 2, 3], deadline: "4-р сарын 20" },
  { label: "II улирал (4–6-р сар)", value: 2, months: [4, 5, 6], deadline: "7-р сарын 20" },
  { label: "III улирал (7–9-р сар)", value: 3, months: [7, 8, 9], deadline: "10-р сарын 20" },
  { label: "IV улирал (10–12-р сар)", value: 4, months: [10, 11, 12], deadline: "1-р сарын 20" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

function fmt(n: number) {
  return `₮${Math.round(n).toLocaleString()}`;
}

function isDeadlineSoon(quarter: (typeof QUARTERS)[0], year: number): "overdue" | "soon" | "ok" {
  const now = new Date();
  const deadlineMonth = quarter.value === 4 ? 0 : quarter.value * 3; // 0-indexed month
  const deadlineYear = quarter.value === 4 ? year + 1 : year;
  const deadline = new Date(deadlineYear, deadlineMonth, 20);
  const diff = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return "overdue";
  if (diff <= 14) return "soon";
  return "ok";
}

// SVG donut chart
function DonutChart({ vat, cit, nd }: { vat: number; cit: number; nd: number }) {
  const total = vat + cit + nd;
  if (total === 0) return null;

  const r = 52;
  const circumference = 2 * Math.PI * r;

  const vatPct = vat / total;
  const citPct = cit / total;
  const ndPct = nd / total;

  const vatDash = vatPct * circumference;
  const citDash = citPct * circumference;
  const ndDash = ndPct * circumference;

  const vatOffset = 0;
  const citOffset = -vatDash;
  const ndOffset = -(vatDash + citDash);

  const segments = [
    { dash: vatDash, offset: vatOffset, color: "#3b82f6", label: "НӨАТ", pct: vatPct },
    { dash: citDash, offset: citOffset, color: "#8b5cf6", label: "ААН", pct: citPct },
    { dash: ndDash, offset: ndOffset, color: "#10b981", label: "НД", pct: ndPct },
  ];

  return (
    <div className="flex items-center gap-6">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#e5e7eb" strokeWidth="14" />
        {segments.map((s, i) => (
          <circle
            key={i}
            cx="65"
            cy="65"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="14"
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={s.offset}
            style={{ transform: "rotate(-90deg)", transformOrigin: "65px 65px" }}
          />
        ))}
        <text x="65" y="61" textAnchor="middle" fontSize="11" fill="#6b7280">Нийт</text>
        <text x="65" y="76" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#111">
          {fmt(total)}
        </text>
      </svg>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-muted-foreground w-10">{s.label}</span>
            <span className="font-medium">{Math.round(s.pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TaxPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [selectedQuarter, setSelectedQuarter] = useState(
    Math.ceil((new Date().getMonth() + 1) / 3)
  );
  const [employeeCount, setEmployeeCount] = useState(1);
  const [avgSalary, setAvgSalary] = useState(1_000_000);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getToken().then((token) => {
      apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/finance`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((json) => { if (json.data) setRecords(json.data); })
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  }, [getToken]);

  const quarter = QUARTERS.find((q) => q.value === selectedQuarter)!;
  const deadlineStatus = isDeadlineSoon(quarter, selectedYear);

  const filtered = records.filter((r) => {
    if (!r.month) return false;
    const d = new Date(r.month);
    return d.getFullYear() === selectedYear && quarter.months.includes(d.getMonth() + 1);
  });

  const revenue = filtered.reduce((s, r) => s + (r.revenue ?? 0), 0);
  const expense = filtered.reduce((s, r) => s + (r.expense ?? 0), 0);
  const netProfit = filtered.reduce((s, r) => s + (r.netProfit ?? 0), 0);

  const vat = revenue * 0.1;
  const cit = netProfit > 0 ? netProfit * 0.1 : 0;
  const totalSalary = employeeCount * avgSalary * quarter.months.length;
  const socialInsurance = totalSalary * 0.21;
  const totalTax = vat + cit + socialInsurance;
  const taxRate = revenue > 0 ? (totalTax / revenue) * 100 : 0;

  function generatePDF() {
    const html = `<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="UTF-8"/>
  <title>Татварын тайлан — ${selectedYear} он ${quarter.label}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 48px; color: #111; max-width: 720px; margin: 0 auto; }
    .header { border-bottom: 2px solid #5048e5; padding-bottom: 16px; margin-bottom: 28px; }
    h1 { font-size: 22px; margin: 0 0 4px; color: #5048e5; }
    .sub { color: #666; font-size: 13px; }
    .deadline { display: inline-block; background: ${deadlineStatus === "overdue" ? "#fee2e2" : deadlineStatus === "soon" ? "#fef3c7" : "#d1fae5"}; color: ${deadlineStatus === "overdue" ? "#dc2626" : deadlineStatus === "soon" ? "#d97706" : "#059669"}; padding: 3px 10px; border-radius: 20px; font-size: 12px; margin-top: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
    th { background: #5048e5; color: white; text-align: left; padding: 10px 14px; font-size: 13px; }
    td { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 13px; }
    .total-row td { font-weight: bold; font-size: 15px; background: #f5f5ff; border-top: 2px solid #5048e5; }
    .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #eee; font-size: 11px; color: #999; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Татварын автомат тайлан</h1>
    <div class="sub">${selectedYear} он · ${quarter.label}</div>
    <div class="deadline">Дэдлайн: ${quarter.deadline}${quarter.value === 4 ? ` (${selectedYear + 1})` : ` (${selectedYear})`}</div>
  </div>
  <table>
    <tr><th colspan="2">Санхүүгийн тойм</th></tr>
    <tr><td>Нийт орлого</td><td>${fmt(revenue)}</td></tr>
    <tr><td>Нийт зарлага</td><td>${fmt(expense)}</td></tr>
    <tr><td>Цэвэр ашиг</td><td>${fmt(netProfit)}</td></tr>
  </table>
  <table>
    <tr><th>Татварын төрөл</th><th>Тайлбар</th><th>Суурь</th><th>Хувь</th><th>Дүн</th></tr>
    <tr>
      <td><b>НӨАТ</b></td>
      <td>Нэмэгдсэн өртгийн албан татвар</td>
      <td>${fmt(revenue)}</td><td>10%</td><td><b>${fmt(vat)}</b></td>
    </tr>
    <tr>
      <td><b>ААН</b></td>
      <td>Аж ахуйн нэгжийн татвар</td>
      <td>${fmt(netProfit > 0 ? netProfit : 0)}</td><td>10%</td><td><b>${fmt(cit)}</b></td>
    </tr>
    <tr>
      <td><b>НД</b></td>
      <td>Нийгмийн даатгал (${employeeCount} ажилчин)</td>
      <td>${fmt(totalSalary)}</td><td>21%</td><td><b>${fmt(socialInsurance)}</b></td>
    </tr>
    <tr class="total-row">
      <td colspan="4">Нийт татвар</td><td>${fmt(totalTax)}</td>
    </tr>
  </table>
  <div class="footer">
    FlowAI системээс автоматаар үүсгэгдсэн · Зөвлөмж болгон ашиглана уу<br/>
    Үүсгэсэн огноо: ${new Date().toLocaleDateString("mn-MN")}
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    win?.print();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  async function handleSend() {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSending(false);
    setSent(true);
    generatePDF();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-[#5048e5]" />
      </div>
    );
  }

  const deadlineBadge = {
    overdue: "bg-red-500/10 text-red-600 border-red-200",
    soon: "bg-amber-500/10 text-amber-600 border-amber-200",
    ok: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  }[deadlineStatus];

  const deadlineLabel = {
    overdue: `Хоцорсон — ${quarter.deadline}`,
    soon: `Ойртож байна — ${quarter.deadline}`,
    ok: `Дэдлайн: ${quarter.deadline}`,
  }[deadlineStatus];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Автомат татварын тайлан</h1>
          <p className="text-muted-foreground text-sm mt-1">
            НӨАТ · ААН · НД — санхүүгийн өгөгдлөөс автоматаар тооцоолно
          </p>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${deadlineBadge}`}>
          <Calendar className="w-3.5 h-3.5" />
          {deadlineLabel}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {[
          { value: selectedYear, onChange: (v: number) => setSelectedYear(v), options: YEARS.map(y => ({ value: y, label: `${y} он` })) },
        ].map((_, i) => (
          <div key={i} className="relative">
            <select
              value={selectedYear}
              onChange={(e) => { setSelectedYear(+e.target.value); setSent(false); }}
              className="appearance-none bg-card border border-border rounded-lg px-4 py-2.5 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5048e5]/30"
            >
              {YEARS.map((y) => <option key={y} value={y}>{y} он</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        ))}
        <div className="relative">
          <select
            value={selectedQuarter}
            onChange={(e) => { setSelectedQuarter(+e.target.value); setSent(false); }}
            className="appearance-none bg-card border border-border rounded-lg px-4 py-2.5 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5048e5]/30"
          >
            {QUARTERS.map((q) => <option key={q.value} value={q.value}>{q.label}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Tax cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TaxCard label="НӨАТ" sublabel="Нэмэгдсэн өртгийн албан татвар" rate="10%" base={fmt(revenue)} amount={vat} color="blue" />
        <TaxCard label="ААН" sublabel="Аж ахуйн нэгжийн татвар" rate="10%" base={fmt(netProfit > 0 ? netProfit : 0)} amount={cit} color="violet" />
        <TaxCard label="НД" sublabel="Нийгмийн даатгал" rate="21%" base={fmt(totalSalary)} amount={socialInsurance} color="emerald" />
      </div>

      {/* НД inputs + donut chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-sm text-foreground">НД тооцооллын мэдээлэл</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Ажилчдын тоо</label>
              <input
                type="number" min={0} value={employeeCount}
                onChange={(e) => { setEmployeeCount(+e.target.value); setSent(false); }}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5048e5]/30"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Дундаж цалин (₮/сар)</label>
              <input
                type="number" min={0} step={10000} value={avgSalary}
                onChange={(e) => { setAvgSalary(+e.target.value); setSent(false); }}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5048e5]/30"
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between">
          <h2 className="font-semibold text-sm text-foreground mb-4">Татварын бүтэц</h2>
          {totalTax > 0 ? (
            <DonutChart vat={vat} cit={cit} nd={socialInsurance} />
          ) : (
            <p className="text-sm text-muted-foreground">Өгөгдөл байхгүй</p>
          )}
        </div>
      </div>

      {/* Total + actions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Нийт татварын дүн</p>
            <p className="text-3xl font-bold text-foreground mt-1">{fmt(totalTax)}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <p className="text-xs text-muted-foreground">{selectedYear} он · {quarter.label}</p>
              {revenue > 0 && (
                <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  Орлогын {taxRate.toFixed(1)}%
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              <Download className="w-4 h-4" />
              PDF татах
            </button>

            {sent ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-sm font-medium border border-emerald-200">
                <CheckCircle className="w-4 h-4" />
                Тайлан бэлэн болсон
              </div>
            ) : (
              <button
                onClick={handleSend}
                disabled={sending || totalTax === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5048e5] text-white text-sm font-medium hover:bg-[#4038d4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {sending ? "Үүсгэж байна..." : "Тайлан үүсгэх"}
              </button>
            )}
          </div>
        </div>

        {totalTax === 0 && (
          <div className="mt-4 flex items-center gap-2 text-amber-600 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Энэ улиралд санхүүгийн өгөгдөл байхгүй.{" "}
            <button onClick={() => router.push("/finance")} className="underline underline-offset-2">
              Санхүү AI руу очих
            </button>
          </div>
        )}
      </div>

      {/* Breakdown table */}
      {filtered.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-sm">Сарын задаргаа</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-6 py-3 text-muted-foreground font-medium">Сар</th>
                <th className="text-right px-6 py-3 text-muted-foreground font-medium">Орлого</th>
                <th className="text-right px-6 py-3 text-muted-foreground font-medium">Зарлага</th>
                <th className="text-right px-6 py-3 text-muted-foreground font-medium">НӨАТ</th>
                <th className="text-right px-6 py-3 text-muted-foreground font-medium">ААН</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-3 text-muted-foreground">
                    {r.month ? new Date(r.month).toLocaleDateString("mn-MN", { year: "numeric", month: "long" }) : "—"}
                  </td>
                  <td className="px-6 py-3 text-right">{fmt(r.revenue ?? 0)}</td>
                  <td className="px-6 py-3 text-right text-rose-500">{fmt(r.expense ?? 0)}</td>
                  <td className="px-6 py-3 text-right text-blue-600">{fmt((r.revenue ?? 0) * 0.1)}</td>
                  <td className="px-6 py-3 text-right text-violet-600">
                    {(r.netProfit ?? 0) > 0 ? fmt((r.netProfit ?? 0) * 0.1) : "₮0"}
                  </td>
                </tr>
              ))}
              <tr className="bg-muted/40 font-semibold">
                <td className="px-6 py-3">Нийт</td>
                <td className="px-6 py-3 text-right">{fmt(revenue)}</td>
                <td className="px-6 py-3 text-right text-rose-500">{fmt(expense)}</td>
                <td className="px-6 py-3 text-right text-blue-600">{fmt(vat)}</td>
                <td className="px-6 py-3 text-right text-violet-600">{fmt(cit)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TaxCard({ label, sublabel, rate, base, amount, color }: {
  label: string; sublabel: string; rate: string; base: string; amount: number;
  color: "blue" | "violet" | "emerald";
}) {
  const badge = { blue: "bg-blue-500/10 text-blue-600 border-blue-200", violet: "bg-violet-500/10 text-violet-600 border-violet-200", emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-200" }[color];
  const dot = { blue: "bg-blue-500", violet: "bg-violet-500", emerald: "bg-emerald-500" }[color];

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-bold text-foreground text-lg">{label}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${badge}`}>{rate}</span>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{sublabel}</p>
        <p className="text-xs text-muted-foreground mt-0.5">Суурь: {base}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${dot}`} />
        <span className="font-bold text-foreground">{fmt(amount)}</span>
      </div>
    </div>
  );
}

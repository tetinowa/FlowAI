"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Check, Zap, Crown } from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";

export default function BillingPage() {
  const { getToken } = useAuth();
  const [patronage, setPatronage] = useState<"BASIC" | "PRO" | null>(null);
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      const token = await getToken();
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/billing/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPatronage(data.patronage);
    }
    fetchStatus();
  }, []);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/billing/checkout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const token = await getToken();
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/billing/portal`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
    } finally {
      setPortalLoading(false);
    }
  }

  const basicFeatures = [
    "Санхүүгийн мэдээлэл оруулах",
    "AI дүн шинжилгээ (сард 3 удаа)",
    "Маркетинг AI (сард 5 нийтлэл)",
    "Үндсэн тайлан",
  ];

  const proFeatures = [
    "BASIC-ын бүх боломж",
    "AI дүн шинжилгээ (хязгааргүй)",
    "Маркетинг AI (хязгааргүй)",
    "Нарийвчилсан тайлан & экспорт",
    "Тэргүүлэх дэмжлэг",
    "Багийн гишүүд нэмэх",
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-muted/30">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Төлбөр & Эрх</h1>
          <p className="text-muted-foreground mt-1">
            Өөрийн бизнест тохирох тарифыг сонгоно уу
          </p>
        </div>

        {/* Current plan banner */}
        {patronage && (
          <div className="flex items-center gap-3 p-4 rounded-xl border bg-background">
            {patronage === "PRO" ? (
              <Crown className="w-5 h-5 text-yellow-500" />
            ) : (
              <Zap className="w-5 h-5 text-blue-500" />
            )}
            <span className="font-medium">
              Одоогийн тариф:{" "}
              <span className={patronage === "PRO" ? "text-yellow-500" : "text-blue-500"}>
                {patronage}
              </span>
            </span>
            {patronage === "PRO" && (
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                className="ml-auto text-sm text-muted-foreground hover:text-foreground underline">
                {portalLoading ? "Уншиж байна..." : "Захиалга удирдах"}
              </button>
            )}
          </div>
        )}

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* BASIC */}
          <div className={`rounded-xl border p-6 bg-background space-y-6 ${patronage === "BASIC" ? "border-blue-500" : ""}`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-lg">BASIC</span>
                {patronage === "BASIC" && (
                  <span className="ml-auto text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
                    Одоогийн
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">Үнэгүй</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Жижиг бизнест тохиромжтой</p>
            </div>
            <ul className="space-y-3">
              {basicFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              disabled
              className="w-full rounded-lg border px-4 py-2 text-sm font-medium opacity-50 cursor-not-allowed">
              Одоогийн тариф
            </button>
          </div>

          {/* PRO */}
          <div className={`rounded-xl border p-6 bg-background space-y-6 relative overflow-hidden ${patronage === "PRO" ? "border-yellow-500" : "border-[#5048e5]"}`}>
            <div className="absolute top-3 right-3 bg-[#5048e5] text-white text-xs px-2 py-0.5 rounded-full font-medium">
              Санал болгох
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-lg">PRO</span>
                {patronage === "PRO" && (
                  <span className="ml-auto text-xs bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                    Одоогийн
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">$30</span>
                <span className="text-muted-foreground text-sm">/сар</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Өсч буй бизнест хязгааргүй боломж</p>
            </div>
            <ul className="space-y-3">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            {patronage === "PRO" ? (
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                className="w-full rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50">
                {portalLoading ? "Уншиж байна..." : "Захиалга удирдах"}
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full rounded-lg bg-[#5048e5] hover:bg-[#4038d4] text-white px-4 py-2 text-sm font-medium disabled:opacity-50">
                {loading ? "Уншиж байна..." : "PRO руу шилжих →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

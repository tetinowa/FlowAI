"use client";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Building2, User, Save, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";

const INDUSTRIES = [
  { value: "TECH", label: "Мэдээллийн технологи" },
  { value: "FINANCE", label: "Санхүү" },
  { value: "HEALTHCARE", label: "Үйлчилгээ" },
  { value: "EDUCATION", label: "Боловсрол" },
  { value: "RETAIL", label: "Худалдаа" },
  { value: "MANUFACTURING", label: "Үйлдвэрлэл" },
];

export default function SettingsPage() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [form, setForm] = useState({ name: "", industry: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await apiFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/company`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (data.success) {
          setForm({
            name: data.data.ofOrg?.name ?? "",
            industry: data.data.ofOrg?.industry ?? "",
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSuccess(false);
    try {
      const token = await getToken();
      await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-muted/30">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Тохиргоо</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Компани болон профайлын мэдээлэл
          </p>
        </div>

        {/* Profile card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">Профайл</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl font-bold text-indigo-600 shrink-0">
              {user?.firstName?.[0] ??
                user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase() ??
                "?"}
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">Компанийн мэдээлэл</h2>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Уншиж байна...
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Компани нэр
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ж.нь: FlowAI LLC"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Үйл ажиллагааны төрөл
                </label>
                <select
                  value={form.industry}
                  onChange={(e) =>
                    setForm({ ...form, industry: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all">
                  <option value="">Сонгоно уу</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i.value} value={i.value}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-50 transition-all">
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Хадгалах
                </button>
                {success && (
                  <span className="text-sm text-emerald-600 font-medium">
                    ✓ Амжилттай хадгалагдлаа
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

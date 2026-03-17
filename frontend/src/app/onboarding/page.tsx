"use client";

import Prism from "@/components/Prism";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";

import { useEffect, useState } from "react";

export default function OnboardingPage() {
  const { getToken } = useAuth();
  const { session } = useClerk();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    businessType: "",
    description: "",
    phone: "",
    address: "",
  });
  const { user } = useUser();

  useEffect(() => {
    if (user?.publicMetadata.onboardingComplete) {
      session?.reload().then(() => {
        window.location.href = "/dashboard";
      });
    }
  }, [user, session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const token = await getToken();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/onboarding`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          industry: form.businessType,
          email: user?.primaryEmailAddress?.emailAddress,
          firstname: user?.firstName ?? "",
          lastname: user?.lastName ?? "",
        }),
      },
    );

    const data = await res.json();
    console.log("Response status:", res.status, data);

    if (res.ok) {
      await session?.reload();
      window.location.href = "/dashboard";
    } else alert(`Алдаа: ${JSON.stringify(data)}`);
    setLoading(false);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <div className="absolute inset-0 -z-10">
        <Prism />
      </div>
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-background/80 backdrop-blur-sm p-8 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Компанийн мэдээлэл</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Нэг удаа бөглөнө. Дараа нь өөрчилж болно.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Компани нэр *</label>
            <input
              required
              className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Үйл ажиллагааны төрөл *
            </label>
            <select
              required
              className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
              value={form.businessType}
              onChange={(e) =>
                setForm({ ...form, businessType: e.target.value })
              }>
              <option value="">Сонгоно уу</option>
              <option value="RETAIL">Худалдаа</option>
              <option value="MANUFACTURING">Үйлдвэрлэл</option>
              <option value="HEALTHCARE">Үйлчилгээ</option>
              <option value="TECH">Мэдээллийн технологи</option>
              <option value="FINANCE">Санхүү</option>
              <option value="EDUCATION">Боловсрол</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Тайлбар</label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Утас</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Хаяг</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground font-medium disabled:opacity-50">
            {loading ? "Хадгалж байна..." : "Үргэлжлүүлэх →"}
          </button>
        </form>
      </div>
    </div>
  );
}

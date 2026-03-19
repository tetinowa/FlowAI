"use client";

import Prism from "@/components/Prism";
import { Button } from "@/components/ui/button";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";

//1. bug fix: detecting if user has a company id on her/his registry.
//2. if yes -> continue aboard, if no, offer two choices: enter company ID || create company id

export default function OnboardingPage() {
  const { getToken } = useAuth();
  const { session } = useClerk();
  const [loading, setLoading] = useState(false);

  const [existing, setExisting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    businessType: "",
    description: "",
    email: "",
    phone: "",
    address: "",
  });
  const [newMform, setNewMform] = useState({
    id: "",
    role: "",
    optKey: "",
  });

  const { user } = useUser();

  useEffect(() => {
    try {
      const getMe = async () => {
        const token = await getToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/onboarding`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (res) {
          console.log("response:", res);
        }
      };
      getMe();
    } catch (e) {
      console.log(e);
    }
  }, []);
  const redirecting = useRef(false);

  useEffect(() => {
    if (user?.publicMetadata.onboardingComplete && !redirecting.current) {
      redirecting.current = true;
      session?.reload().then(() => {
        window.location.href = "/dashboard";
      });
    }
  }, [user, session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
    const token = await getToken();
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("Token:", token ? "ok" : "null");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/onboarding/org`,
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
          phoneNumber: form.phone ?? user?.primaryPhoneNumber?.phoneNumber,
          address: form.address ?? "",
          description: form.description,
        }),
      },
    );

    const data = await res.json();
    console.log("Response status:", res.status, data);

    if (res.ok) {
      await session?.reload();
      window.location.href = "/dashboard";
    } else alert(`Алдаа: ${JSON.stringify(data)}`);
    } catch (err) {
      console.error("Fetch error:", err);
      alert(`Network error: ${err}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterMember(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const token = await getToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/onboarding/member`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: newMform.id,
          role: newMform.role,
          optKey: newMform.optKey,
        }),
      },
    );
    console.log(res);
  }
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <div className="absolute inset-0 -z-10">
        <Prism />
      </div>
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-background/80 backdrop-blur-sm p-8 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Компанийн мэдээлэл оруулах</h1>
        </div>

        {existing === true && (
          <>
            <form onSubmit={handleRegisterMember} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Компани ID *</label>
                <input
                  required
                  className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
                  value={newMform.id}
                  onChange={(e) =>
                    setNewMform({ ...newMform, id: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Your role within the organization
                </label>
                <select
                  required
                  className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
                  value={newMform.role}
                  onChange={(e) =>
                    setNewMform({ ...newMform, role: e.target.value })
                  }
                >
                  <option value="">Сонгоно уу</option>
                  <option value="MANAGEMENT">Management</option>
                  <option value="MEMBER">Member</option>
                </select>
              </div>
              <div>
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-medium">
                    Authorization code
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {/* asChild means the CircleHelp icon IS the trigger, not a wrapper button */}
                        <CircleHelp className="h-4 w-4 text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          A code provided from your higher-ups for your registry
                          authentication.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <input
                  required
                  className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
                  value={newMform.optKey}
                  onChange={(e) =>
                    setNewMform({ ...newMform, optKey: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground font-medium disabled:opacity-50"
              >
                {loading ? "Хадгалж байна..." : "Үргэлжлүүлэх →"}
              </button>
            </form>
            <Button
              variant={"link"}
              onClick={() => {
                setExisting(false);
              }}
            >
              Register as authorized member of your organization?
            </Button>
            <form></form>
          </>
        )}
        {existing === false && (
          <>
            <p className="text-sm text-muted-foreground mt-1">
              Нэг удаа бөглөнө. Дараа нь өөрчилж болно.
            </p>
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
                  }
                >
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
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground font-medium disabled:opacity-50"
              >
                {loading ? "Хадгалж байна..." : "Үргэлжлүүлэх →"}
              </button>
            </form>
            <Button
              variant={"link"}
              onClick={() => {
                setExisting(true);
              }}
            >
              Register as authorized member for your organization?
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

"use client";
//this page is for superadmin control.
//access type includes create, read, update, delete. full control over the database. but cannot read senstive finance data of organizations.
//control reach -> only on general info drelated to system.
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Settings,
  Activity,
  Users,
  LoaderCircle,
} from "lucide-react";

import {
  ClientType,
  OrganizationInterface,
  InvCode,
} from "@/app/administrator/Types";

import { SectionHeader } from "@/app/(client)/dashboard/_components/dashboard/SectionHeader";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { apiFetch } from "@/lib/apiFetch";

function useCountdown(expiresAt: Date) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return timeLeft;
}

function CountdownDisplay({ expiresAt }: { expiresAt: Date }) {
  const timeLeft = useCountdown(expiresAt);
  return <>{timeLeft}</>;
}

const AdminPage = () => {
  const [members, setMembers] = useState<ClientType[]>([]);
  const [loading, setLoading] = useState(false);
  const [codeloading, setCodeloading] = useState(false);
  const [company, setCompany] = useState<OrganizationInterface | null>(null);
  const [code, setCode] = useState<InvCode | "">("");
  const [loadingA, setLoadingA] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const { getToken } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        setLoadingA(true);
        const token = await getToken();
        const res = await apiFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/company`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = await res.json();
        setCompany(data.company);
        setLoadingA(false);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingA(false);
      }
    }
    load();
  }, []);

  const handleGetCode = async () => {
    const token = await getToken();

    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/onboarding/getcode`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      console.log("[getcode]", data);
      if (data.optKey) {
        setCode(data);
      } else {
        alert(`Алдаа: ${data.message ?? JSON.stringify(data)}`);
      }
    } catch (e) {
      console.log(e);
      alert("Сервертэй холбогдож чадсангүй");
    }
  };
  const timeLeft = useCountdown(code ? new Date(code.expiresAt) : new Date());
  console.log("company", company);
  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-muted/30 text-foreground no-scrollbar">
      <section>
        <h2 className="text-3xl font-black text-foreground tracking-tight">
          Admin Dashboard
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage your organization settings and monitor activity.
        </p>
      </section>

      <section className="space-y-4">
        <SectionHeader icon={UserPlus} title="Member Registry" />
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-3">
          <p className="text-sm text-muted-foreground">
            Authorize new member registry under your organization
          </p>
          {loadingA ? (
            <>loading...</>
          ) : (
            <>
              {" "}
              {company?.patronage === "BASIC" ? (
                <Button
                  variant={"outline"}
                  onClick={() => {
                    router.push("/billing");
                  }}
                >
                  This privilege is only available for PRO members. current
                  plan: {company.patronage}
                </Button>
              ) : (
                <Button
                  className="bg-[#5048e5] hover:bg-[#4038d4] text-white"
                  onClick={handleGetCode}
                >
                  Get Code
                </Button>
              )}
            </>
          )}

          {code !== "" && typeof code === "object" && (
            <div className="mt-3 p-4 rounded-lg bg-muted border border-border space-y-1">
              <p className="text-xs text-muted-foreground">
                Урилгын код (10 минут хүчинтэй)
              </p>
              <p className="text-3xl font-mono font-bold tracking-widest text-[#5048e5]">
                {code.optKey}
              </p>
              <p className="text-xs text-muted-foreground">
                Дуусах хугацаа:{" "}
                <CountdownDisplay expiresAt={new Date(code.expiresAt)} />
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader icon={Settings} title="Organization Settings" />
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm w-full aspect-5/1 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Update members settings
          </p>
          {loading ? (
            <div className="w-full h-full flex justify-center items-center">
              <LoaderCircle className="animate-spin ease-in-out duration-300" />
            </div>
          ) : (
            <>
              {members.map((m) => (
                <Card className={`flex gap-2 rounded-xl w-full`} key={m.id}>
                  <CardContent
                    className={`flex gap-2 items-centers justify-between`}
                  >
                    <div className="font-medium flex gap-2 items-center ">
                      {m.firstname} {m.lastname}{" "}
                      {m.id === user?.id && (
                        <p className="p-1 rounded-2xl text-[#5048e5] flex items-center justify-center">
                          You
                        </p>
                      )}
                    </div>

                    <p className={`text-xs text-gray-500`}>{m.role}</p>
                    {m.id !== user?.id && (
                      <>
                        <Button>Edit</Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </>
          )}
          <p className={`text-2xl font-bold`}>Members ({members.length})</p>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader icon={Activity} title="Recent Activity" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Activity className="w-4 h-4 text-[#5048e5]" />
              Recent activities
              {/*most recent posts, finance analysis, memebr registry etc.*/}
            </div>
            <p className="text-sm text-muted-foreground">
              Recent changes from employees
              {/* changes made by members.*/}
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Users className="w-4 h-4 text-[#5048e5]" />
              Employee Data
            </div>
            <p className="text-sm text-muted-foreground">
              Update settings on employee data
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;

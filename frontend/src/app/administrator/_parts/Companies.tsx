"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { adminApi } from "@/lib/adminApi";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrganizationInterface } from "../Types";
import { ClientType } from "../Types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Building2, Phone, Mail, MapPin, MoreVertical } from "lucide-react";
import { useAdmin } from "../provider/adminProvider";

const fields = [
  { key: "name", label: "Name", type: "text" },
  { key: "industry", label: "Field Industry", type: "select" },
  { key: "description", label: "Description", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "phoneNumber", label: "Phone Number", type: "string" },
  { key: "address", label: "Address", type: "text" },
];

export function Companies() {
  // ✅ ONE place for all state — no duplicates
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] =
    useState<OrganizationInterface | null>(null);
  const [loadadd, setLoadadd] = useState(false);
  const { companies, fetchUsersOfCompanies, deleteCompany } = useAdmin();
  const [form, setForm] = useState({
    name: "",
    industry: "",
    description: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  // ✅ Simple and clean - one function to open sheet
  async function handleSelectCompany(company: OrganizationInterface) {
    setSelectedCompany(company);
    setSheetOpen(true);
    await fetchUsersOfCompanies(company.id);
  }

  // ✅ One function to close sheet
  function closeSheet() {
    setSheetOpen(false);
    setSelectedCompany(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoadadd(true);
    try {
      const res = await adminApi.post("/api/admin/companies", form);
      if (res) {
        console.log("company added successfully");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert(`Network error: ${err}`);
    } finally {
      setLoadadd(false);
    }
  }
  async function handleDeleteCompany(id: string) {
    try {
      const res = await deleteCompany(id);
    } catch (e) {
      console.log(e);
    }
  }

  const AddCompanyComp = () => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Company</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add Company</DialogTitle>
          <DialogDescription>
            Fill in the details to register a new company.
          </DialogDescription>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="text-sm font-medium">{field.label}</label>
                {field.type === "select" ? (
                  <select
                    required
                    className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) =>
                      setForm({ ...form, [field.key]: e.target.value })
                    }
                  >
                    <option value="">Сонгоно уу</option>
                    <option value="TECH">TECH</option>
                    <option value="HEALTHCARE">HEALTHCARE</option>
                    <option value="RETAIL">RETAIL</option>
                  </select>
                ) : (
                  <input
                    type={field.type}
                    className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) =>
                      setForm({ ...form, [field.key]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={loadadd}
              className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground font-medium disabled:opacity-50"
            >
              {loadadd ? "Saving..." : "Add"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };
  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-muted/30 text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            Companies
          </h2>
          <p className="text-muted-foreground mt-1 text-white">
            Manage all registered organizations
          </p>
          <AddCompanyComp />
        </div>
      </div>
      <div className="w-full h-full overflow-scroll">
        {" "}
        <div className="flex flex-col gap-3">
          {companies.length !== 0 ? (
            companies.map((company) => (
              <div
                key={company.id}
                className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm hover:border-[#5048e5]/30 transition-colors"
              >
                <div className="w-9 h-9 bg-[#5048e5]/10 rounded-lg flex items-center justify-center shrink-0">
                  <Building2 size={16} className="text-[#5048e5]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground font-semibold text-sm">
                      {company.name}
                    </p>
                    <Badge variant="outline">[LOG_ACTIVITY]</Badge>
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {company.industry}
                  </p>
                </div>
                <div className={`text-xs text-gray-500`}>
                  AI USAGE:{" "}
                  {company.aiUsages ? company.aiUsages.length : <>0</>}
                  /m
                </div>

                <Badge
                  variant="outline"
                  className={`${company.patronage === "PRO" ? "bg-yellow-500/50" : "bg-green-500/50"} text-xs shrink-0`}
                >
                  {company.patronage}
                </Badge>
                <p className="text-muted-foreground text-xs shrink-0 w-20 ">
                  {company.members?.length} members
                </p>
                <Button
                  className="rounded-full scale-95"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSelectCompany(company)}
                >
                  <MoreVertical />
                </Button>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              Loading
            </div>
          )}
        </div>
      </div>

      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => {
          if (!open) closeSheet();
        }}
      >
        <SheetContent className="w-105 overflow-y-auto p-6 ">
          <SheetHeader>
            <SheetTitle>{selectedCompany?.name}</SheetTitle>
          </SheetHeader>

          {selectedCompany && (
            <div className="mt-6 flex flex-col gap-4">
              <DetailRow label="Industry" value={selectedCompany.industry} />
              <DetailRow label="Plan" value={selectedCompany.patronage} />
              <DetailRow
                label="Created"
                value={JSON.stringify(selectedCompany.createdAt)}
              />
              <div className="border-t border-border pt-4 flex flex-col gap-3">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} className="mt-0.5 shrink-0" />
                  {selectedCompany.address}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone size={14} className="shrink-0" />
                  {selectedCompany.phoneNumber as any}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={14} className="shrink-0" />
                  {selectedCompany.emailAddress}
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-1">
                  Description
                </p>
                <p className="text-sm">{selectedCompany.description}</p>
              </div>{" "}
              <Button
                variant={"destructive"}
                onClick={() => {
                  handleDeleteCompany(selectedCompany.id);
                }}
              >
                Delete
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

"use client";
import { useAdmin } from "../provider/adminProvider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  User,
  Trash2,
  Eye,
  Pencil,
  Mail,
  Calendar,
  Building2,
} from "lucide-react";
import { ClientType } from "../Types";

// [MOCK_DATA] - replace with real data from context/API
const MOCK_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    company: "Acme Corp",
    joinedSince: "2024-01-15",
    status: "active",
    phone: "+1 (555) 100-0001",
    lastLogin: "2025-03-20",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Manager",
    company: "TechStart",
    joinedSince: "2024-02-20",
    status: "active",
    phone: "+1 (555) 100-0002",
    lastLogin: "2025-03-19",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@startup.io",
    role: "Member",
    company: "Mega Corp",
    joinedSince: "2024-03-05",
    status: "inactive",
    phone: "+1 (555) 100-0003",
    lastLogin: "2025-02-14",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@company.com",
    role: "Owner",
    company: "Dev Studio",
    joinedSince: "2024-04-10",
    status: "active",
    phone: "+1 (555) 100-0004",
    lastLogin: "2025-03-21",
  },
  {
    id: "5",
    name: "Mike Wilson",
    email: "mike@corp.com",
    role: "Admin",
    company: "CloudBase Inc",
    joinedSince: "2024-05-18",
    status: "active",
    phone: "+1 (555) 100-0005",
    lastLogin: "2025-03-18",
  },
];

type User = (typeof MOCK_USERS)[number];

const roleColors: Record<string, string> = {
  Owner:
    "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  Admin: "bg-[#5048e5]/10 text-[#5048e5] border-[#5048e5]/20",
  Manager: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  Member: "bg-secondary text-secondary-foreground border-border",
};

export function Clients() {
  const [sheetMode, setSheetMode] = useState<"read" | "edit" | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const { allusers } = useAdmin();
  const client = allusers.filter((u) => u.role === "EXECUTIVE");
  console.log("clients", client);

  const openRead = (user: User) => {
    setSelectedUser(user);
    setSheetMode("read");
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setSheetMode("edit");
  };

  const closeSheet = () => {
    setSheetMode(null);
    setSelectedUser(null);
  };

  // [MOCK_DATA] - wire these to real API calls
  const handleEditSubmit = () => {
    console.log("[TODO] update user:", selectedUser?.id, editForm);
    closeSheet();
  };

  const handleDelete = (id: string) => {
    console.log("[TODO] delete user:", id);
    setDeleteConfirmId(null);
  };
  function getLastSeen(lastSeenAt: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(lastSeenAt).getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  }
  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-muted/30 text-foreground">
      <div>
        <h2 className="text-3xl font-black text-foreground tracking-tight">
          Users
        </h2>
        <p className="text-muted-foreground mt-1 text-white">
          Manage all registered users
        </p>
      </div>
      <div className={`w-full h-full overflow-scroll`}>
        {" "}
        <div className="flex flex-col gap-3">
          {client.length === 0 ? (
            <>Loading</>
          ) : (
            <>
              {" "}
              {client.map((user) => (
                <div
                  key={user.id}
                  className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm hover:border-[#5048e5]/30 transition-colors"
                >
                  <div className="w-9 h-9 bg-[#5048e5]/10 rounded-full flex items-center justify-center shrink-0">
                    <User size={15} className="text-[#5048e5]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-foreground font-semibold text-sm">
                        {user.firstname} {user.lastname}
                      </p>
                      <Badge
                        variant="outline"
                        className="scale-90"
                        // className={
                        //   getLastSeen(user)
                        //     ? "bg-green-500/10 text-green-600 border-green-500/20 text-xs dark:text-green-400"
                        //     : "bg-red-500/10 text-red-600 border-red-500/20 text-xs dark:text-red-400"
                        // }
                      >
                        <p className="text-xs text-gray-400">Last active: </p>
                        {getLastSeen(user.lastSeenAt)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {user.email} · Organization ID: {user.orgId}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={`${roleColors[user.role] ?? ""} text-xs shrink-0`}
                  >
                    {user.role}
                  </Badge>

                  <div className="text-muted-foreground text-xs shrink-0 w-24 text-right">
                    Joined
                    <p>
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  {/* 
            {deleteConfirmId === user.id ? (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-destructive text-xs">Delete?</span>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 text-xs px-2"
                  onClick={() => handleDelete(user.id)}
                >
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs px-2"
                  onClick={() => setDeleteConfirmId(null)}
                >
                  No
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0"
                  >
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => openRead(user.id)}
                    className="gap-2 cursor-pointer"
                  >
                    <Eye size={14} />
                    Read
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openEdit(user.id)}
                    className="gap-2 cursor-pointer"
                  >
                    <Pencil size={14} />
                    Update
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setDeleteConfirmId(user.id)}
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 size={14} />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )} */}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Sheet: Read User */}
      <Sheet open={sheetMode === "read"} onOpenChange={closeSheet}>
        <SheetContent className="w-105 p-6">
          <SheetHeader>
            <SheetTitle>{selectedUser?.name}</SheetTitle>
          </SheetHeader>
          {selectedUser && (
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 bg-[#5048e5]/10 rounded-full flex items-center justify-center">
                  <User size={28} className="text-[#5048e5]" />
                </div>
              </div>
              <DetailRow
                label="Status"
                value={
                  <Badge
                    variant="outline"
                    className={
                      selectedUser.status === "active"
                        ? "bg-green-500/10 text-green-600 border-green-500/20 text-xs dark:text-green-400"
                        : "bg-red-500/10 text-red-600 border-red-500/20 text-xs dark:text-red-400"
                    }
                  >
                    {selectedUser.status}
                  </Badge>
                }
              />
              <DetailRow label="Role" value={selectedUser.role} />
              <DetailRow label="Company" value={selectedUser.company} />
              <DetailRow label="Joined" value={selectedUser.joinedSince} />
              <DetailRow label="Last Login" value={selectedUser.lastLogin} />
              <div className="border-t border-border pt-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={14} className="shrink-0" />
                  {selectedUser.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 size={14} className="shrink-0" />
                  {selectedUser.company}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={14} className="shrink-0" />
                  Joined {selectedUser.joinedSince}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Sheet: Edit User */}
      <Sheet open={sheetMode === "edit"} onOpenChange={closeSheet}>
        <SheetContent className="w-105 p-6">
          <SheetHeader>
            <SheetTitle>Update User</SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-4">
            <FormField label="Name">
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, name: e.target.value }))
                }
                className="focus-visible:ring-[#5048e5]/50"
              />
            </FormField>
            <FormField label="Email">
              <Input
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, email: e.target.value }))
                }
                type="email"
                className="focus-visible:ring-[#5048e5]/50"
              />
            </FormField>
            <FormField label="Phone">
              <Input
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, phone: e.target.value }))
                }
                className="focus-visible:ring-[#5048e5]/50"
              />
            </FormField>
            <FormField label="Role">
              <Input
                value={editForm.role}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, role: e.target.value }))
                }
                placeholder="Admin / Manager / Member"
                className="focus-visible:ring-[#5048e5]/50"
              />
            </FormField>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleEditSubmit}
                className="flex-1 bg-[#5048e5] hover:bg-[#4038d4] text-white"
              >
                Save Changes
              </Button>
              <Button variant="ghost" onClick={closeSheet}>
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
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

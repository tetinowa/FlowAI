"use client";
//this page is for superadmin control.
//access type includes create, read, update, delete. full control over the database. but cannot read senstive finance data of organizations.
//control reach -> only on general info drelated to system.
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { loginAdmin } from "@/lib/adminApi";
const AdminPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleClick = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await loginAdmin(username, password);
      console.log(res);
      if (res.data.success) {
        const token = res.data.res;
        localStorage.setItem("accessToken", token);
        alert("Youkoso, Supa-Dupa Admin-Sama!");
        router.push("/administrator/dashboard");
      }
    } catch (e) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-muted/30">
      <div className="bg-card border border-border rounded-xl shadow-sm p-8 flex flex-col gap-6 w-full max-w-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#5048e5] flex items-center justify-center text-white shrink-0">
            <span className="text-lg font-bold">S</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-none">Super Admin</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Flow AI</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your credentials to access the Super Admin panel.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Input
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Admin username"
            className="bg-muted border-none focus-visible:ring-[#5048e5]/50"
          />
          <Input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-muted border-none focus-visible:ring-[#5048e5]/50"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            onClick={handleClick}
            disabled={loading}
            className="bg-[#5048e5] hover:bg-[#4038d4] text-white w-full mt-1"
          >
            {loading ? "Loading..." : "Sign in"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

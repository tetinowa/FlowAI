"use client";
import { adminApi } from "@/lib/adminApi";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect
} from "react";
import { OrganizationInterface } from "../Types";
import { Dispatch, SetStateAction } from "react";
import { ClientType } from "../Types";
interface AdminContextType {
  showSideBar: boolean;
  setShowSideBar: Dispatch<SetStateAction<boolean>>;
  lastAccessTime: string;
  fetchCompaniesData: () => Promise<void>;
  companies: OrganizationInterface[] | [];
  singleorg: OrganizationInterface | null;
  users: ClientType[] | [];
  allusers: ClientType[] | [];
  fetchUsersOfCompanies: (orgId: string) => Promise<void>;
  fetchCompanyById: (orgId: string) => Promise<void>;
  fetchAuditLog: () => Promise<void>;
  createCompany: (data: OrganizationInterface) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  auditLog: AuditLogtype[] | [];
}

type AuditLogtype = {
  id: string;
  clientId: string;
  action: string;
  target: string;
  details: object;
  date: Date;
};
export const AdminContext = createContext({} as AdminContextType);
export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<OrganizationInterface[]>([]);
  const [owners, setOwners] = useState<ClientType[]>([]);
  const [singleorg, setSingleorg] = useState<OrganizationInterface | null>(
    null,
  );
  const [users, setUsers] = useState<ClientType[]>([]);
  const [allusers, setAllUsers] = useState<ClientType[]>([]);
  const [lastAccessTime, setLastAccessTime] = useState("");
  const [auditLog, setAuditlog] = useState<AuditLogtype[]>([]);
  const [showSideBar, setShowSideBar] = useState(false);

  useEffect(() => {
    const time = new Date();
    const date = time.toISOString();
    setLastAccessTime(date);
  }, []);

  async function fetchCompaniesData() {
    //function for getting all data of companies
    try {
      const res = await adminApi.get("/api/admin/companies");

      const data = res.data.companyData;
      setCompanies(data);
    } catch (e) {
      console.error(e);
    }
  }
  async function fetchAllOwners() {
    try {
      const res = await adminApi.get("/api/admin/clients");
      const data = res.data.usersData;

      setAllUsers(data);
    } catch (e) {
      console.log(e);
    }
  }
  async function fetchCompanyById(orgId: string) {
    try {
      const res = await adminApi.get(`/api/admin/companies/${orgId}`);
      setSingleorg(res.data);
    } catch (e) {
      console.error(e);
    }
  }
  async function fetchUsersOfCompanies(orgId: string) {
    try {
      const res = await adminApi.get(`/api/admin/companies/${orgId}/members`);
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function createCompany(data: any) {
    try {
      const res = await adminApi.post("/api/admin/companies", data);
      if (res) {
        console.log(res);
      }
    } catch (e) {
      console.error(e);
    }
  }
  async function deleteCompany(OrgId: string) {
    try {
      const res = await adminApi.delete(`/api/admin/companies/${OrgId}`);
      if (res) {
        console.log(res);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchAuditLog() {
    try {
      const res = await adminApi.get("/api/auditlog");
      setAuditlog(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchCompaniesData();
    fetchAllOwners();
    fetchAuditLog();
  }, [lastAccessTime]);

  console.log("adminprivoder", companies)
  return (
    <AdminContext.Provider
      value={{
        showSideBar,
        setShowSideBar,
        lastAccessTime,
        fetchCompaniesData,
        companies,
        singleorg,
        allusers,
        users,
        fetchUsersOfCompanies,
        fetchCompanyById,
        fetchAuditLog,
        createCompany,
        deleteCompany,
        auditLog,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};

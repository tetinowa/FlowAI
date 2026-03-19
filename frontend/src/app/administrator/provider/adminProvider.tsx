"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { OrganizationInterface } from "../Types";
import {
  getClients,
  getCompanies,
  loginAdmin,
  deleteCompany,
} from "@/lib/adminApi";
export const AdminContext = createContext(null);
interface AdminContextType {
  login: () => Promise<void>;
  lastAccessTime: Date;
  companies: OrganizationInterface[] | [];
  users: ClientTypes[] | [];
  fetchCompaniesData: () => Promise<void>;
  fetchUsersOfCompanies: () => Promise<void>;
  createCompany: () => Promise<OrganizationInterface>;
  deleteCompany: () => Promise<void>;
}
export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<OrganizationInterface[]>([]);
  const [users, setUsers] = useState<ClientTypes[]>([]);
  const [lastAccessTime, setLastAccessTime] = useState<Date>(new Date());

  async function login(username: string, password: string) {
    try {
      const res = await loginAdmin(username, password);
    } catch (e) {
      console.log(e);
    }
  }


  async function fetchCompaniesData() {
    //function for getting all data of companies
    try {
      const [companiesRes, usersRes] = await Promise.all([
        getCompanies(),
        getClients(),
      ]);
      console.log(companiesRes.data, usersRes.data);
      setCompanies(companiesRes.data?.companyData);
      setUsers(usersRes.data?.usersData);
    } catch (e) {
      console.error(e);
    }
  }

  async function createCompany () {
    try {
        const res = await fetch('/api/admin/companies')
    } catch(e) {}
  }
  return <AdminContext.Provider value={{login, fetchCompaniesData, lastAccessTime, users, companies, deleteCompany, createCompany}}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
};

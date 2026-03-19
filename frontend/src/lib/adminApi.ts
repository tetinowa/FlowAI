import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginAdmin = (username: string, password: string) =>
  api.post("/api/admin", { username, password });

export const getCompanies = () => api.get("/api/admin/companies");

export const getClients = () => api.get("/api/admin/clients");

export const deleteCompany = (id: string) =>
  api.delete(`/api/admin/companies/${id}`);

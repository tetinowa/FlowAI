export type ClientType = {
  id: string;
  orgId: string;
  role: " EXECUTIVE" | "  MANAGEMENT" | "  MEMBER";
  email: string;
  firstname: string;
  lastname: string;
  createdAt: Date;
};

export type FinanceType = {
  id: string;
  orgId: string;
  month?: Date;
};

export type FAnalysesType = {
  id: string;
  orgId: string;
  summary: string;
  categories?: any;
  tips: any;
  createdAt: Date;
};

export type Post = {
  id: string;
  orgId: string;
  title: string;
  content: string | string[] | any;
  platform: string | any;
  react: number;
  publishedAt: Date;
};

export interface OrganizationInterface {
  id: string;
  name: string;
  members?: ClientType[];
  industry:
    | "TECH"
    | "FINANCE"
    | "HEALTHCARE"
    | "EDUCATION"
    | "RETAIL"
    | "MANUFACTURING";
  financeData?: FinanceType[];
  financeAnalyses?: FAnalysesType[];
  posts?: Post[];
  createdAt: Date;
  emailAddress: Date;
  description: String;
  patronage: "BASIC" | "PRO";
  PhoneNumber: String;
}
export type AdminType = {
  id: string;
  email: string;
  username: string;
  password?: string;
  createdAt: Date;
  lastAccessTime: Date;
};

export type InvCode = {
  optKey: Number;
  expiresAt: Date;
};

// Dashboard-relevant slices of the canonical backend types.
// Keep field names in sync with types.ts from the backend.

export enum ContentPlatform {
  LINKEDIN = "linkedin",
  INSTAGRAM = "instagram",
  TWITTER = "twitter",
  FACEBOOK = "facebook",
}

export enum PostStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  PUBLISHED = "published",
  FAILED = "failed",
}

export enum ExpenseCategory {
  INFRASTRUCTURE = "infrastructure",
  MARKETING = "marketing",
  SAAS_SUBSCRIPTIONS = "saas_subscriptions",
  PAYROLL = "payroll",
  OFFICE_SUPPLIES = "office_supplies",
  SOFTWARE = "software",
  OTHER = "other",
}

/** Dashboard finance overview cards — mirrors backend FinanceOverview */
export interface FinanceOverview {
  currentBalance: number;
  balanceChangePercent: number;
  monthlyExpenses: number;
  expensesChangePercent: number;
  netRevenueGrowth: number;
}

/** A single social media post — mirrors backend ContentPost */
export interface ContentPost {
  id: string;
  orgId: string;
  platform: ContentPlatform;
  caption: string;
  imageUrl: string | null;
  scheduledAt: Date | null;
  publishedAt: Date | null;
  status: PostStatus;
  autoPost: boolean;
  reach: number;
  createdAt: Date;
  updatedAt: Date;
}

/** Marketing dashboard cards — mirrors backend MarketingOverview */
export interface MarketingOverview {
  recentPosts: ContentPost[];
  contentPlanProgress: {
    percentage: number;
    articlesDrafted: number;
    articlesTarget: number;
    socialAssets: number;
    socialTarget: number;
  };
  activeCampaignCount: number;
}

/** AI cost suggestion — mirrors backend AISuggestion */
export interface AISuggestion {
  id: string;
  orgId: string;
  message: string;
  potentialSaving: number;
  category: ExpenseCategory;
  createdAt: Date;
}

/** Root type for the dashboard page */
export interface DashboardData {
  userName: string;
  finance: FinanceOverview;
  marketing: MarketingOverview;
  aiSuggestion: AISuggestion;
}

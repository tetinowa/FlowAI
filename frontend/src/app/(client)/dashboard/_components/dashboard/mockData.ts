import { ContentPlatform, ExpenseCategory, PostStatus } from "./types";
import type { DashboardData } from "./types";

export const mockDashboardData: DashboardData = {
  userName: "Aasdasd",

  finance: {
    currentBalance: 42400,
    balanceChangePercent: 12,
    monthlyExpenses: 8240,
    expensesChangePercent: -5,
    netRevenueGrowth: 24.8,
  },

  marketing: {
    activeCampaignCount: 3,
    contentPlanProgress: {
      percentage: 68,
      articlesDrafted: 8,
      articlesTarget: 12,
      socialAssets: 20,
      socialTarget: 30,
    },
    recentPosts: [
      {
        id: "1",
        orgId: "org_mock",
        platform: ContentPlatform.LINKEDIN,
        caption: "LinkedIn-ийн маркетингийн стратеги",
        imageUrl: null,
        scheduledAt: null,
        publishedAt: new Date(Date.now() - 30 * 60_000),
        status: PostStatus.PUBLISHED,
        autoPost: false,
        reach: 1240,
        createdAt: new Date(Date.now() - 60 * 60_000),
        updatedAt: new Date(Date.now() - 30 * 60_000),
      },
      {
        id: "2",
        orgId: "org_mock",
        platform: ContentPlatform.FACEBOOK,
        caption: "Facebook нийгмийн медиа кампейн",
        imageUrl: null,
        scheduledAt: null,
        publishedAt: new Date(Date.now() - 3 * 60 * 60_000),
        status: PostStatus.PUBLISHED,
        autoPost: true,
        reach: 3850,
        createdAt: new Date(Date.now() - 4 * 60 * 60_000),
        updatedAt: new Date(Date.now() - 3 * 60 * 60_000),
      },
      {
        id: "3",
        orgId: "org_mock",
        platform: ContentPlatform.TWITTER,
        caption: "Twitter брэндийн мессеж",
        imageUrl: null,
        scheduledAt: null,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60_000),
        status: PostStatus.PUBLISHED,
        autoPost: false,
        reach: 920,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60_000 - 60 * 60_000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60_000),
      },
    ],
  },

  aiSuggestion: {
    id: "ai_1",
    orgId: "org_mock",
    message:
      "Таны санхүүгийн сүүлийн үеийн чиг хандлагаас харахад үүлэн дэд бүтцийн зардлыг оновчтой болгосноор ирэх сард $1,200 хүртэл хэмнэх боломжтой байна. Та дэлгэрэнгүй задаргааг харах уу?",
    potentialSaving: 1200,
    category: ExpenseCategory.INFRASTRUCTURE,
    createdAt: new Date(),
  },
};

import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";

export const getFinance: RequestHandler = async (req, res) => {
  const orgId = req.clerkUserId!;
  try {
    const finance = await prisma.finance.findMany({
      where: { orgId },
      orderBy: { month: "desc" },
      take: 6,
    });
    return res.json({ success: true, data: finance });
  } catch (e) {
    return res.status(500).json({ success: false, message: e });
  }
};

export const saveAnalysis: RequestHandler = async (req, res) => {
  const orgId = req.clerkUserId!;
  const { summary, categories, monthly, tips } = req.body;
  try {
    const record = await prisma.financeAnalysis.create({
      data: { orgId, summary, categories, monthly: monthly ?? null, tips },
    });
    return res.status(201).json({ success: true, data: record });
  } catch (e) {
    return res.status(500).json({ success: false, message: e });
  }
};

export const getAnalyses: RequestHandler = async (req, res) => {
  const orgId = req.clerkUserId!;
  try {
    const analyses = await prisma.financeAnalysis.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return res.json({ success: true, data: analyses });
  } catch (e) {
    return res.status(500).json({ success: false, message: e });
  }
};

export const createFinance: RequestHandler = async (req, res) => {
  const orgId = req.clerkUserId!;
  const { month, balance, revenue, expense, netProfit, margin } = req.body;

  // Сарын эхний өдрөөр normalize хийнэ (2025-03-15 → 2025-03-01)
  const date = new Date(month);
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  try {
    const existing = await prisma.finance.findFirst({
      where: { orgId, month: { gte: monthStart, lt: monthEnd } },
    });

    let record;
    if (existing) {
      const newRevenue = (existing.revenue ?? 0) + (revenue ?? 0);
      const newExpense = (existing.expense ?? 0) + (expense ?? 0);
      record = await prisma.finance.update({
        where: { id: existing.id },
        data: {
          revenue: newRevenue,
          expense: newExpense,
          netProfit: netProfit ?? newRevenue - newExpense,
          ...(balance != null && { balance }),
          ...(margin != null && { margin }),
        },
      });
    } else {
      record = await prisma.finance.create({
        data: {
          orgId,
          month: monthStart,
          balance,
          revenue,
          expense,
          netProfit: netProfit ?? (revenue ?? 0) - (expense ?? 0),
          margin,
        },
      });
    }

    return res.status(201).json({ success: true, data: record });
  } catch (e) {
    return res.status(500).json({ success: false, message: e });
  }
};

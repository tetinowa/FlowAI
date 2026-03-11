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
  const { summary, categories, tips } = req.body;
  try {
    const record = await prisma.financeAnalysis.create({
      data: { orgId, summary, categories, tips },
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
  try {
    const record = await prisma.finance.create({
      data: {
        orgId,
        month: new Date(month),
        balance,
        revenue,
        expense,
        netProfit,
        margin,
      },
    });
    return res.status(201).json({ success: true, data: record });
  } catch (e) {
    return res.status(500).json({ success: false, message: e });
  }
};

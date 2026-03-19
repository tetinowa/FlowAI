import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";

export const getMarketingStrategy: RequestHandler = async (req, res) => {
  const orgId = req.clerkUserId!;
  try {
    const strategy = await prisma.marketingStrategy.findUnique({ where: { orgId } });
    return res.json({ success: true, data: strategy });
  } catch (e) {
    return res.status(500).json({ success: false, message: e });
  }
};

export const saveMarketingStrategy: RequestHandler = async (req, res) => {
  const orgId = req.clerkUserId!;
  const { productName, description, targetAudience, advice } = req.body;
  try {
    const strategy = await prisma.marketingStrategy.upsert({
      where: { orgId },
      update: { productName, description, targetAudience, advice },
      create: { orgId, productName, description, targetAudience, advice },
    });
    return res.json({ success: true, data: strategy });
  } catch (e) {
    return res.status(500).json({ success: false, message: e });
  }
};

import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";

async function resolveOrgId(clerkUserId: string): Promise<string | null> {
  const client = await prisma.client.findUnique({
    where: { id: clerkUserId },
    select: { orgId: true },
  });
  return client?.orgId ?? null;
}

export const getMarketingStrategy: RequestHandler = async (req, res) => {
  const orgId = await resolveOrgId(req.clerkUserId!);
  if (!orgId) return res.status(404).json({ success: false, message: "Organization not found" });
  try {
    const strategy = await prisma.marketingStrategy.findUnique({ where: { orgId } });
    return res.json({ success: true, data: strategy });
  } catch (e) {
    return res.status(500).json({ success: false, message: e });
  }
};

export const saveMarketingStrategy: RequestHandler = async (req, res) => {
  const orgId = await resolveOrgId(req.clerkUserId!);
  if (!orgId) return res.status(404).json({ success: false, message: "Organization not found" });
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

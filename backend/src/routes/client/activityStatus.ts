import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";

export const ActivityStatus: RequestHandler = async (req, res, next) => {
  const clientId = req.clerkUserId;
  if (clientId) {
    await prisma.client.update({
      where: { id: clientId },
      data: { lastSeenAt: new Date() },
    });
  }
  next();
};

export const aiLimiting: RequestHandler = async (req, res) => {
  try {
    const { clientId } = req.body;
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    const orgId = client?.orgId;

    if (!clientId || !orgId) {
      return res.status(404).json({ message: "invalid req" });
    }

    const targetCompany = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (targetCompany?.patronage === "BASIC") {
      const usageThisMonth = await prisma.aiUsage.count({
        where: {
          orgId,
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      });

      if (usageThisMonth >= 5) {
        return res
          .status(429)
          .json({ success: false, message: "Limit reached" });
      }
    }

    await prisma.aiUsage.create({
      data: { clientId, orgId },
    });

    return res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "ai tracking" });
  }
};

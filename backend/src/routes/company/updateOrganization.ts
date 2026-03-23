import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";

export const updateCompany: RequestHandler = async (req, res) => {
  try {
    const clerkId = req.clerkUserId;
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const client = await prisma.client.findUnique({ where: { id: clerkId } });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const { name, industry } = req.body;

    const updated = await prisma.organization.update({
      where: { id: client.orgId ?? "" },
      data: {
        ...(name && { name }),
        ...(industry && { industry }),
      },
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Update failed" });
  }
};

export const getCompany: RequestHandler = async (req, res) => {
  try {
    const clerkId = req.clerkUserId;
    if (!clerkId) {
      return res.status(401).json({ message: "clerkId not found" });
    }

    const client = await prisma.client.findUnique({
      where: { id: clerkId },
      include: { ofOrg: true },
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const orgId = client.orgId;
    if (!orgId) {
      return res.status(404).json({
        message: "OrgID cannot be found in user data.",
        success: false,
      });
    }
    const company = await prisma.organization.findUnique({
      where: { id: orgId },
    });
    return res.status(200).json({ success: true, company });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Fetch failed" });
  }
};

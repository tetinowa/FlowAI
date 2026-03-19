import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";

export const getMembersInfo: RequestHandler = async (req, res) => {
  try {
    const clerkId = req.clerkUserId;
    const org = await prisma.client.findFirst({
      where: { id: clerkId },
      select: { orgId: true },
    });

    if (!clerkId || !org) {
      return res.status(404).json({ message: "info not matchable" });
    }
    const { orgId } = org;
    const members = await prisma.client.findMany({
      where: {
        orgId: orgId as string,
      },
    });
    return res.status(201).json({ data: members });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "something went explshkwjg" });
  }
};

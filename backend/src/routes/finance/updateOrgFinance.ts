import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";

export const addFinance: RequestHandler = async (req, res) => {
  const { financeData } = req.body; //frontoos financedata gesen object avna shu
  const { orgId } = req.headers;
  if (!orgId) {
    return res.status(404).json({ message: "Couldn't find the company ID" });
  }
  try {
    const org = await prisma.organization.findUnique({
      where: { id: orgId as string },
    });
    if (!org) {
      return res
        .status(404)
        .json({ success: false, message: "org failed to load" });
    }
    const updateOrg = await prisma.organization.update({
      select: { id: orgId as string },
      data: {
        financeData: {
          update: financeData,
        },
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: e });
  }
};

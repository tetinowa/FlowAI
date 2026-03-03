import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";
export const registerMember: RequestHandler = async (req, res) => {
  const { orgId } = req.headers;
  const { clerkId } = req.headers;
  const data = req.body;
  if (!orgId) {
    return res.status(500).json({ message: "organizationId not found" });
  }
  try {
    const belongingOrg = await prisma.organization.findUnique({
      where: { id: orgId as string },
    });
    if (!belongingOrg) {
      return res.status(404).json({
        message: "Client doesn't belong to any organization",
        success: false,
      });
    }
    const newMember = await prisma.client.create({
      data: {
        id: clerkId as string,
        orgId: belongingOrg.id as string,
        role: data.role,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
      },
    });
    if (!newMember) {
      return res
        .status(500)
        .json({ message: "failed to registser member", success: false });
    }
    return res.status(200).json({ success: true, data: newMember });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "failed to register a member [registermember.ts]",
      success: false,
    });
  }
};

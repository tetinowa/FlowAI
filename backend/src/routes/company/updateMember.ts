import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";
import { clerkClient } from "../../lib/clerkClient";

export const UpdateMember: RequestHandler = async (req, res) => {
  try {
    const clerkId = req.clerkUserId;
    const { orgId } = req.body;
    const { memberId } = req.body;
    const { data } = req.body;
    const isAdmitabbleRole = await prisma.client.findFirst({
      where: {
        id: clerkId,
        role: "EXECUTIVE",
        ofOrg: orgId,
      },
    });
    if (!isAdmitabbleRole) {
      return res.status(404).json({ message: "UNAthourized", success: false });
    }
    const member = await prisma.client.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      return res.status(404).json({ message: "member id not found" });
    }

    const updated = await prisma.client.update({
      where: {
        id: memberId as string,
      },
      data: {
        role: data.role,
      },
    });
    return res.status(201).json({ success: true, data: updated });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "somethign went wrong" });
  }
};

export const DeleteMember: RequestHandler = async (req, res) => {
  try {
    const clerkId = req.clerkUserId;
    const { orgId } = req.body;
    const { memberId } = req.body;

    const isAdmitabbleRole = await prisma.client.findFirst({
      where: {
        id: clerkId,
        role: "EXECUTIVE",
        ofOrg: orgId,
      },
    });
    if (!isAdmitabbleRole) {
      return res.status(404).json({ message: "UNAthourized", success: false });
    }
    const member = await prisma.client.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      return res.status(404).json({ message: "member id not found" });
    }
    const deleted = await prisma.client.findUnique({ where: { id: memberId } });
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "failed to delete member", success: false });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Seomthign weugfiubaifvwref", success: false });
  }
};

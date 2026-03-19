import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";
import { customAlphabet } from "nanoid";

export const getCodeForMember: RequestHandler = async (req, res) => {
  try {
    const clerkId = req.clerkUserId;
    const org = await prisma.client.findFirst({
      where: { id: clerkId },
      select: { orgId: true },
    });
    if (!clerkId || !org) {
      return res
        .status(404)
        .json({ success: false, message: "Info not found" });
    }
    const { orgId } = org;

    if (!clerkId || !orgId) {
      return res.status(404).json({ message: "ID issue" });
    }

    const isAuthorized = await prisma.client.findFirst({
      where: { id: clerkId, role: "EXECUTIVE" },
    });

    if (!isAuthorized) {
      return res.status(403).json({
        message: `Unauthorized, clientId: ${clerkId}`,
        success: false,
      });
    }

    const newCode = customAlphabet("1234567890", 6);
    const instantCode = newCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const codeToSend = await prisma.inviteCode.create({
      data: {
        code: instantCode,
        orgId: orgId as string,
        createdBy: clerkId as string,
        expiresAt: expiresAt,
      },
    });

    return res.status(200).json({ optKey: codeToSend.code, expiresAt });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const registerMember: RequestHandler = async (req, res) => {
  const { optKey, role, email, firstname, lastname } = req.body;
  const clerkId = req.clerkUserId;

  if (!optKey) {
    return res.status(400).json({ message: "Invite code not provided" });
  }

  try {
    // find the code in DB
    const code = await prisma.inviteCode.findUnique({
      where: { code: optKey },
    });

    // does code exist?
    if (!code) {
      return res.status(404).json({ message: "Invalid code", success: false });
    }

    // has it expired? compare against right now ✅
    if (code.expiresAt < new Date()) {
      return res
        .status(408)
        .json({ message: "Code has expired", success: false });
    }

    // all good — create member and delete code together ✅
    const result = await prisma.$transaction(async (tx) => {
      const newMember = await tx.client.create({
        data: {
          id: clerkId as string,
          orgId: code.orgId, // comes from the invite code, not req.body
          role,
          email,
          firstname,
          lastname,
        },
      });

      await tx.inviteCode.delete({
        where: { code: optKey },
      });

      return newMember;
    });

    return res.status(200).json({ success: true, data: result });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "failed to register member",
      success: false,
    });
  }
};

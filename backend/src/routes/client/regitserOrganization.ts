import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";
import { clerkClient } from "../../lib/clerkClient";
import { customAlphabet, nanoid } from "nanoid";
export const registerOrganization: RequestHandler = async (req, res) => {
  try {
    const clerkId = req.clerkUserId;
    if (!clerkId) {
      return res.status(403).json({ message: "Unathourized" });
    }
    const data = req.body;
    const generateID = customAlphabet("QWERYUISXCDFBSYDWBC", 12);
    let newOrgId = generateID();
    let existingOrgId = await prisma.organization.findUnique({
      where: { id: newOrgId },
    });
    while (existingOrgId) {
      newOrgId = generateID();
      existingOrgId = await prisma.organization.findUnique({
        where: { id: newOrgId },
      });
    }

    let client = await prisma.client.findUnique({ where: { id: clerkId } });
    if (!client) {
      client = await prisma.client.create({
        data: {
          id: clerkId,
          role: "EXECUTIVE",
          email: data.email ?? "",
          firstname: clerkId,
          lastname: "",
        },
      });
    }

    //the section where the clerkid member is added:

    const clerkUser = await clerkClient.users.getUser(clerkId);

    const newOrg = await prisma.organization.create({
      data: {
        id: newOrgId,
        name: data.name,
        industry: data.industry,
        address: data.address ?? "",
        phoneNumber: data.phoneNumber ?? "",
        emailAddress: data.email ?? "",
        description: data.description ?? "",
        patronage: "BASIC",
      },
    });
    if (!newOrg) {
      return res
        .status(500)
        .json({ message: "failed to register org [registerOrg.ts]" });
    }

    await prisma.client.upsert({
      where: { id: clerkId },
      update: { orgId: newOrgId, role: "EXECUTIVE" },
      create: {
        id: clerkId,
        orgId: newOrgId,
        role: "EXECUTIVE",
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        firstname: clerkUser.firstName ?? "",
        lastname: clerkUser.lastName ?? "",
      },
    });

    await clerkClient.users.updateUser(clerkId, {
      publicMetadata: { onboardingComplete: true },
    });

    return res.status(200).json({ message: "New Org Registered", newOrg });
  } catch (e: any) {
    console.error("[registerOrganization] error:", e);
    return res.status(500).json({ message: e?.message ?? "Something went wrong" });
  }
};

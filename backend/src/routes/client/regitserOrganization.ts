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

    //the section where the clerkid member is added:

    const newOrg = await prisma.organization.create({
      data: {
        id: newOrgId,
        name: data.name,
        industry: data.industry,
        address: data.address,
        phoneNumber: data.phoneNumber,
        emailAddress: data.email,
        description: data.description,
        members: { connect: { id: clerkId } },
        patronage: "BASIC",
      },
    });
    if (!newOrg) {
      return res
        .status(500)
        .json({ message: "failed to register org [registerOrg.ts]" });
    }
    if (newOrg) {
      await clerkClient.users.updateUser(clerkId, {
        publicMetadata: { onboardingComplete: true },
      });
    }

    return res.status(200).json({ message: "New Org Registered", newOrg });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Somethign went wrong" });
  }
};

import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";
import { clerkClient } from "../../lib/clerkClient";

export const registerPatron: RequestHandler = async (req, res) => {
  try {
    const clerkId = req.clerkUserId;
    const data = req.body;

    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingUser = await prisma.client.findUnique({
      where: { id: clerkId },
    });
    if (existingUser) {
      await clerkClient.users.updateUser(clerkId, {
        publicMetadata: { onboardingComplete: true },
      });
      return res.status(200).json({ success: true, data: existingUser });
    }

    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          id: clerkId,
          name: data.name,
          industry: data.industry,
          patronage: "BASIC",
          createdAt: new Date(),
        },
      });

      const newClient = await tx.client.create({
        data: {
          id: clerkId,
          orgId: organization.id,
          role: data.role ?? "EXECUTIVE",
          email: data.email,
          firstname: data.firstname,
          lastname: data.lastname,
        },
      });

      return { organization, newClient };
    });

    // Clerk metadata-д onboarding дууссан гэж тэмдэглэнэ
    await clerkClient.users.updateUser(clerkId, {
      publicMetadata: { onboardingComplete: true },
    });

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Registration failed", success: false });
  }
};

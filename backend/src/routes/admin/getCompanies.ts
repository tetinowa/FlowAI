import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";

import { customAlphabet } from "nanoid";

export const getCompanyData: RequestHandler = async (_, res) => {
  try {
    const companyData = await prisma.organization.findMany({
      include: {
        members: true,
        aiUsages: true,
      },
    });
    if (!companyData) {
      return res.status(404).json({ message: "no data to be found" });
    }
    return res.status(200).json({ success: true, companyData });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "something went wrong [admin router - aibfiwe]",
    });
  }
};

export const createCompany: RequestHandler = async (req, res) => {
  //this works fine dont touch it [22-59]
  try {
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

    const newOrg = await prisma.organization.create({
      data: {
        id: newOrgId,
        name: data.name,
        industry: data.industry,
        address: data.address || undefined,
        phoneNumber: data.phoneNumber || undefined,
        emailAddress: data.email || undefined,
        description: data.description || undefined,
        members: undefined,
        patronage: "BASIC",
      },
    });
    return res.status(200).json({ message: "New Org Registered", newOrg });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Somethign went wronggg [adminrouter duh]" });
  }
};

export const deleteCompany: RequestHandler = async (req, res) => {
  try {
    const { orgId } = req.params;
    const deleted = await prisma.organization.delete({
      where: { id: orgId as string },
    });
    if (!deleted) {
      return res.status(403).json({
        message: "failure deleteing org from [adminsdjyudf]",
        success: false,
      });
    }
    return res
      .status(200)
      .json({ message: "successfully deleted", success: true });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Somrthignjasgef cuyegwuyf", success: false });
  }
};

export const readCompanydataById: RequestHandler = async (req, res) => {
  try {
    const { orgId } = req.params;
    console.log(orgId);
    if (!orgId) {
      return res
        .status(404)
        .json({ message: "org id not found", success: false });
    }
    const orgData = await prisma.organization.findUnique({
      where: { id: orgId as string },
      select: {
        members: true,
        patronage: true,
        emailAddress: true,
        phoneNumber: true,
      },
    });
    if (!orgData) {
      return res
        .status(404)
        .json({ message: "couldnt findsbusgfuwb", success: false });
    }
    return res.status(200).json({ orgData });
  } catch (e) {
    console.error(e);
  }
};

export const updateCompany: RequestHandler = async (req, res) => {
  //i presume this function will mainly used to updating

  try {
    const { data } = req.body;
    if (!data) {
      return res.status(404).json({ message: "f8nguncgn", success: false });
    }
    await prisma.organization.update({
      where: { id: data.id },
      data: {
        phoneNumber: data.phoneNumber,
        patronage: data.patronage,
        address: data.address,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "SIuegfo8ywgnastnkygu", success: false });
  }
};

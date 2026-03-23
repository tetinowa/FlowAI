import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";
import { clerkClient } from "../../lib/clerkClient";
//check if admin token valid
//check if admin id matches.
export const getUsersData: RequestHandler = async (req, res) => {
  try {
    const usersData = await prisma.client.findMany({});
    if (!usersData) {
      return res.status(404).json({ message: "no data to be found" });
    }
    return res.status(200).json({ success: true, usersData });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "something went wrong [admin router]" });
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(404)
        .json({ message: "orgId not found", success: false });
    }
    const deleted = await prisma.client.delete({
      where: {
        id: userId as string,
      },
    });
    await clerkClient.users.deleteUser(userId);
    //deleting user from clerk
    if (!deleted) {
      return res
        .status(403)
        .json({ message: "org to delete not successful", success: false });
    }
    return res.status(200).json({
      success: true,
      message: `deleted organization ${userId} successfully`,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "seomthign wehfguibw", success: false });
  }
};

export const getUsersofOrgbyId: RequestHandler = async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId) {
      return res
        .status(404)
        .json({ message: "couldnt parse orgId", success: false });
    }
    const usersToReturn = await prisma.client.findMany({
      where: {
        orgId: orgId as string,
      },
    });
    return res.status(200).json({ success: true, usersToReturn });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "theres been error", success: false });
  }
};

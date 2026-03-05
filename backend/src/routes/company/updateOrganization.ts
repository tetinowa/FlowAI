import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";


//total controller routes and their purposes:
//createOrganization on clientCreation -> clerk will make an id, and that id has to be sent to backend.

export const updateCompany: RequestHandler = async (req, res) => {

  try {
    const data = req.body;
    const { clerkId } = await req.headers;
    const { orgId } = await req.headers; //from authorization middleware
    if (!clerkId) {
      return res.status(404).json({ message: "Id not found" });
    }



    return res.status(201).json({ message: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

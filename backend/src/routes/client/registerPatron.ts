import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";

//total controller routes and their purposes:
//createOrganization on clientCreation -> clerk will make an id, and that id has to be sent to backend.

export const registerPatron: RequestHandler = async (req, res) => {
  try {
    const data = req.body;
    const { clerkId } = await req.headers;
    const { orgId } = await req.headers;

    if (!clerkId || !orgId) {
      return res.status(500).json({ message: "Id not found" });
    }
    const existinguser = await prisma.client.findUnique({
      where: { id: clerkId as string },
    });
    if (existinguser) {
      console.log("existing user");
      return res.status(401).json({ message: "existing user", success: false });
    }

    const result = await prisma.$transaction(async (tx) => {
      let organization = await tx.organization.findUnique({
        where: { id: orgId as string },
      });

      if (!organization) {
        // create the organization within the transaction and keep the result
        organization = await tx.organization.create({
          data: {
            id: orgId as string,
            industry: data.industry,
            // the generated type requires createdAt even though the schema
            // has a @default(now()). Provide a timestamp explicitly.
            createdAt: new Date(),
          },
        });
      }

      const newClient = await tx.client.create({
        data: {
          id: clerkId as string,
          orgId: organization!.id,
          role: data.role,
          email: data.email,
          firstname: data.firstname,
          lastname: data.lastname,
        },
      });
      return { organization, newClient };
    });
    return res
      .status(201)
      .json({ message: "registration success", success: true, data: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

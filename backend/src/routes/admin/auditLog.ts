import type { RequestHandler } from "express";
import prisma from "../../lib/prisma";
import { customAlphabet } from "nanoid";

//admin controlled audit log


export const getAuditLog: RequestHandler = async (_, res) => {
  try {
    const log = await prisma.auditLog.findMany({});
    if (!log) {
      return res
        .status(404)
        .json({ success: false, message: "auditLog error" });
    }
    return res.status(201).json(log);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "auditlog fetch ajsgdi" });
  }
};

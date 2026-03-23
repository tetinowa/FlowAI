import type { RequestHandler } from "express";
import  prisma  from "../../lib/prisma";
import jwt from "jsonwebtoken";
export const adminAccess: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(403).json({ message: "VPODKAAA", success: false });
    }
    const usernameMatch = await prisma.administrator.findUnique({
      where: { username: username },
    });
    const passwordMatch = await prisma.administrator.findFirst({
      where: { password: password },
    });

    if (!usernameMatch || !passwordMatch) {
      return res.status(403).json({ success: false, message: "aibfiwbf" });
    }

    const accessToken = jwt.sign(
      { adminId: usernameMatch.id, username: usernameMatch.username },
      `${process.env.ACCESSTOKEN}`,
    );

    return res.status(201).json({ success: true, res: accessToken });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong duh" });
  }
};
//this one gives accessToken on signin/login for superadmin

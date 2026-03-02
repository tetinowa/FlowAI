import type { RequestHandler } from "express";

export const registerCompany: RequestHandler = (req, res) => {
  const data = req.body;
  const { id } = req.headers;

  if (!id) {
    return res.status(404).json({ message: "Id not found" });
  }
};

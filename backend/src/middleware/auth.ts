import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const secretkey = process.env.JWT_SECRET as string;

export const protectRoute = (req: Request, res: Response, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "access denied no token provided" });
  }
  try {
    const decoded = jwt.verify(token, secretkey);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "invalid  or expires token " });
  }
};

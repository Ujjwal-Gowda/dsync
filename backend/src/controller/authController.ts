import prisma from "../config/prisma";
import { Request, Response } from "express";
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    if (!email && !name && !password) {
      res.status(400).json({ error: "missing fields" });
    }

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });

    res.status(201).json({
      success: true,
      message: "user created",
      userdata: user,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({ error: "A user with this email already exists." });
      return;
    }

    console.error("Controller Error:", error);
    res.status(500).json({ error: "Internal server operational failure." });
  }
};

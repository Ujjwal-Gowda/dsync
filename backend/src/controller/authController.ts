import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const secretkey = process.env.JWT_SECRET;

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ error: "missing fields" });
    }

    const exists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (exists) {
      return res.status(409).json({ error: "email already in use" });
    }

    const hashedpassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedpassword,
      },
    });
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 3600000,
    });

    return res.status(201).json({
      success: true,
      message: "user created",
      userdata: { id: user?.id, name: user?.name, email: user?.email },
    });
  } catch (error: any) {
    console.error(" auth Controller Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server operational failure." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "missing fields" });
    }

    const userData = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userData) {
      return res.status(401).json({ error: "email not registered " });
    }

    const isMatch = await bcrypt.compare(password, userData?.password);
    console.log(isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "wrong password" });
    }

    const token = generateToken(userData);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 3600000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      userdata: { name: userData?.name, email: userData?.email },
    });
  } catch (error: any) {
    console.error(" auth Controller Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server operational failure." });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  return res.json({ message: "logged out successfully" });
};

function generateToken(user: any) {
  const payload = {
    id: user?.id,
    name: user?.name,
    email: user?.email,
  };

  const options = {
    expiresIn: "1h",
  };

  const token = jwt.sign(payload, secretkey, options);

  return token;
}

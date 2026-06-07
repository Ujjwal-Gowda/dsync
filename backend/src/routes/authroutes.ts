import express from "express";
import { createUser } from "../controller/authController";
const router = express.Router();

router.post("/register", createUser);

router.post("/login", (req: any, res: any) => {
  res.json({ message: "login" });
  console.log("login page hit ");
});

export default router;

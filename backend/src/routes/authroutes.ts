import express from "express";
import {
  registerUser,
  loginUser,
  logout,
  userInfo,
} from "../controller/authController";
import { protectRoute } from "../middleware/auth";
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logout);

router.get("/", protectRoute, userInfo);

export default router;

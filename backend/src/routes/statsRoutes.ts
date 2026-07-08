import { Router } from "express";
import { protectRoute } from "../middleware/auth.ts";
import { getUserStats } from "../controller/statsController.ts";

const router = Router();

router.get("/", protectRoute, getUserStats);

export default router;

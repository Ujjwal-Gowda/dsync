import { Router } from "express";
import { protectRoute } from "../middleware/auth.ts";
import {
  getDashboardStats,
  getDashboardActivity,
  getUpcomingTasks
} from "../controller/dashboardController.ts";

const router = Router();

router.get("/stats", protectRoute, getDashboardStats);
router.get("/activity", protectRoute, getDashboardActivity);
router.get("/tasks/upcoming", protectRoute, getUpcomingTasks);

export default router;

import { Router } from "express";
import { protectRoute } from "../middleware/auth.ts";
import { fetchActivity } from "../controller/activityController.ts";
const router = Router();

router.get("/:id", protectRoute, fetchActivity);

export default router;

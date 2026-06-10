import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { fetchActivity } from "../controller/activityController";
const router = Router();

router.get("/:id", protectRoute, fetchActivity);

export default router;

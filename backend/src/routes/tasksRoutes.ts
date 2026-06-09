import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { updateTask } from "../controller/tasksController";
const router = Router();

router.patch("/:id", protectRoute, updateTask);

export default router;

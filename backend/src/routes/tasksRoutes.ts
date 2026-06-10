import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { updateTask, deleteTask } from "../controller/tasksController";
const router = Router();

router.patch("/:id", protectRoute, updateTask);
router.delete("/:id", protectRoute, deleteTask);

export default router;

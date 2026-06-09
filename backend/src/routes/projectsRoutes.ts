import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import {
  updateProject,
  deleteProject,
  createTask,
  fetchTask,
} from "../controller/projectController";
const router = Router();

router.patch("/projects/:id", protectRoute, updateProject);
router.delete("/:id", protectRoute, deleteProject);
router.post("/:id/task", protectRoute, createTask);
router.get("/:id/tasks", protectRoute, fetchTask);

export default router;

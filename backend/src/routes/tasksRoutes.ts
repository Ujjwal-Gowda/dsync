import { Router } from "express";
import { protectRoute } from "../middleware/auth.ts";
import {
  updateTask,
  deleteTask,
  updateStatus,
  createComment,
  fetchComments,
  getTaskById,
} from "../controller/tasksController.ts";
const router = Router();

router.get("/:id", protectRoute, getTaskById);
router.patch("/:id", protectRoute, updateTask);
router.delete("/:id", protectRoute, deleteTask);
router.patch("/:id/status", protectRoute, updateStatus);
router.post("/:id/comments", protectRoute, createComment);
router.get("/:id/comments", protectRoute, fetchComments);

export default router;

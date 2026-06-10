import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import {
  updateTask,
  deleteTask,
  updateStatus,
  createComment,
  fetchComments,
} from "../controller/tasksController";
const router = Router();

router.patch("/:id", protectRoute, updateTask);
router.delete("/:id", protectRoute, deleteTask);
router.patch("/:id/status", protectRoute, updateStatus);
router.post("/:id/comments", protectRoute, createComment);
router.get("/:id/comments", protectRoute, fetchComments);

export default router;

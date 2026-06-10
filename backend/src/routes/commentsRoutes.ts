import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { deleteComment, updateComment } from "../controller/commentController";
const router = Router();

router.delete("/:id", protectRoute, deleteComment);
router.patch("/:id", protectRoute, updateComment);

export default router;

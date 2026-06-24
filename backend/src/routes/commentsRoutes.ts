import { Router } from "express";
import { protectRoute } from "../middleware/auth.ts";
import { deleteComment, updateComment } from "../controller/commentController.ts";
const router = Router();

router.delete("/:id", protectRoute, deleteComment);
router.patch("/:id", protectRoute, updateComment);

export default router;

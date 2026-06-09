import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { updateProject, deleteProject } from "../controller/projectController";
const router = Router();

router.patch("/projects/:id", protectRoute, updateProject);
router.delete("/:id", protectRoute, deleteProject);

export default router;

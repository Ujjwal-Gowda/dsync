import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import {
  createWorkspace,
  fetchWorkspace,
  addMember,
  createProject,
  fetchProject,
} from "../controller/workspaceController";
const router = Router();

router.post("/", protectRoute, createWorkspace);

router.get("/", protectRoute, fetchWorkspace);

router.post("/:id/members", protectRoute, addMember);

router.post("/:id/projects", protectRoute, createProject);

router.get("/:id/projects", protectRoute, fetchProject);

export default router;

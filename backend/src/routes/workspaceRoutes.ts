import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import {
  createWorkspace,
  fetchWorkspace,
  addMember,
  getMember,
  deleteMember,
  createProject,
  fetchProject,
} from "../controller/workspaceController";
const router = Router();

router.post("/", protectRoute, createWorkspace);

router.get("/", protectRoute, fetchWorkspace);

router.post("/:id/members", protectRoute, addMember);

router.get("/:id/members", protectRoute, getMember);

router.delete("/:id/members/:userId", protectRoute, deleteMember);

router.post("/:id/projects", protectRoute, createProject);

router.get("/:id/projects", protectRoute, fetchProject);

export default router;

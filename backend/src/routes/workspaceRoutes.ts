import { Router } from "express";
import { protectRoute } from "../middleware/auth.ts";
import {
    createWorkspace,
    fetchWorkspace,
    addMember,
    getMember,
    deleteMember,
    createProject,
    fetchProject,
    fetchStats,
    projStats,
    getWorkspaceById,
    updateWorkspace,
    deleteWorkspace
} from "../controller/workspaceController.ts";
const router = Router();

router.post("/", protectRoute, createWorkspace);

router.get("/", protectRoute, fetchWorkspace);

router.get("/:id", protectRoute, getWorkspaceById);

router.patch("/:id", protectRoute, updateWorkspace);

router.delete("/:id", protectRoute, deleteWorkspace);

router.get("/:id/stats", protectRoute, fetchStats);

router.post("/:id/members", protectRoute, addMember);

router.get("/:id/members", protectRoute, getMember);

router.delete("/:id/members/:userId", protectRoute, deleteMember);

router.post("/:id/projects", protectRoute, createProject);

router.get("/:id/projects", protectRoute, fetchProject);

router.get("/:id/projstats", protectRoute, projStats);

export default router;

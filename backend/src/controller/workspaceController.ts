import { Request, Response } from "express";
import prisma from "../config/prisma.ts";
import { createActivity } from "../services/acitvity.services.ts";

export const createWorkspace = async (req: Request, res: Response) => {
  const { name } = req.body;
  const user = req.user;
  try {
    if (!name) {
      return res
        .status(400)
        .json({ error: "invalid credentials missing fields" });
    }

    const exists = await prisma.workspace.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (exists) {
      return res.status(409).json({ error: "name alredy in use" });
    }

    const workspace = await prisma.workspace.create({
      data: {
        name: name,
        ownerId: user.id,
      },
    });
    const member = await prisma.workspaceMembers.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: "OWNER",
      },
    });
    return res.status(201).json({
      status: "success",
      message: "workspace created",
      data: workspace,
    });
  } catch (error) {
    console.log("failure in creating workspace");
    res.status(500).json({ error: "failed creating workspace" });
  }
};

export const fetchWorkspace = async (req: Request, res: Response) => {
  const user = req.user;
  try {
    const fetchedUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        workspaceMemberships: {
          include: {
            workspace: true,
          },
        },
      },
    });
    if (!fetchedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const workspaces = fetchedUser.workspaceMemberships.map((membership) => ({
      role: membership.role,
      workspaces: membership.workspace,
    }));

    console.log(fetchedUser);
    return res.status(200).json({
      status: "success",
      message: "workspace fetched ",
      data: workspaces,
    });
  } catch (error) {
    console.log("failure in fetching workspace");
    res.status(500).json({ error: "failed fetching workspace" });
  }
};

export const addMember = async (req: Request, res: Response) => {
  const { userId, role } = req.body;
  const user = req.user;
  const workId = parseInt(req.params.id as string, 10);
  console.log(userId);
  try {
    const membership = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workId,
          userId: user.id,
        },
      },
    });

    if (
      !membership ||
      (membership.role !== "OWNER" && membership.role !== "ADMIN")
    ) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    const exists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!exists) {
      return res.status(404).json({ error: "user doesnt exist" });
    }

    const allowedRoles = ["OWNER", "ADMIN", "MEMBER"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        error: "Invalid role",
      });
    }
    if (role === "OWNER" && membership.role !== "OWNER") {
      return res.status(403).json({
        error: "Only owner can assign owner role",
      });
    }

    const priorMem = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workId,
          userId: userId,
        },
      },
    });
    console.log(priorMem);
    if (priorMem) {
      return res
        .status(409)
        .json({ error: "user already exists in the workspace" });
    }

    const response = await prisma.workspaceMembers.create({
      data: {
        workspaceId: workId,
        userId: userId,
        role: role,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "member added to workplace",
      data: response,
    });
  } catch (error) {
    console.log("failure in add member to  workspace", error);
    return res.status(500).json({ error: "failed adding member to workspace" });
  }
};

export const getMember = async (req: Request, res: Response) => {
  const user = req.user;
  const workId = parseInt(req.params.id as string, 10);
  try {
    const membership = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workId,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workId,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        projects: true,
      },
    });
    if (!workspace) {
      return res.status(404).json({
        error: "workspace not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "workplace data fetched",
      data: workspace,
    });
  } catch (error) {
    console.log("failure in fetching workspace data", error);
    return res.status(500).json({ error: "failed fetching workspace data" });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  const user = req.user;
  const userId = Number(req.params.userId);
  const workId = Number(req.params.id);
  try {
    if (user.id === userId) {
      return res.status(400).json({
        error: "Cannot remove yourself",
      });
    }
    const reqMembership = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workId,
          userId: user.id,
        },
      },
    });

    if (
      !reqMembership ||
      (reqMembership.role !== "OWNER" && reqMembership.role !== "ADMIN")
    ) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    const roles = {
      OWNER: 3,
      ADMIN: 2,
      MEMBER: 1,
    };
    const delMember = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workId,
          userId: userId,
        },
      },
    });
    if (!delMember) {
      return res
        .status(400)
        .json({ error: "user does not exist in the workspace" });
    }

    if (roles[delMember.role] < roles[reqMembership.role]) {
      const response = await prisma.workspaceMembers.delete({
        where: {
          workspaceId_userId: {
            workspaceId: workId,
            userId: userId,
          },
        },
      });

      return res.status(200).json({
        status: "success",
        message: "member removed to workplace",
        data: response,
      });
    }
    return res.status(403).json({
      error: "Cannot remove a member with equal or higher role",
    });
  } catch (error) {
    console.log("failure in removing member from  workspace", error);
    return res
      .status(500)
      .json({ error: "failed removing member from workspace" });
  }
};

export const createProject = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const workId = Number(req.params.id);
  const user = req.user;
  try {
    // input validation
    if (!name || !description || !workId) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }
    // requester authorization check
    const membership = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workId,
          userId: user.id,
        },
      },
    });

    if (
      !membership ||
      (membership.role !== "OWNER" && membership.role !== "ADMIN")
    ) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    // project name availability check
    const priorProj = await prisma.project.findFirst({
      where: {
        name: name,
        workspaceId: workId,
      },
    });

    if (priorProj) {
      return res.status(409).json({ error: "name already in use" });
    }

    const project = await prisma.project.create({
      data: {
        name: name,
        description: description,
        workspaceId: workId,
        createdById: user.id,
      },
    });

    await createActivity({
      type: "PROJECT_CREATED",
      workspaceId: workId,
      userId: user.id,
      projectId: project.id,
    });
    return res.status(201).json({
      status: "success",
      message: "project added to workplace",
      data: project,
    });
  } catch (error) {
    console.log("failure in add project to  workspace", error);
    return res
      .status(500)
      .json({ error: "failed adding project to workspace" });
  }
};

export const fetchProject = async (req: Request, res: Response) => {
  const workId = Number(req.params.id);
  const user = req.user;
  const { status, search } = req.query;
  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;
  try {
    // input validation
    if (!workId) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }
    // requester authorization check
    const membership = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workId,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    // workspace fetch
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workId,
      },
      include: {
        projects: true,
      },
    });

    if (!workspace) {
      return res.status(404).json({ error: "workspace not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "projects fetched from workplace",
      data: workspace.projects,
    });
  } catch (error) {
    console.log("failure in fetching projects from  workspace", error);
    return res
      .status(500)
      .json({ error: "failed to fetch projects from workspace" });
  }
};

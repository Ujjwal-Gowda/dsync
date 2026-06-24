import type { Request, Response } from "express";
import prisma from "../config/prisma.ts";
import { createActivity } from "../services/acitvity.services.ts";
import { ProjectStatus } from "../generated/prisma/enums.ts";
import { Prisma } from "../generated/prisma/client.ts";

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
    const workspaces = fetchedUser.workspaceMemberships.map((membership: any) => ({
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

export const fetchStats = async (req: Request, res: Response) => {
  const user = req.user;
  const workId = Number(req.params.id);
  try {
    if (isNaN(workId)) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const membership = await prisma.workspace.findUnique({
      where: {
        id: workId,
      },
    });

    if (!membership) {
      return res.status(404).json({
        error: "workspace not found",
      });
    }

    const [projects, members, tasks, statusCounts] = await Promise.all([
      prisma.project.count({
        where: {
          workspaceId: workId,
          deletedAt: null,
        },
      }),

      prisma.workspaceMembers.count({
        where: {
          workspaceId: workId,
        },
      }),
      prisma.task.count({
        where: {
          project: {
            workspaceId: workId,
            deletedAt: null,
          },
          deletedAt: null,
        },
      }),
      prisma.task.groupBy({
        by: ["status"],
        where: {
          project: {
            workspaceId: workId,
            deletedAt: null,
          },
          deletedAt: null,
        },
        _count: true,
      }),
    ]);

    const taskStatusBreakdown = statusCounts.reduce(
      (acc: Record<string, number>, item: any) => {
        acc[item.status] = item._count;
        return acc;
      },
      {} as Record<string, number>,
    );
    return res.status(200).json({
      status: "success",
      message: "workspace stats fetched ",
      projects: projects,
      members: members,
      tasks: tasks,
      statusCounts: taskStatusBreakdown,
    });
  } catch (error) {
    console.log("failure in fetching workspace stats");
    res.status(500).json({ error: "failed fetching workspace stats" });
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
        projects: {
          where: {
            deletedAt: null,
          },
        },
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

    if (roles[delMember.role as keyof typeof roles] < roles[reqMembership.role as keyof typeof roles]) {
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
    if (isNaN(workId)) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workId,
      },
    });

    if (!workspace) {
      return res.status(404).json({
        error: "workspace not found",
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
    const filter: Prisma.ProjectWhereInput = {
      workspaceId: workId,
      deletedAt: null,
    };

    if (status) {
      filter.status = status as ProjectStatus;
    }

    if (search) {
      filter.OR = [
        { name: { contains: String(search), mode: "insensitive" } },
        { description: { contains: String(search), mode: "insensitive" } },
      ];
    }
    const projects = await prisma.project.findMany({
      where: filter,
      skip,
      take: limit,
    });

    const total = await prisma.project.count({
      where: filter,
    });

    if (!projects) {
      return res.status(404).json({ error: "projects not found" });
    }

    return res.status(200).json({
      status: "success",
      count: projects.length,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      data: projects,
    });
  } catch (error) {
    console.log("failure in fetching projects from  workspace", error);
    return res
      .status(500)
      .json({ error: "failed to fetch projects from workspace" });
  }
};

export const projStats = async (req: Request, res: Response) => {
  const user = req.user;
  const projectId = Number(req.params.id);
  try {
    if (isNaN(projectId)) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      return res.status(404).json({ error: "project not found" });
    }

    const membership = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: project.workspaceId,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    const tasks = await prisma.task.count({
      where: {
        projectId,
        deletedAt: null,
      },
    });
    const statusCounts = await prisma.task.groupBy({
      by: ["status"],
      where: {
        projectId,
        deletedAt: null,
      },
      _count: true,
    });
    const taskStatusBreakdown = statusCounts.reduce(
      (acc: Record<string, number>, item: any) => {
        acc[item.status] = item._count;
        return acc;
      },
      {} as Record<string, number>,
    );
    return res.status(200).json({
      status: "success",
      message: "project stats fetched ",
      tasks: tasks,
      statusCounts: taskStatusBreakdown,
    });
  } catch (error) {
    console.log("failure in fetching project stats");
    res.status(500).json({ error: "failed fetching project stats" });
  }
};

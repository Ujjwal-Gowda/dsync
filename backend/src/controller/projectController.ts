import type { Request, Response } from "express";
import prisma from "../config/prisma.ts";
import { Priority, ProjectStatus, Status } from "../generated/prisma/enums.ts";
import { createActivity } from "../services/acitvity.services.ts";
import { Prisma } from "../generated/prisma/client.ts";
import { title } from "node:process";

export const updateProject = async (req: Request, res: Response) => {
  const { name, description, status } = req.body;
  const projectId = Number(req.params.id);
  const user = req.user;
  try {
    // input validation
    if (!name && !status && !description) {
      return res.status(400).json({
        error: "Missing fields to update",
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

    // requester authorization check
    const membership = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: project.workspaceId,
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

    const updateData: {
      name?: string;
      description?: string;
      status?: ProjectStatus;
    } = {};

    if (name) {
      const priorProj = await prisma.project.findFirst({
        where: {
          name,
          workspaceId: project.workspaceId,
          NOT: {
            id: projectId,
          },
        },
      });

      if (priorProj) {
        return res.status(409).json({
          error: "name already in use",
        });
      }
    }

    if (description) {
      updateData.description = description;
    }
    const validStatuses = [
      "PLANNING",
      "ACTIVE",
      "ON_HOLD",
      "COMPLETED",
      "ARCHIVED",
    ];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
      });
    }
    if (status) {
      updateData.status = status;
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });

    await createActivity({
      type: "PROJECT_UPDATED",
      workspaceId: project.workspaceId,
      userId: user.id,
      projectId: project.id,
    });

    return res.status(200).json({
      status: "success",
      message: "project updated",
      data: updatedProject,
    });
  } catch (error) {
    console.log("failure in updating project data", error);
    return res.status(500).json({ error: "failed updating project data" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const projectId = Number(req.params.id);
  const user = req.user;
  try {
    if (isNaN(projectId)) {
      return res.status(400).json({
        error: "Invalid project id",
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

    // requester authorization check
    const membership = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: project.workspaceId,
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

    const deletedProject = await prisma.project.update({
      where: { id: projectId },
      data: { deletedAt: new Date() },
    });

    await createActivity({
      type: "PROJECT_DELETED",
      workspaceId: project.workspaceId,
      userId: user.id,
      projectId: project.id,
    });
    return res.status(200).json({
      status: "success",
      message: "project deleted",
      data: deletedProject,
    });
  } catch (error) {
    console.log("failure deleting project data", error);
    return res.status(500).json({ error: "failed deleting project " });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const { title, description, priority, assignee } = req.body;
  const projectId = Number(req.params.id);
  const user = req.user;
  try {
    if (!title || !description || !priority || !projectId) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }
    const project = await prisma.project.findUnique({
      where: { id: projectId },
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

    // project name availability check
    // const exists = await prisma.task.findFirst({
    //   where: {
    //     title: title,
    //     projectId: project.id,
    //   },
    // });
    //
    // if (exists) {
    //   return res.status(409).json({ error: "title already in use" });
    // }
    const task = await prisma.task.create({
      data: {
        title: title,
        description: description,
        priority: priority,
        projectId: project.id,
        createdById: user.id,
        assigneeId: assignee ?? null,
      },
    });

    await createActivity({
      type: "TASK_CREATED",
      workspaceId: project.workspaceId,
      userId: user.id,
      taskId: task.id,
      projectId: project.id,
    });

    return res.status(201).json({
      status: "success",
      message: "task created",
      data: task,
    });
  } catch (error) {
    console.log("failure in creating task", error);
    return res.status(500).json({ error: "failed creating task" });
  }
};

export const fetchTask = async (req: Request, res: Response) => {
  const projectId = Number(req.params.id);
  const user = req.user;
  const { status, priority, assigneeId, sortBy, order, search } = req.query;
  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;
  // const assigneeId = Number(req.query.assigneeId);
  // const page = Number(req.query.page);
  // const limit = Number(req.query.limit);
  try {
    if (isNaN(projectId)) {
      return res.status(400).json({ error: "missing project id" });
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

    const filter: Prisma.TaskWhereInput = {
      projectId,
      deletedAt: null,
    };

    if (status) {
      filter.status = status as Status;
    }

    if (priority) {
      filter.priority = priority as Priority;
    }

    if (assigneeId) {
      filter.assigneeId = Number(assigneeId);
    }

    if (search) {
      filter.OR = [
        {
          title: {
            contains: String(search),
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: String(search),
            mode: "insensitive",
          },
        },
      ];
    }

    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "priority",
      "status",
      "title",
    ];

    if (sortBy && !allowedSortFields.includes(String(sortBy))) {
      return res.status(400).json({
        error: "invalid sort field",
      });
    }

    const orderBy: any = sortBy
      ? { [String(sortBy)]: order === "asc" ? "asc" : "desc" }
      : { createdAt: "desc" };

    const tasks = await prisma.task.findMany({
      where: filter,
      orderBy,
      skip,
      take: limit,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      message: "task fetched successfully",
      page,
      limit,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.log("failure fetching tasks", error);
    return res.status(500).json({ error: "failed fetching tasks" });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  const projectId = Number(req.params.id);
  const user = req.user;
  try {
    if (isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        deletedAt: null,
      },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
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
      return res.status(403).json({ error: "Not authorized" });
    }

    return res.status(200).json({
      status: "success",
      data: project,
    });
  } catch (error) {
    console.log("Error fetching project by id", error);
    return res.status(500).json({ error: "failed fetching project" });
  }
};

import type { Request, Response } from "express";
import prisma from "../config/prisma.ts";
import { Priority } from "../generated/prisma/enums.ts";
import { createActivity } from "../services/acitvity.services.ts";

export const updateTask = async (req: Request, res: Response) => {
  const { title, description, priority, assignee } = req.body;
  const taskId = Number(req.params.id);
  const user = req.user;
  try {
    if (isNaN(taskId)) {
      return res.status(400).json({
        error: "Invalid task id",
      });
    }

    const tasks = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          select: {
            workspaceId: true,
          },
        },
      },
    });

    if (!tasks) {
      return res.status(404).json({ error: "task not found" });
    }

    const membership = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: tasks.project.workspaceId,
          userId: user.id,
        },
      },
    });

    if (
      !membership ||
      (membership.role !== "OWNER" &&
        membership.role !== "ADMIN" &&
        tasks.createdById !== user.id)
    ) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    const updateData: {
      title?: string;
      description?: string;
      priority?: Priority;
      assigneeId?: number;
    } = {};

    if (title) updateData.title = title;

    if (description) updateData.description = description;

    if (priority) updateData.priority = priority;

    if (assignee === null) {
      updateData.assigneeId = null;
    } else if (assignee !== undefined) {
      const assigneevalid = await prisma.workspaceMembers.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: tasks.project.workspaceId,
            userId: assignee,
          },
        },
      });

      if (!assigneevalid) {
        return res.status(403).json({
          error: "assignee not a memner of workspace",
        });
      }
      updateData.assigneeId = assignee;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: "No fields provided for update",
      });
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    await createActivity({
      type: "TASK_UPDATED",
      workspaceId: tasks.project.workspaceId,
      userId: user.id,
      taskId: task.id,
      projectId: task.projectId,
    });

    return res.status(200).json({
      status: "success",
      message: "task updated",
      data: task,
    });
  } catch (error) {
    console.log("failure in updating tasks", error);
    return res.status(500).json({ error: "failed updating tasks" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const taskId = Number(req.params.id);
  const user = req.user;
  try {
    if (isNaN(taskId)) {
      return res.status(400).json({
        error: "Invalid task id",
      });
    }

    const tasks = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          select: {
            workspaceId: true,
          },
        },
      },
    });

    if (!tasks) {
      return res.status(404).json({ error: "task not found" });
    }

    const membership = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: tasks.project.workspaceId,
          userId: user.id,
        },
      },
    });

    if (
      !membership ||
      (membership.role !== "OWNER" &&
        membership.role !== "ADMIN" &&
        tasks.createdById !== user.id)
    ) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        deletedAt: new Date(),
      },
    });

    await createActivity({
      type: "TASK_DELETED",
      workspaceId: tasks.project.workspaceId,
      userId: user.id,
      taskId: task.id,
      projectId: task.projectId,
    });

    return res.status(200).json({
      status: "success",
      message: "task deleted",
      data: task,
    });
  } catch (error) {
    console.log("failure in deleting task", error);
    return res.status(500).json({ error: "failed deletig task" });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const taskId = Number(req.params.id);
  const user = req.user;
  try {
    if (isNaN(taskId)) {
      return res.status(400).json({
        error: "Invalid task id",
      });
    }
    if (!status) {
      return res.status(400).json({ error: "no status provided to update" });
    }

    const tasks = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          select: {
            workspaceId: true,
          },
        },
      },
    });

    if (!tasks) {
      return res.status(404).json({ error: "task not found" });
    }

    const membership = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: tasks.project.workspaceId,
          userId: user.id,
        },
      },
    });

    if (
      !membership ||
      (membership.role !== "OWNER" &&
        membership.role !== "ADMIN" &&
        tasks.createdById !== user.id &&
        tasks.assigneeId !== user.id)
    ) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }
    const validStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
      });
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    await createActivity({
      type: "TASK_STATUS_CHANGED",
      workspaceId: tasks.project.workspaceId,
      userId: user.id,
      taskId: task.id,
      projectId: task.projectId,
    });
    return res.status(200).json({
      status: "success",
      message: "status updated",
      data: task,
    });
  } catch (error) {
    console.log("failure in updating task status", error);
    return res.status(500).json({ error: "failed updating task status" });
  }
};

export const createComment = async (req: Request, res: Response) => {
  const { content } = req.body;
  const taskId = Number(req.params.id);
  const user = req.user;
  try {
    // input validation
    if (!content) {
      return res.status(400).json({
        error: "Missing content ",
      });
    }

    if (isNaN(taskId)) {
      return res.status(400).json({
        error: "task id missing ",
      });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          select: {
            workspaceId: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(400).json({ error: "couldn't find task" });
    }

    // requester authorization check
    const membership = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: task.project.workspaceId,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content,
        taskId: taskId,
        userId: user.id,
      },
    });

    await createActivity({
      type: "COMMENT_CREATED",
      workspaceId: task.project.workspaceId,
      userId: user.id,
      taskId: task.id,
      projectId: task.projectId,
    });

    return res.status(201).json({
      status: "success",
      message: "comment created in the task",
      data: comment,
    });
  } catch (error) {
    console.log("failure in creating comment", error);
    return res.status(500).json({ error: "failed creating comment" });
  }
};

export const fetchComments = async (req: Request, res: Response) => {
  const taskId = Number(req.params.id);
  const user = req.user;
  try {
    // input validation
    if (isNaN(taskId)) {
      return res.status(400).json({
        error: "invalid task id",
      });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          select: {
            workspaceId: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ error: "couldn't find task" });
    }
    // requester authorization check
    const membership = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: task.project.workspaceId,
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
    const comments = await prisma.comment.findMany({
      where: {
        taskId: taskId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (comments.length === 0) {
      return res.status(200).json({ status: "success", data: comments });
    }

    return res.status(200).json({
      status: "success",
      message: "comments fetched from tasks",
      data: comments,
    });
  } catch (error) {
    console.log("failure in fetching comments from  tasks", error);
    return res
      .status(500)
      .json({ error: "failed to fetch comments from tasks" });
  }
};

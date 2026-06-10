import { Request, Response } from "express";
import prisma from "../config/prisma.ts";
import { TaskStatus } from "../generated/prisma/enums.ts";

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
      priority?: TaskStatus;
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

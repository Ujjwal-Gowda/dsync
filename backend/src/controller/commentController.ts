import { Request, Response } from "express";
import prisma from "../config/prisma.ts";
import { createActivity } from "../services/acitvity.services.ts";

export const deleteComment = async (req: Request, res: Response) => {
  const commentId = Number(req.params.id);
  const user = req.user;
  try {
    if (isNaN(commentId)) {
      return res.status(400).json({
        error: "comment id missing ",
      });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        task: {
          select: {
            project: {
              select: {
                workspaceId: true,
              },
            },
          },
        },
      },
    });

    if (!comment) {
      return res.status(400).json({ error: "couldn't find task" });
    }

    // requester authorization check
    const membership = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: comment.task.project.workspaceId,
          userId: user.id,
        },
      },
    });

    if (
      !membership ||
      (membership.role !== "OWNER" &&
        membership.role !== "ADMIN" &&
        comment.userId !== user.id)
    ) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    const deletedcomment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    await createActivity({
      type: "COMMENT_DELETED",
      workspaceId: comment.task.project.workspaceId,
      userId: user.id,
      taskId: comment.taskId,
    });

    return res.status(200).json({
      status: "success",
      message: "comment deleted in the task",
      data: deletedcomment,
    });
  } catch (error) {
    console.log("failure in deleting comment", error);
    return res.status(500).json({ error: "failed deleting comment" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  const { content } = req.body;
  const commentId = Number(req.params.id);
  const user = req.user;
  try {
    if (!content?.trim()) {
      return res.status(400).json({
        error: "Missing content ",
      });
    }

    if (isNaN(commentId)) {
      return res.status(400).json({
        error: "invalid comment id ",
      });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        task: {
          select: {
            project: {
              select: {
                workspaceId: true,
              },
            },
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "comment not found" });
    }

    // requester authorization check
    const membership = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: comment.task.project.workspaceId,
          userId: user.id,
        },
      },
    });

    if (!membership || comment.userId !== user.id) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    const updatedcomment = await prisma.comment.update({
      where: {
        id: commentId,
        deletedAt: null,
      },
      data: {
        content: content,
      },
    });

    await createActivity({
      type: "COMMENT_UPDATED",
      workspaceId: comment.task.project.workspaceId,
      userId: user.id,
      taskId: comment.taskId,
    });
    return res.status(200).json({
      status: "success",
      message: "comment updated",
      data: updatedcomment,
    });
  } catch (error) {
    console.log("failure in updating comment", error);
    return res.status(500).json({ error: "failed updating comment" });
  }
};

import type { Request, Response } from "express";
import prisma from "../config/prisma.ts";

export const fetchActivity = async (req: Request, res: Response) => {
  const user = req.user;
  const workId = Number(req.params.id);
  try {
    if (isNaN(workId)) {
      return res.status(400).json({
        error: "Invalid work id",
      });
    }
    const Member = await prisma.workspaceMembers.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workId,
          userId: user.id,
        },
      },
    });
    if (!Member) {
      return res
        .status(403)
        .json({ error: "user does not exist in the workspace" });
    }
    const activityLog = await prisma.activity.findMany({
      where: {
        workspaceId: workId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      status: "success",
      message: "activity log fetched ",
      data: activityLog,
    });
  } catch (error) {
    console.log("failure in fetching activity log");
    res.status(500).json({ error: "failed fetching acitvity log" });
  }
};

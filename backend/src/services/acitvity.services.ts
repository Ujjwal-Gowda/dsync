import prisma from "../config/prisma.ts";
import { ActivityType } from "../generated/prisma/enums.ts";
export const createActivity = async ({
  type,
  workspaceId,
  userId,
  taskId,
  projectId,
  metadata,
}: {
  type: ActivityType;
  workspaceId: number;
  userId: number;
  taskId?: number;
  projectId?: number;
  metadata?: any;
}) => {
  return await prisma.activity.create({
    data: {
      type,
      workspaceId,
      userId,
      taskId: taskId ?? null,
      projectId: projectId ?? null,
      metadata,
    },
  });
};

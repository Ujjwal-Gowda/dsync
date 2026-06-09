import { Request, Response } from "express";
import prisma from "../config/prisma.ts";
import { ProjectStatus } from "../generated/prisma/enums.ts";

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

    // project name availability check
    const priorProj = await prisma.project.findFirst({
      where: {
        name: name,
        workspaceId: project.workspaceId,
      },
    });

    if (priorProj) {
      return res.status(409).json({ error: "name already in use" });
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

    const deletedProject = await prisma.project.delete({
      where: { id: projectId },
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

import type { Request, Response } from "express";
import prisma from "../config/prisma.ts";

export const getUserStats = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user || !user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = user.id;

  try {
    // 1. Fetch workspaces the user is in (either as owner or member)
    const workspaces = await prisma.workspace.findMany({
      where: {
        deletedAt: null,
        OR: [
          { ownerId: userId },
          { members: { some: { userId: userId } } }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          select: {
            userId: true,
            role: true
          }
        },
        projects: {
          where: { deletedAt: null },
          select: { id: true }
        }
      }
    });

    const workspaceData = workspaces.map(w => {
      const userMembership = w.members.find(m => m.userId === userId);
      return {
        id: w.id,
        name: w.name,
        ownerId: w.ownerId,
        ownerName: w.owner.name,
        role: userMembership ? userMembership.role : "OWNER",
        memberCount: w.members.length,
        projectCount: w.projects.length
      };
    });

    // 2. Fetch projects the user is involved in (projects belonging to workspaces the user is in)
    const workspaceIds = workspaces.map(w => w.id);
    const projects = await prisma.project.findMany({
      where: {
        deletedAt: null,
        workspaceId: { in: workspaceIds }
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true
          }
        },
        tasks: {
          where: { deletedAt: null },
          select: {
            id: true,
            status: true
          }
        }
      }
    });

    const projectData = projects.map(p => {
      const totalTasks = p.tasks.length;
      const completedTasks = p.tasks.filter(t => t.status === "DONE").length;
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        workspaceId: p.workspaceId,
        workspaceName: p.workspace.name,
        taskCount: totalTasks,
        completedTaskCount: completedTasks
      };
    });

    // 3. Fetch task stats (assigned to user)
    const assignedTasks = await prisma.task.findMany({
      where: {
        deletedAt: null,
        assigneeId: userId
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const totalTasksAssigned = assignedTasks.length;
    const tasksCompleted = assignedTasks.filter(t => t.status === "DONE").length;
    const tasksInProgress = assignedTasks.filter(t => t.status === "IN_PROGRESS").length;
    const tasksTodo = assignedTasks.filter(t => t.status === "TODO").length;
    const tasksInReview = assignedTasks.filter(t => t.status === "IN_REVIEW").length;

    // Task status counts
    const statusCounts = {
      TODO: tasksTodo,
      IN_PROGRESS: tasksInProgress,
      IN_REVIEW: tasksInReview,
      DONE: tasksCompleted
    };

    // Task priority counts
    const priorityCounts = {
      LOW: assignedTasks.filter(t => t.priority === "LOW").length,
      MEDIUM: assignedTasks.filter(t => t.priority === "MEDIUM").length,
      HIGH: assignedTasks.filter(t => t.priority === "HIGH").length,
      URGENT: assignedTasks.filter(t => t.priority === "URGENT").length
    };

    const completionRate = totalTasksAssigned > 0 ? (tasksCompleted / totalTasksAssigned) * 100 : 0;

    // 4. Fetch recent activity in workspaces the user is in
    const recentActivities = await prisma.activity.findMany({
      where: {
        workspaceId: { in: workspaceIds }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        },
        task: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    const activityData = recentActivities.map(a => ({
      id: a.id,
      type: a.type,
      userId: a.userId,
      userName: a.user.name || a.user.email,
      workspaceId: a.workspaceId,
      projectId: a.projectId,
      projectName: a.project?.name || null,
      taskId: a.taskId,
      taskTitle: a.task?.title || null,
      metadata: a.metadata,
      createdAt: a.createdAt
    }));

    return res.status(200).json({
      status: "success",
      data: {
        summary: {
          totalWorkspaces: workspaceData.length,
          totalProjects: projectData.length,
          totalTasksAssigned,
          tasksCompleted,
          tasksInProgress,
          tasksTodo,
          tasksInReview,
          completionRate: Math.round(completionRate * 10) / 10,
          statusCounts,
          priorityCounts
        },
        workspaces: workspaceData,
        projects: projectData,
        recentActivities: activityData
      }
    });
  } catch (error: any) {
    console.error("Error fetching user stats:", error);
    return res.status(500).json({ error: "Failed to fetch user stats" });
  }
};

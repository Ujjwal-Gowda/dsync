import type { Request, Response } from "express";
import prisma from "../config/prisma.ts";

export const getDashboardStats = async (req: Request, res: Response) => {
    const user = req.user;
    try {
        if (!user || !user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userId = Number(user.id);

        const [workspaceCount, projectCount, taskCount, completedTaskCount] = await Promise.all([
            prisma.workspaceMembers.count({
                where: { userId }
            }),
            prisma.project.count({
                where: {
                    workspace: {
                        members: {
                            some: { userId }
                        }
                    },
                    deletedAt: null
                }
            }),
            prisma.task.count({
                where: {
                    assigneeId: userId,
                    deletedAt: null
                }
            }),
            prisma.task.count({
                where: {
                    assigneeId: userId,
                    status: "DONE",
                    deletedAt: null
                }
            })
        ]);

        return res.status(200).json({
            status: "success",
            data: {
                workspaceCount,
                projectCount,
                taskCount,
                completedTaskCount
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return res.status(500).json({ error: "Failed fetching dashboard stats" });
    }
};

export const getDashboardActivity = async (req: Request, res: Response) => {
    const user = req.user;
    try {
        if (!user || !user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userId = Number(user.id);

        const userWorkspaces = await prisma.workspaceMembers.findMany({
            where: { userId },
            select: { workspaceId: true }
        });

        const workspaceIds = userWorkspaces.map(w => w.workspaceId);

        const activityLog = await prisma.activity.findMany({
            where: {
                workspaceId: { in: workspaceIds }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                workspace: {
                    select: {
                        id: true,
                        name: true
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
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 10
        });

        return res.status(200).json({
            status: "success",
            data: activityLog
        });
    } catch (error) {
        console.error("Error fetching dashboard activity:", error);
        return res.status(500).json({ error: "Failed fetching dashboard activity" });
    }
};

export const getUpcomingTasks = async (req: Request, res: Response) => {
    const user = req.user;
    try {
        if (!user || !user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userId = Number(user.id);

        const userWorkspaces = await prisma.workspaceMembers.findMany({
            where: { userId },
            select: { workspaceId: true }
        });

        const workspaceIds = userWorkspaces.map(w => w.workspaceId);

        const tasks = await prisma.task.findMany({
            where: {
                project: {
                    workspaceId: { in: workspaceIds }
                },
                status: { not: "DONE" },
                dueDate: { not: null },
                deletedAt: null
            },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                        workspaceId: true
                    }
                }
            },
            orderBy: {
                dueDate: "asc"
            },
            take: 15
        });

        return res.status(200).json({
            status: "success",
            data: tasks
        });
    } catch (error) {
        console.error("Error fetching upcoming tasks:", error);
        return res.status(500).json({ error: "Failed fetching upcoming tasks" });
    }
};

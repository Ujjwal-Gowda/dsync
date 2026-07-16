"use client"
import CurrentUser from "@/hooks/currentUser"
import { getDashboardStats } from "@/services/dashboard.service"
import { getWorkspaces } from "@/services/workspace.service"
import { getDashboardActivity } from "@/services/dashboard.service"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { 
    MessageSquare, 
    PlusCircle, 
    CheckCircle2, 
    FolderKanban, 
    Activity, 
    Trash2, 
    UserPlus, 
    Edit 
} from "lucide-react"
import { act } from "react"

interface workspaceCount {
    workspaceCount: number,
    projectCount: number,
    taskCount: number,
    completedTaskCount: number
}

export default function Dashboard() {
    const { isLoading: userLoad, isError: userError, data: user } = CurrentUser()
    const { data: dashStats, isLoading: statsLoading, isError: statsError } = useQuery<workspaceCount>({
        queryKey: ["dashStats"],
        queryFn: getDashboardStats
    })

    const { data: dashWork, isLoading: worksLoading, isError: worksError } = useQuery({
        queryKey: ["dashworkspaces"],
        queryFn: getWorkspaces
    })
    console.log(dashWork)

    const { data: dashAct, isLoading: actLoading, isError: actError } = useQuery({
        queryKey: ["dashAct"],
        queryFn: getDashboardActivity
    })
    console.log(dashAct)
    console.log(dashStats)
    return (
        <div className="p-4">
            <h1>Dashboard</h1>
            {!userLoad ? <h2>welcome {user.name}</h2> : <h2>welcome</h2>}

            <Card className="mx-auto w-full max-w-sm m-5">
                <CardHeader>
                    <CardTitle>Stats</CardTitle>
                </CardHeader>
                <CardContent>
                    {!statsLoading ?

                        <ul className="grid gap-2 py-2 text-sm">
                            <li className="flex gap-2">
                                <span>Workspaces : {dashStats?.workspaceCount}</span>
                            </li>
                            <li className="flex gap-2">
                                <span>Projects : {dashStats?.projectCount}</span>
                            </li>
                            <li className="flex gap-2">
                                <span>tasks :{dashStats?.taskCount}</span>
                            </li>

                            <li className="flex gap-2">
                                <span>completed tasks :{dashStats?.completedTaskCount}</span>
                            </li>
                        </ul>
                        : <h2>loading stats</h2>
                    }
                </CardContent>

            </Card>


            <Card className="mx-auto w-full max-w-sm m-5">
                <CardHeader>
                    <CardTitle>Workspaces</CardTitle>
                </CardHeader>
                <CardContent>
                    {worksLoading ? (
                        <div className="text-sm text-muted-foreground animate-pulse py-4 text-center">
                            Loading workspaces...
                        </div>
                    ) : worksError || !dashWork?.data ? (
                        <div className="text-sm text-destructive py-4 text-center">
                            Failed to fetch workspaces
                        </div>
                    ) : dashWork.data.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-4 text-center">
                            No workspaces found.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {dashWork.data.map((workspace: any) => (
                                <Link
                                    key={workspace.workspaces.id}
                                    href={`/workspace/${workspace.workspaces.id}`}
                                    className="block transition-transform active:scale-[0.98]"
                                >
                                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer border border-border/40 shadow-sm">
                                        <CardContent className="p-3 flex justify-between items-center gap-4">
                                            <span className="font-medium text-foreground truncate">
                                                {workspace.workspaces.name}
                                            </span>
                                            <span className="text-[10px] uppercase font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded tracking-wider shrink-0">
                                                {workspace.role}
                                            </span>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="mx-auto w-full max-w-sm m-5">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    {actLoading ? (
                        <div className="text-sm text-muted-foreground animate-pulse py-4 text-center">
                            Loading activities...
                        </div>
                    ) : actError || !dashAct?.data ? (
                        <div className="text-sm text-destructive py-4 text-center">
                            Failed to fetch activities
                        </div>
                    ) : dashAct.data.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-4 text-center">
                            No activity found.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {dashAct.data.map((activity: any) => (
                                <Link
                                    key={activity.id}
                                    href={`/workspace/${activity.workspaceId}`}
                                    className="block transition-transform active:scale-[0.99]"
                                >
                                    <div className="flex items-start gap-3 p-2.5 rounded-lg border border-border/40 bg-card hover:bg-muted/40 transition-colors cursor-pointer shadow-sm">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/60">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground leading-tight">
                                                {getActivityMessage(activity)}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                                                <span className="font-semibold text-primary/80">
                                                    {activity.workspace?.name}
                                                </span>
                                                {activity.project?.name && (
                                                    <>
                                                        <span>/</span>
                                                        <span>{activity.project.name}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap self-start mt-0.5 shrink-0">
                                            {formatRelativeTime(activity.createdAt)}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="mx-auto w-full max-w-sm m-5">
                <CardTitle>UPcoming Tasks</CardTitle>

            </Card>

            <Card className="mx-auto w-full max-w-sm m-5" >
                <CardTitle>Quick Actions</CardTitle>
            </Card>
        </div>


    )
}

const getActivityIcon = (type: string) => {
    switch (type) {
        case "TASK_CREATED":
            return <PlusCircle className="h-4 w-4 text-green-500" />;
        case "TASK_UPDATED":
        case "TASK_STATUS_CHANGED":
            return <Edit className="h-4 w-4 text-blue-500" />;
        case "TASK_DELETED":
            return <Trash2 className="h-4 w-4 text-red-500" />;
        case "TASK_ASSIGNED":
            return <UserPlus className="h-4 w-4 text-purple-500" />;
        case "COMMENT_CREATED":
            return <MessageSquare className="h-4 w-4 text-amber-500" />;
        case "PROJECT_CREATED":
            return <FolderKanban className="h-4 w-4 text-indigo-500" />;
        default:
            return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
};

const getActivityMessage = (activity: any) => {
    const userName = activity.user?.name || "Someone";
    const taskTitle = activity.task?.title ? `"${activity.task.title}"` : "a task";
    const projectName = activity.project?.name ? `"${activity.project.name}"` : "a project";

    switch (activity.type) {
        case "TASK_CREATED":
            return `${userName} created task ${taskTitle}`;
        case "TASK_UPDATED":
            return `${userName} updated task ${taskTitle}`;
        case "TASK_DELETED":
            return `${userName} deleted a task`;
        case "TASK_ASSIGNED":
            return `${userName} assigned task ${taskTitle}`;
        case "TASK_STATUS_CHANGED":
            return `${userName} moved task ${taskTitle} to ${activity.metadata?.status || "another status"}`;
        case "COMMENT_CREATED":
            return `${userName} commented on task ${taskTitle}`;
        case "COMMENT_UPDATED":
            return `${userName} updated a comment on ${taskTitle}`;
        case "COMMENT_DELETED":
            return `${userName} deleted a comment on ${taskTitle}`;
        case "PROJECT_CREATED":
            return `${userName} created project ${projectName}`;
        case "PROJECT_UPDATED":
            return `${userName} updated project ${projectName}`;
        case "PROJECT_DELETED":
            return `${userName} deleted project ${projectName}`;
        default:
            return `${userName} performed an action: ${activity.type.toLowerCase().replace(/_/g, " ")}`;
    }
};

function formatRelativeTime(dateStr: string) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDays === 1) return "yesterday";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

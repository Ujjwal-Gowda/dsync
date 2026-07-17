"use client"
import CurrentUser from "@/hooks/currentUser"
import { getDashboardStats, getDashboardActivity, getUpcomingTasks } from "@/services/dashboard.service"
import { getWorkspaces } from "@/services/workspace.service"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import {
    MessageSquare,
    PlusCircle,
    CheckCircle2,
    FolderKanban,
    Activity,
    Trash2,
    UserPlus,
    Edit,
    Briefcase,
    CheckSquare,
    FolderPlus,
    Plus
} from "lucide-react"
import { useState, useEffect } from "react"
import { getProjects, createProjects } from "@/services/project.service"
import { createTask } from "@/services/task.service"
import { getWorkspacesMembers, createWorkspaces } from "@/services/workspace.service"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"

interface workspaceCount {
    workspaceCount: number,
    projectCount: number,
    taskCount: number,
    completedTaskCount: number
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

function formatDueDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();

    const dDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = dDate.getTime() - dNow.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return {
            text: `Overdue (${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`,
            color: 'text-red-500 bg-red-500/10 border-red-500/20 dark:bg-red-950/40'
        };
    } else if (diffDays === 0) {
        return {
            text: 'Due Today',
            color: 'text-amber-500 bg-amber-500/10 border-amber-500/20 dark:bg-amber-950/40'
        };
    } else if (diffDays === 1) {
        return {
            text: 'Due Tomorrow',
            color: 'text-blue-500 bg-blue-500/10 border-blue-500/20 dark:bg-blue-950/40'
        };
    } else {
        return {
            text: `Due ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
            color: 'text-muted-foreground bg-muted border-border/50'
        };
    }
}

export default function Dashboard() {
    const queryClient = useQueryClient();

    // Dialog state variables
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
    const [isProjectOpen, setIsProjectOpen] = useState(false);
    const [isTaskOpen, setIsTaskOpen] = useState(false);

    // Create Workspace Form State
    const [newWorkspaceName, setNewWorkspaceName] = useState("");
    const [isSubmittingWorkspace, setIsSubmittingWorkspace] = useState(false);

    // Create Project Form State
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
    const [newProjectName, setNewProjectName] = useState("");
    const [newProjectDescription, setNewProjectDescription] = useState("");
    const [isSubmittingProject, setIsSubmittingProject] = useState(false);

    // Create Task Form State
    const [taskWorkspaceId, setTaskWorkspaceId] = useState("");
    const [taskProjectId, setTaskProjectId] = useState("");
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskPriority, setTaskPriority] = useState("MEDIUM");
    const [taskAssigneeId, setTaskAssigneeId] = useState("");
    const [taskDueDate, setTaskDueDate] = useState("");
    const [isSubmittingTask, setIsSubmittingTask] = useState(false);

    const [workspaceProjects, setWorkspaceProjects] = useState<any[]>([]);
    const [workspaceMembers, setWorkspaceMembers] = useState<any[]>([]);

    const { isLoading: userLoad, isError: userError, data: user } = CurrentUser()
    const { data: dashStats, isLoading: statsLoading, isError: statsError } = useQuery<workspaceCount>({
        queryKey: ["dashStats"],
        queryFn: getDashboardStats
    })

    const { data: dashWork, isLoading: worksLoading, isError: worksError } = useQuery({
        queryKey: ["dashworkspaces"],
        queryFn: getWorkspaces
    })

    const { data: dashAct, isLoading: actLoading, isError: actError } = useQuery({
        queryKey: ["dashAct"],
        queryFn: getDashboardActivity
    })
    const { data: upcomingData, isLoading: upcomingLoading, isError: upcomingError } = useQuery({
        queryKey: ["upcomingTasks"],
        queryFn: getUpcomingTasks
    })

    useEffect(() => {
        if (!taskWorkspaceId) {
            setWorkspaceProjects([]);
            setWorkspaceMembers([]);
            setTaskProjectId("");
            setTaskAssigneeId("");
            return;
        }

        // Reset sub-selections when workspace changes to prevent mismatch/errors
        setTaskProjectId("");
        setTaskAssigneeId("");

        const loadWorkspaceData = async () => {
            try {
                const workId = Number(taskWorkspaceId);
                const projectsData = await getProjects(workId);
                setWorkspaceProjects(projectsData.data || []);

                const membersData = await getWorkspacesMembers(workId);
                setWorkspaceMembers(membersData.data?.members || []);
            } catch (error) {
                console.error("Failed to load workspace projects/members", error);
            }
        };

        loadWorkspaceData();
    }, [taskWorkspaceId]);

    const handleCreateWorkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWorkspaceName.trim()) return;

        setIsSubmittingWorkspace(true);
        try {
            await createWorkspaces(newWorkspaceName);
            await queryClient.invalidateQueries({ queryKey: ["dashworkspaces"] });
            await queryClient.invalidateQueries({ queryKey: ["dashStats"] });
            setNewWorkspaceName("");
            setIsWorkspaceOpen(false);
        } catch (error) {
            console.error("Failed to create workspace", error);
        } finally {
            setIsSubmittingWorkspace(false);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedWorkspaceId || !newProjectName.trim()) return;

        setIsSubmittingProject(true);
        try {
            await createProjects(Number(selectedWorkspaceId), newProjectName, newProjectDescription);
            await queryClient.invalidateQueries({ queryKey: ["dashStats"] });
            await queryClient.invalidateQueries({ queryKey: ["dashAct"] });
            setNewProjectName("");
            setNewProjectDescription("");
            setSelectedWorkspaceId("");
            setIsProjectOpen(false);
        } catch (error) {
            console.error("Failed to create project", error);
        } finally {
            setIsSubmittingProject(false);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskProjectId || !taskTitle.trim() || !taskAssigneeId) return;

        setIsSubmittingTask(true);
        try {
            await createTask(
                Number(taskProjectId),
                taskTitle,
                taskDescription,
                taskPriority as any,
                Number(taskAssigneeId),
                taskDueDate || undefined
            );
            await queryClient.invalidateQueries({ queryKey: ["upcomingTasks"] });
            await queryClient.invalidateQueries({ queryKey: ["dashStats"] });
            await queryClient.invalidateQueries({ queryKey: ["dashAct"] });
            setTaskTitle("");
            setTaskDescription("");
            setTaskPriority("MEDIUM");
            setTaskWorkspaceId("");
            setTaskProjectId("");
            setTaskAssigneeId("");
            setTaskDueDate("");
            setIsTaskOpen(false);
        } catch (error) {
            console.error("Failed to create task", error);
        } finally {
            setIsSubmittingTask(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                {!userLoad ? (
                    <p className="text-muted-foreground">Welcome back, {user.name}!</p>
                ) : (
                    <p className="text-muted-foreground font-medium">Welcome back!</p>
                )}
            </div>

            {statsLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 w-full animate-pulse rounded-xl bg-muted" />
                    ))}
                </div>
            ) : statsError || !dashStats ? (
                <div className="p-4 border border-destructive/20 bg-destructive/10 text-destructive text-sm rounded-xl text-center">
                    Failed to fetch dashboard stats
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Workspaces KPI */}
                    <div className="flex flex-col p-4.5 rounded-xl border border-border/40 bg-card hover:bg-muted/30 transition-colors shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                Workspaces
                            </span>
                            <Briefcase className="h-5 w-5 text-primary/70" />
                        </div>
                        <span className="text-3xl font-black text-foreground">
                            {dashStats.workspaceCount}
                        </span>
                    </div>

                    {/* Projects KPI */}
                    <div className="flex flex-col p-4.5 rounded-xl border border-border/40 bg-card hover:bg-muted/30 transition-colors shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                Projects
                            </span>
                            <FolderKanban className="h-5 w-5 text-blue-500/70" />
                        </div>
                        <span className="text-3xl font-black text-foreground">
                            {dashStats.projectCount}
                        </span>
                    </div>

                    {/* Tasks KPI */}
                    <div className="flex flex-col p-4.5 rounded-xl border border-border/40 bg-card hover:bg-muted/30 transition-colors shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                Tasks
                            </span>
                            <CheckSquare className="h-5 w-5 text-amber-500/70" />
                        </div>
                        <span className="text-3xl font-black text-foreground">
                            {dashStats.taskCount}
                        </span>
                    </div>

                    {/* Completion KPI */}
                    <div className="flex flex-col p-4.5 rounded-xl border border-border/40 bg-card hover:bg-muted/30 transition-colors shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                Completed
                            </span>
                            <CheckCircle2 className="h-5 w-5 text-green-500/70" />
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl font-black text-foreground">
                                {dashStats.completedTaskCount}
                            </span>
                            {dashStats.taskCount > 0 && (
                                <span className="text-xs text-muted-foreground font-semibold bg-muted px-1.5 py-0.5 rounded">
                                    {Math.round((dashStats.completedTaskCount / dashStats.taskCount) * 100)}% Done
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* quick actions */}
            <div className="flex flex-col gap-2 mt-2">
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Create workspace */}
                    <Dialog open={isWorkspaceOpen} onOpenChange={setIsWorkspaceOpen}>
                        <DialogTrigger render={
                            <button className="flex items-center gap-4 p-4.5 rounded-xl border border-border/40 bg-card hover:bg-muted/40 hover:border-primary/30 transition-all text-left group cursor-pointer shadow-xs active:scale-[0.99] w-full">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">New Workspace</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5 truncate">Create a new team collaboration space</p>
                                </div>
                                <div className="text-muted-foreground group-hover:text-primary transition-colors pr-1">
                                    <Plus className="h-5 w-5" />
                                </div>
                            </button>
                        } />
                        <DialogContent className="sm:max-w-md border border-border/40 bg-card shadow-lg p-5">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold text-foreground">Create Workspace</DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                    Create a new workspace to organize your projects and team members.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateWorkspace} className="flex flex-col gap-4 mt-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Workspace Name</label>
                                    <Input
                                        type="text"
                                        required
                                        value={newWorkspaceName}
                                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                                        placeholder="e.g. Engineering, Marketing"
                                        className="w-full h-10 border-border/40 bg-background"
                                    />
                                </div>
                                <DialogFooter className="mt-4 flex gap-2">
                                    <Button type="submit" disabled={isSubmittingWorkspace || !newWorkspaceName.trim()} className="w-full sm:w-auto">
                                        {isSubmittingWorkspace ? "Creating..." : "Create Workspace"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Create Project  */}
                    <Dialog open={isProjectOpen} onOpenChange={setIsProjectOpen}>
                        <DialogTrigger render={
                            <button className="flex items-center gap-4 p-4.5 rounded-xl border border-border/40 bg-card hover:bg-muted/40 hover:border-blue-500/30 transition-all text-left group cursor-pointer shadow-xs active:scale-[0.99] w-full">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-105 transition-transform">
                                    <FolderPlus className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-foreground group-hover:text-blue-500 transition-colors">New Project</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5 truncate">Add a new project inside a workspace</p>
                                </div>
                                <div className="text-muted-foreground group-hover:text-blue-500 transition-colors pr-1">
                                    <Plus className="h-5 w-5" />
                                </div>
                            </button>
                        } />
                        <DialogContent className="sm:max-w-md border border-border/40 bg-card shadow-lg p-5">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold text-foreground">Create Project</DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                    Add a new project inside one of your workspaces.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateProject} className="flex flex-col gap-4 mt-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Workspace</label>
                                    <select
                                        required
                                        value={selectedWorkspaceId}
                                        onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                                        className="flex h-10 w-full rounded-lg border border-border/40 bg-background px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-ring"
                                    >
                                        <option value="">Select a workspace...</option>
                                        {dashWork?.data?.map((w: any) => (
                                            <option key={w.workspaces.id} value={w.workspaces.id}>
                                                {w.workspaces.name} ({w.role.toLowerCase()})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Project Name</label>
                                    <Input
                                        type="text"
                                        required
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        placeholder="e.g. Website Overhaul"
                                        className="w-full h-10 border-border/40 bg-background"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</label>
                                    <textarea
                                        required
                                        value={newProjectDescription}
                                        onChange={(e) => setNewProjectDescription(e.target.value)}
                                        placeholder="Briefly describe the project objectives..."
                                        className="flex min-h-20 w-full rounded-lg border border-border/40 bg-background px-3 py-2 text-sm outline-hidden placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                                    />
                                </div>
                                <DialogFooter className="mt-4 flex gap-2">
                                    <Button type="submit" disabled={isSubmittingProject || !selectedWorkspaceId || !newProjectName.trim()} className="w-full sm:w-auto">
                                        {isSubmittingProject ? "Creating..." : "Create Project"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Create Task  */}
                    <Dialog open={isTaskOpen} onOpenChange={setIsTaskOpen}>
                        <DialogTrigger render={
                            <button className="flex items-center gap-4 p-4.5 rounded-xl border border-border/40 bg-card hover:bg-muted/40 hover:border-amber-500/30 transition-all text-left group cursor-pointer shadow-xs active:scale-[0.99] w-full">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-105 transition-transform">
                                    <CheckSquare className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-foreground group-hover:text-amber-500 transition-colors">New Task</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5 truncate">Assign a task to a project member</p>
                                </div>
                                <div className="text-muted-foreground group-hover:text-amber-500 transition-colors pr-1">
                                    <Plus className="h-5 w-5" />
                                </div>
                            </button>
                        } />
                        <DialogContent className="sm:max-w-md border border-border/40 bg-card shadow-lg p-5">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold text-foreground">Create Task</DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                    Add a task with an assignee, priority, and due date.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateTask} className="flex flex-col gap-3.5 mt-3">

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Workspace</label>
                                        <select
                                            required
                                            value={taskWorkspaceId}
                                            onChange={(e) => setTaskWorkspaceId(e.target.value)}
                                            className="flex h-10 w-full rounded-lg border border-border/40 bg-background px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-ring"
                                        >
                                            <option value="">Select...</option>
                                            {dashWork?.data?.map((w: any) => (
                                                <option key={w.workspaces.id} value={w.workspaces.id}>
                                                    {w.workspaces.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Project</label>
                                        <select
                                            required
                                            disabled={!taskWorkspaceId}
                                            value={taskProjectId}
                                            onChange={(e) => setTaskProjectId(e.target.value)}
                                            className="flex h-10 w-full rounded-lg border border-border/40 bg-background px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-ring disabled:opacity-50"
                                        >
                                            <option value="">Select...</option>
                                            {workspaceProjects.map((p: any) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Task Title</label>
                                    <Input
                                        type="text"
                                        required
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}
                                        placeholder="e.g. Implement OAuth Flow"
                                        className="w-full h-10 border-border/40 bg-background"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</label>
                                    <textarea
                                        value={taskDescription}
                                        onChange={(e) => setTaskDescription(e.target.value)}
                                        placeholder="Describe what needs to be done..."
                                        className="flex min-h-16 w-full rounded-lg border border-border/40 bg-background px-3 py-2 text-sm outline-hidden placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Priority</label>
                                        <select
                                            required
                                            value={taskPriority}
                                            onChange={(e) => setTaskPriority(e.target.value)}
                                            className="flex h-10 w-full rounded-lg border border-border/40 bg-background px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-ring"
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                            <option value="URGENT">Urgent</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Assignee</label>
                                        <select
                                            required
                                            disabled={!taskWorkspaceId}
                                            value={taskAssigneeId}
                                            onChange={(e) => setTaskAssigneeId(e.target.value)}
                                            className="flex h-10 w-full rounded-lg border border-border/40 bg-background px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-ring disabled:opacity-50"
                                        >
                                            <option value="">Select...</option>
                                            {workspaceMembers.map((m: any) => (
                                                <option key={m.userId} value={m.userId}>
                                                    {m.user?.name || `User ${m.userId}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Due Date</label>
                                    <Input
                                        type="date"
                                        value={taskDueDate}
                                        onChange={(e) => setTaskDueDate(e.target.value)}
                                        className="w-full h-10 border-border/40 bg-background"
                                    />
                                </div>

                                <DialogFooter className="mt-4 flex gap-2">
                                    <Button type="submit" disabled={isSubmittingTask || !taskProjectId || !taskTitle.trim() || !taskAssigneeId} className="w-full sm:w-auto">
                                        {isSubmittingTask ? "Creating..." : "Create Task"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-2">

                {/* Workspaces Card */}
                <Card className="w-full border border-border/40 shadow-sm flex flex-col h-[450px]">
                    <CardHeader className="shrink-0 pb-3">
                        <CardTitle>Workspaces</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto pr-1.5 pb-4">
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
                                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer border border-border/30 shadow-sm">
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

                {/* Upcoming Tasks Card */}
                <Card className="w-full border border-border/40 shadow-sm flex flex-col h-[450px]">
                    <CardHeader className="shrink-0 pb-3">
                        <CardTitle>Upcoming Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto pr-1.5 pb-4">
                        {upcomingLoading ? (
                            <div className="text-sm text-muted-foreground animate-pulse py-4 text-center">
                                Loading upcoming tasks...
                            </div>
                        ) : upcomingError || !upcomingData?.data ? (
                            <div className="text-sm text-destructive py-4 text-center">
                                Failed to fetch upcoming tasks
                            </div>
                        ) : upcomingData.data.length === 0 ? (
                            <div className="text-sm text-muted-foreground py-4 text-center">
                                No upcoming tasks.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {upcomingData.data.map((task: any) => {
                                    const dueInfo = formatDueDate(task.dueDate);
                                    return (
                                        <Link
                                            key={task.id}
                                            href={`/workspace/${task.project?.workspaceId}`}
                                            className="block transition-transform active:scale-[0.99]"
                                        >
                                            <div className="p-2.5 rounded-lg border border-border/40 bg-card hover:bg-muted/40 transition-colors cursor-pointer shadow-sm">
                                                <div className="flex justify-between items-start gap-2">
                                                    <span className="text-sm font-medium text-foreground leading-tight truncate">
                                                        {task.title}
                                                    </span>
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${dueInfo.color}`}>
                                                        {dueInfo.text}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center mt-1.5 text-xs text-muted-foreground">
                                                    <span className="truncate">{task.project?.name}</span>
                                                    <span className="text-[10px] uppercase font-semibold bg-secondary/60 px-1.5 py-0.5 rounded text-secondary-foreground">
                                                        {task.priority.toLowerCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity Card */}
                <Card className="w-full border border-border/40 shadow-sm flex flex-col h-[450px]">
                    <CardHeader className="shrink-0 pb-3">
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto pr-1.5 pb-4">
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
                            <div className="flex flex-col gap-2.5">
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

            </div>
        </div>
    )
}


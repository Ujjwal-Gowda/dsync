'use client'

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProject } from "@/services/project.service";
import { getTasks } from "@/services/task.service";
import Link from "next/link";
import { 
  FolderKanban, 
  Plus, 
  Calendar, 
  Users, 
  Briefcase, 
  Filter, 
  List, 
  Kanban, 
  CheckSquare, 
  Clock, 
  User, 
  ShieldAlert, 
  ArrowLeft,
  ChevronRight,
  Eye,
  AlertTriangle
} from "lucide-react";
import { Status, Priority } from "@/types/user";

export default function ProjectDashboard() {
    const params = useParams();
    const router = useRouter();
    const projId = Number(params?.id);

    const [viewMode, setViewMode] = useState<"board" | "list">("board");
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    
    // Form fields for visualization
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [taskPriority, setTaskPriority] = useState<Priority>(Priority.MEDIUM);

    // Queries
    const { data: projectResponse, isLoading: isProjectLoading, error: projectError } = useQuery({
        queryKey: ['project', projId],
        queryFn: () => getProject(projId),
        enabled: !!projId,
    });

    // Fetch tasks (using page 1, high limit, and general params for the board view)
    const { data: tasksResponse, isLoading: isTasksLoading } = useQuery({
        queryKey: ['project-tasks', projId],
        queryFn: () => getTasks(
            projId, 
            1, 
            50, 
            undefined as any, 
            undefined as any, 
            undefined as any, 
            "desc", 
            "createdAt" as any, 
            ""
        ),
        enabled: !!projId,
    });

    if (isProjectLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                    <p className="text-slate-400 text-xs font-medium">Fetching board columns...</p>
                </div>
            </div>
        );
    }

    if (projectError || !projectResponse?.data) {
        return (
            <div className="p-8 max-w-2xl mx-auto mt-10">
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-6 rounded-2xl flex flex-col items-center text-center gap-4">
                    <ShieldAlert className="h-10 w-10 text-rose-400" />
                    <div>
                        <h3 className="font-bold text-lg text-white">Project Not Found</h3>
                        <p className="text-sm mt-1 text-rose-300/80">The project is deleted or you are not authorized to view it.</p>
                    </div>
                    <button 
                        onClick={() => router.push("/dashboard")} 
                        className="px-4 py-2 bg-slate-800 text-xs font-semibold rounded-xl border border-slate-700 text-white hover:bg-slate-700 transition-all cursor-pointer"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const project = projectResponse.data;
    const realTasks = tasksResponse?.data || [];

    // Fallback Mock tasks to make the UI look rich if no tasks exist
    const mockTasks = [
        {
            id: 101,
            title: "Configure Next.js Root Layouts",
            description: "Set up the workspace layouts, global CSS imports, and sidebar triggers.",
            status: Status.TODO,
            priority: Priority.HIGH,
            createdAt: new Date(),
            assigneeId: 1
        },
        {
            id: 102,
            title: "Build Kanban Board View UI",
            description: "Implement interactive columns, task card details, tag templates.",
            status: Status.IN_PROGRESS,
            priority: Priority.MEDIUM,
            createdAt: new Date(),
            assigneeId: 2
        },
        {
            id: 103,
            title: "Establish Authentication Middleware",
            description: "Protect API routes and check session validation on backend.",
            status: Status.IN_REVIEW,
            priority: Priority.URGENT,
            createdAt: new Date(),
            assigneeId: 3
        },
        {
            id: 104,
            title: "Setup Prisma Model Relations",
            description: "Map migrations for Workspaces, Members, Projects, and Tasks.",
            status: Status.DONE,
            priority: Priority.LOW,
            createdAt: new Date(),
            assigneeId: 4
        }
    ];

    // Combine real and mock tasks
    const allTasks = realTasks.length > 0 ? realTasks : mockTasks;

    const columns = [
        { id: Status.TODO, title: "To Do", color: "bg-slate-800 text-slate-300 border-slate-700/60" },
        { id: Status.IN_PROGRESS, title: "In Progress", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
        { id: Status.IN_REVIEW, title: "In Review", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
        { id: Status.DONE, title: "Completed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" }
    ];

    const getPriorityBadgeColor = (p: Priority) => {
        switch(p) {
            case Priority.URGENT: return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
            case Priority.HIGH: return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
            case Priority.MEDIUM: return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
            case Priority.LOW: return "bg-slate-800 text-slate-400 border border-slate-750";
            default: return "bg-slate-800 text-slate-400";
        }
    };

    const handleAddTaskSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowAddTaskModal(false);
        setTaskTitle("");
        setTaskDesc("");
    };

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
            
            {/* Breadcrumb / Nav */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
                <Link href={`/workspace/${project.workspaceId}`} className="hover:text-slate-300 flex items-center gap-1">
                    Workspace
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-slate-400 font-medium">Projects</span>
            </div>

            {/* Title Board Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
                <div className="space-y-1">
                    <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                        <FolderKanban className="h-6 w-6 text-indigo-400" />
                        {project.name}
                    </h1>
                    <p className="text-slate-400 text-xs max-w-xl leading-relaxed">
                        {project.description || "Track steps, assign tasks, and monitor statuses inside columns."}
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {/* View Switcher */}
                    <div className="flex bg-slate-950/40 p-1.5 rounded-xl border border-slate-850 text-xs">
                        <button 
                            onClick={() => setViewMode("board")}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'board' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                            title="Board View"
                        >
                            <Kanban className="h-3.5 w-3.5" />
                        </button>
                        <button 
                            onClick={() => setViewMode("list")}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                            title="List View"
                        >
                            <List className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <button 
                        onClick={() => setShowAddTaskModal(true)}
                        className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-md transition-all active:scale-[0.98]"
                    >
                        <Plus className="h-4 w-4" /> Add Task
                    </button>
                </div>
            </div>

            {/* BOARD VIEW */}
            {viewMode === "board" ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
                    {columns.map((col) => {
                        const columnTasks = allTasks.filter((t: any) => t.status === col.id);
                        return (
                            <div key={col.id} className="bg-slate-950/20 border border-slate-850 rounded-2xl p-4 space-y-4 h-[70vh] flex flex-col overflow-hidden">
                                
                                {/* Column title */}
                                <div className="flex items-center justify-between shrink-0">
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${col.color}`}>
                                        {col.title}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-950 p-1.5 rounded-lg border border-slate-850">
                                        {columnTasks.length}
                                    </span>
                                </div>

                                {/* Column task list */}
                                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                                    {columnTasks.length > 0 ? (
                                        columnTasks.map((task: any) => (
                                            <div 
                                                key={task.id}
                                                className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl shadow-sm space-y-3 group transition-all"
                                            >
                                                <div className="flex justify-between items-start gap-3">
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${getPriorityBadgeColor(task.priority)}`}>
                                                        {task.priority}
                                                    </span>
                                                    <Link 
                                                        href={`/task/${task.id}`}
                                                        className="p-1 text-slate-500 hover:text-indigo-400 bg-slate-950 rounded border border-slate-850 transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                    </Link>
                                                </div>
                                                
                                                <h3 className="font-bold text-xs text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-1 leading-snug">
                                                    {task.title}
                                                </h3>

                                                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                                    {task.description || "No description."}
                                                </p>

                                                <div className="flex items-center justify-between border-t border-slate-950 pt-3">
                                                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    
                                                    {/* Assignee Avatar */}
                                                    <div className="h-5 w-5 bg-indigo-600/35 border border-indigo-500/20 text-white rounded-full flex items-center justify-center font-bold text-[9px]">
                                                        {task.assigneeId ? `U${task.assigneeId}` : 'A'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-[10px] text-slate-500 italic">
                                            No tasks in column
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                
                /* LIST VIEW */
                <div className="bg-slate-950/20 border border-slate-850 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-slate-850 bg-slate-950/40 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                <th className="p-4">Title</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Priority</th>
                                <th className="p-4">Created Date</th>
                                <th className="p-4 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTasks.map((t: any) => (
                                <tr key={t.id} className="border-b border-slate-900/60 hover:bg-slate-950/10 transition-colors">
                                    <td className="p-4 font-semibold text-slate-200">
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs">{t.title}</p>
                                            <span className="text-[10px] text-slate-500 block max-w-sm truncate">{t.description}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-800 text-slate-300 border border-slate-700">
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${getPriorityBadgeColor(t.priority)}`}>
                                            {t.priority}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-right">
                                        <Link 
                                            href={`/task/${t.id}`}
                                            className="inline-flex items-center gap-1.5 bg-slate-950 border border-slate-850 hover:border-indigo-500/40 hover:text-indigo-400 text-slate-400 text-[10px] px-3 py-1.5 rounded-xl transition-all font-semibold"
                                        >
                                            View <Eye className="h-3 w-3" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Task Modal */}
            {showAddTaskModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <form onSubmit={handleAddTaskSubmit} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
                        <div className="space-y-1.5">
                            <h3 className="text-lg font-bold text-white">Create Task</h3>
                            <p className="text-slate-400 text-xs font-medium">Add a task step under this project.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Task Title</label>
                                <input 
                                    type="text" 
                                    required
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                    placeholder="Implement backend controller route..."
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Description</label>
                                <textarea 
                                    required
                                    value={taskDesc}
                                    onChange={(e) => setTaskDesc(e.target.value)}
                                    placeholder="Provide detailed instruction notes..."
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 outline-none h-20 resize-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Priority</label>
                                <select 
                                    value={taskPriority}
                                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 text-xs text-slate-200 outline-none"
                                >
                                    <option value={Priority.LOW}>LOW</option>
                                    <option value={Priority.MEDIUM}>MEDIUM</option>
                                    <option value={Priority.HIGH}>HIGH</option>
                                    <option value={Priority.URGENT}>URGENT</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2 text-xs">
                            <button type="button" onClick={() => setShowAddTaskModal(false)} className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl cursor-pointer">
                                Create Task
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Simulating ws updates message */}
            {realTasks.length === 0 && (
                <div className="p-4 bg-slate-950/20 border border-slate-850 rounded-2xl flex items-center gap-3 text-xs text-slate-400 max-w-xl">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                    <div>
                        <span className="font-bold text-slate-300">Board Simulation Mode:</span> No real project tasks are synced on database for this board ID. Showing mock checklist columns for visual styling preview.
                    </div>
                </div>
            )}

        </div>
    );
}

'use client'

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter as FilterIcon, 
  SlidersHorizontal, 
  Clock, 
  MessageSquare, 
  Calendar, 
  Edit3, 
  Trash2, 
  Kanban,
  Layout,
  UserPlus,
  CheckCircle,
  Users,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatsCard, TimelineItem } from "@/components/ui/shared";
import { Status, Priority } from "@/types/user";

export default function ProjectDetail() {
    const params = useParams();
    const router = useRouter();
    const projId = Number(params?.id);

    const [activeTab, setActiveTab] = useState<string>("board");
    const [createTaskOpen, setCreateTaskOpen] = useState(false);
    const [editProjOpen, setEditProjOpen] = useState(false);
    const [inviteUserOpen, setInviteUserOpen] = useState(false);

    // MOCK DATA for Project Details
    const mockProject = {
        id: projId,
        name: "Social Content Board",
        description: "Task board managing copywriting and marketing assets for Q3 launch.",
        status: "ACTIVE",
        progress: 65,
        workspaceId: 1,
        membersCount: 3,
        tasksCount: 15,
        recentActivity: [
            { id: 1, user: "Sarah Connor", title: "created task 'Draft Twitter copy'", time: "2 hours ago" },
            { id: 2, user: "Ujjwal", title: "moved task 'Review press release' to REVIEW", time: "5 hours ago" },
            { id: 3, user: "Marcus Wright", title: "commented on task 'Publish blog post'", time: "1 day ago" }
        ],
        tasks: [
            { id: 201, title: "Draft Twitter launch copy", status: Status.TODO, priority: Priority.HIGH, labels: ["Marketing", "Social"], due: "Today", commentCount: 3, assignee: "Sarah Connor" },
            { id: 202, title: "Refine press release brief", status: Status.IN_PROGRESS, priority: Priority.MEDIUM, labels: ["PR"], due: "Tomorrow", commentCount: 1, assignee: "Ujjwal" },
            { id: 203, title: "Publish tech review blog post", status: Status.IN_REVIEW, priority: Priority.URGENT, labels: ["Blog"], due: "Overdue", commentCount: 5, assignee: "Marcus Wright" },
            { id: 204, title: "Link dynamic schema relations", status: Status.DONE, priority: Priority.LOW, labels: ["Database"], due: "June 25", commentCount: 0, assignee: "Developer" }
        ]
    };

    const columns = [
        { id: Status.TODO, title: "To Do", color: "bg-slate-800 text-slate-300 border-slate-700/60" },
        { id: Status.IN_PROGRESS, title: "In Progress", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
        { id: Status.IN_REVIEW, title: "Review", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
        { id: Status.DONE, title: "Done", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" }
    ];

    const getPriorityColor = (p: Priority) => {
        switch(p) {
            case Priority.URGENT: return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
            case Priority.HIGH: return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
            case Priority.MEDIUM: return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
            case Priority.LOW: return "bg-slate-800 text-slate-400 border border-slate-750";
            default: return "bg-slate-850 text-slate-400";
        }
    };

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
            
            {/* Nav back link */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <Link href={`/workspace/${mockProject.workspaceId}`} className="hover:text-slate-300">
                    Workspace
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-slate-400">Projects</span>
            </div>

            {/* Header Title section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-slate-850 pb-6">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
                            {mockProject.name}
                        </h1>
                        <Badge>{mockProject.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 max-w-xl leading-relaxed">{mockProject.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <Button variant="secondary" size="sm" onClick={() => setEditProjOpen(true)}>
                        <Edit3 className="h-3.5 w-3.5 mr-1.5" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                    </Button>
                </div>
            </div>

            {/* Tabs details using official shadcn Tabs */}
            <Tabs defaultValue="board" className="w-full space-y-6" onValueChange={setActiveTab}>
                <TabsList className="bg-slate-950/40 border border-slate-850 p-1.5 rounded-xl text-xs font-semibold w-full sm:w-fit flex select-none">
                    <TabsTrigger value="board" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-slate-400 data-[state=active]:bg-indigo-655 data-[state=active]:text-white cursor-pointer shrink-0">
                        <Kanban className="h-3.5 w-3.5" /> Board View
                    </TabsTrigger>
                    <TabsTrigger value="overview" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-slate-400 data-[state=active]:bg-indigo-655 data-[state=active]:text-white cursor-pointer shrink-0">
                        <Layout className="h-3.5 w-3.5" /> Project Overview
                    </TabsTrigger>
                </TabsList>

                {/* 1. PROJECT OVERVIEW TAB CONTENT */}
                <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-0">
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Stats Widgets */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatsCard title="Completeness" value={`${mockProject.progress}%`} icon={<CheckCircle className="h-4.5 w-4.5 text-indigo-400" />} />
                            <StatsCard title="Assigned Members" value={mockProject.membersCount} icon={<Users className="h-4.5 w-4.5 text-indigo-400" />} />
                            <StatsCard title="Tasks Catalog" value={mockProject.tasksCount} icon={<FolderKanban className="h-4.5 w-4.5 text-indigo-400" />} />
                        </div>

                        {/* Recent Tasks */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recent Tasks</h3>
                            <div className="bg-slate-955/20 border border-slate-850 rounded-2xl p-4.5 space-y-2">
                                {mockProject.tasks.slice(0, 3).map((t) => (
                                    <div key={t.id} className="flex items-center justify-between p-3.5 bg-slate-950/40 hover:bg-slate-955/80 border border-slate-850/60 rounded-xl transition-all">
                                        <div className="space-y-1 min-w-0 flex-1 pr-3">
                                            <p className="font-bold text-xs text-slate-200 truncate">{t.title}</p>
                                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Assignee: {t.assignee}</span>
                                        </div>
                                        <Badge>{t.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Distribution and Completions representation */}
                        <div className="bg-slate-955/20 border border-slate-850 p-6 rounded-2xl space-y-4">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Task Distribution</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-950/50 rounded-xl space-y-2 border border-slate-855">
                                    <span className="text-[9px] text-slate-500 font-bold uppercase">To Do / In Progress</span>
                                    <div className="text-lg font-black text-white">55% Total</div>
                                </div>
                                <div className="p-4 bg-slate-950/50 rounded-xl space-y-2 border border-slate-855">
                                    <span className="text-[9px] text-slate-500 font-bold uppercase">Completion Ratio</span>
                                    <div className="text-lg font-black text-emerald-400">45% Completed</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right pane: timeline & quick actions */}
                    <div className="space-y-6">
                        
                        {/* Quick action buttons */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quick actions</h3>
                            <div className="bg-slate-955/20 border border-slate-850 rounded-2xl p-4.5 space-y-2.5">
                                <Button variant="secondary" size="sm" className="w-full justify-start text-xs font-semibold" onClick={() => setCreateTaskOpen(true)}>
                                    <Plus className="h-4.5 w-4.5 mr-2 text-indigo-400" />
                                    Create Task
                                </Button>
                                <Button variant="secondary" size="sm" className="w-full justify-start text-xs font-semibold" onClick={() => setActiveTab("board")}>
                                    <Kanban className="h-4.5 w-4.5 mr-2 text-indigo-400" />
                                    Board View
                                </Button>
                                <Button variant="secondary" size="sm" className="w-full justify-start text-xs font-semibold" onClick={() => setInviteUserOpen(true)}>
                                    <UserPlus className="h-4.5 w-4.5 mr-2 text-indigo-400" />
                                    Invite User
                                </Button>
                            </div>
                        </div>

                        {/* Recent activity timeline */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Timeline Activity</h3>
                            <div className="bg-slate-955/20 border border-slate-850 rounded-2xl p-5 space-y-4">
                                {mockProject.recentActivity.map((act) => (
                                    <TimelineItem key={act.id} user={act.user} title={act.title} time={act.time} />
                                ))}
                            </div>
                        </div>

                    </div>
                </TabsContent>

                {/* 2. KANBAN BOARD TAB CONTENT */}
                <TabsContent value="board" className="space-y-6 pt-0">
                    {/* Filter bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="relative w-48 sm:w-56">
                                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                                <Input placeholder="Filter tasks..." className="pl-9 h-9" />
                            </div>
                            <button className="p-2 bg-slate-950/40 hover:bg-slate-900 border border-slate-850 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white" title="Filter columns">
                                <FilterIcon className="h-4 w-4" />
                            </button>
                            <button className="p-2 bg-slate-950/40 hover:bg-slate-900 border border-slate-850 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white" title="Sort order">
                                <SlidersHorizontal className="h-4 w-4" />
                            </button>
                        </div>

                        <Button variant="default" size="sm" onClick={() => setCreateTaskOpen(true)}>
                            <Plus className="h-4 w-4 mr-1.5" />
                            Create Task
                        </Button>
                    </div>

                    {/* Columns grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
                        {columns.map((col) => {
                            const columnTasks = mockProject.tasks.filter((t: any) => t.status === col.id);
                            return (
                                <div key={col.id} className="bg-slate-955/20 border border-slate-855 rounded-2xl p-4.5 space-y-4 min-h-[60vh] max-h-[75vh] flex flex-col overflow-hidden">
                                    {/* Column details */}
                                    <div className="flex justify-between items-center shrink-0">
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${col.color}`}>
                                            {col.title}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-955 border border-slate-850 p-1 rounded-md shrink-0">
                                            {columnTasks.length}
                                        </span>
                                    </div>

                                    {/* Tasks wrapper */}
                                    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                                        {columnTasks.length > 0 ? (
                                            columnTasks.map((t: any) => {
                                                const initial = t.assignee[0].toUpperCase();
                                                return (
                                                    <div key={t.id} className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl shadow-sm space-y-3 group transition-all">
                                                        <div className="flex justify-between items-start">
                                                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${getPriorityColor(t.priority)}`}>
                                                                {t.priority}
                                                            </span>
                                                            <Link href={`/task/${t.id}`} className="text-[9px] font-bold text-slate-500 hover:text-indigo-400 bg-slate-950 p-1.5 border border-slate-850 rounded-lg shrink-0">
                                                                Detail
                                                            </Link>
                                                        </div>
                                                        <h3 className="font-bold text-xs text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-1 leading-snug">{t.title}</h3>
                                                        
                                                        {/* Labels */}
                                                        {t.labels.length > 0 && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {t.labels.map((lbl: string, i: number) => (
                                                                    <span key={i} className="text-[8px] font-bold bg-slate-950 border border-slate-850 px-1.5 rounded text-slate-400">
                                                                        {lbl}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="flex justify-between items-center border-t border-slate-950 pt-3 text-[9px] text-slate-500 font-semibold">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                <span>{t.due}</span>
                                                            </div>
                                                            {t.commentCount > 0 && (
                                                                <div className="flex items-center gap-0.5">
                                                                    <MessageSquare className="h-3 w-3" />
                                                                    <span>{t.commentCount}</span>
                                                                </div>
                                                            )}
                                                            {/* User Avatar */}
                                                            <div className="h-5 w-5 rounded bg-indigo-600/35 border border-indigo-500/20 text-white flex items-center justify-center font-bold text-[8px]" title={t.assignee}>
                                                                {initial}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
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
                </TabsContent>
            </Tabs>

            {/* Actions Form Modals using official Dialog */}
            <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
                <DialogContent className="bg-slate-900 border border-slate-800 text-slate-100">
                    <DialogHeader>
                        <DialogTitle>Create Task</DialogTitle>
                        <DialogDescription className="text-slate-450">
                            Initialize and assign a task under this project.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-1">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Task Title</label>
                            <Input placeholder="Flesh out endpoints controller..." required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Priority</label>
                            <select className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none">
                                <option>LOW</option>
                                <option>MEDIUM</option>
                                <option>HIGH</option>
                                <option>URGENT</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-3 pt-2 text-xs">
                            <Button variant="ghost" onClick={() => setCreateTaskOpen(false)}>Cancel</Button>
                            <Button variant="default" onClick={() => setCreateTaskOpen(false)}>Create Task</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={editProjOpen} onOpenChange={setEditProjOpen}>
                <DialogContent className="bg-slate-900 border border-slate-800 text-slate-100">
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription className="text-slate-450">
                            Update basic tracking project board params.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-1">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Project Name</label>
                            <Input placeholder="Rename project board..." defaultValue={mockProject.name} required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                            <Input placeholder="Update description..." defaultValue={mockProject.description} />
                        </div>
                        <div className="flex justify-end gap-3 pt-2 text-xs">
                            <Button variant="ghost" onClick={() => setEditProjOpen(false)}>Cancel</Button>
                            <Button variant="default" onClick={() => setEditProjOpen(false)}>Save</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={inviteUserOpen} onOpenChange={setInviteUserOpen}>
                <DialogContent className="bg-slate-900 border border-slate-800 text-slate-100">
                    <DialogHeader>
                        <DialogTitle>Invite Member to Project</DialogTitle>
                        <DialogDescription className="text-slate-455">
                            Invite another teammate to review tasks inside this board.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-1">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Teammate Email</label>
                            <Input type="email" placeholder="name@company.com" required />
                        </div>
                        <div className="flex justify-end gap-3 pt-2 text-xs">
                            <Button variant="ghost" onClick={() => setInviteUserOpen(false)}>Cancel</Button>
                            <Button variant="default" onClick={() => setInviteUserOpen(false)}>Invite User</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}

'use client'

import useWorkspace from "@/hooks/useWorkspace";
import CurrentUser from "@/hooks/currentUser";
import { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  FolderKanban, 
  CheckSquare, 
  CheckCircle2, 
  Activity, 
  Plus, 
  Calendar,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Inbox
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatsCard, TimelineItem } from "@/components/ui/shared";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
    const { data: workspaces, isLoading, error } = useWorkspace();
    const { data: user } = CurrentUser();
    
    // Quick Action Form Modal states
    const [createWorkOpen, setCreateWorkOpen] = useState(false);
    const [createProjOpen, setCreateProjOpen] = useState(false);
    const [createTaskOpen, setCreateTaskOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center bg-slate-900">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                    <p className="text-slate-400 text-xs font-semibold">Gathering dashboard analytics...</p>
                </div>
            </div>
        );
    }

    const list = workspaces?.data || [];

    // Simulated task datasets
    const upcomingTasks = {
        today: [
            { id: 1, title: "Resolve schema relations migration", project: "Database Core" },
            { id: 2, title: "Flesh out linear-styled task specs", project: "Client Web" }
        ],
        tomorrow: [
            { id: 3, title: "Draft fake pricing tiers", project: "Billing Module" }
        ],
        overdue: [
            { id: 4, title: "Define route parameters validation", project: "Gateway Server" }
        ]
    };

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans text-slate-100">
            
            {/* Greeting Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Welcome Back, {user?.name || 'Developer'}!
                </h1>
                <p className="text-xs text-slate-400 mt-1">Here is the general state overview of your workflows.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard 
                    title="Total Workspaces" 
                    value={list.length} 
                    icon={<Briefcase className="h-4.5 w-4.5 text-indigo-400" />} 
                />
                <StatsCard 
                    title="Projects" 
                    value="12 Active" 
                    icon={<FolderKanban className="h-4.5 w-4.5 text-indigo-400" />} 
                />
                <StatsCard 
                    title="Tasks" 
                    value="34 Assigned" 
                    icon={<CheckSquare className="h-4.5 w-4.5 text-indigo-400" />} 
                />
                <StatsCard 
                    title="Completed" 
                    value="84.5%" 
                    icon={<CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />} 
                />
            </div>

            {/* Grid splits */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Columns (Col Span 2) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Recent Workspaces */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Recent Workspaces</h2>
                            <Link href="/workspace" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider flex items-center gap-1">
                                View All Workspaces <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {list.length > 0 ? (
                                list.slice(0, 3).map((item: any) => {
                                    const w = item.workspaces;
                                    if (!w) return null;
                                    return (
                                        <Card key={w.id} hoverable className="flex flex-col justify-between h-32 p-4">
                                            <div className="space-y-2">
                                                <div className="h-7 w-7 rounded bg-slate-900 border border-slate-800 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase">
                                                    {w.name[0]}
                                                </div>
                                                <h3 className="font-bold text-xs text-slate-200 truncate">{w.name}</h3>
                                            </div>
                                            <Link href={`/workspace/${w.id}`} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 block pt-2 border-t border-slate-900">
                                                Open Workspace →
                                            </Link>
                                        </Card>
                                    );
                                })
                            ) : (
                                <div className="col-span-3 py-8 text-center bg-slate-950/10 border border-dashed border-slate-850 rounded-2xl text-xs text-slate-500 italic">
                                    No workspaces created yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Tasks */}
                    <div className="space-y-3">
                        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Upcoming Tasks</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Due Today */}
                            <div className="bg-slate-955/40 border border-slate-850 rounded-2xl p-4.5 space-y-3">
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                    Due Today
                                </span>
                                <div className="space-y-2.5">
                                    {upcomingTasks.today.map((t) => (
                                        <div key={t.id} className="text-xs p-2.5 bg-slate-950/60 border border-slate-850/60 rounded-xl space-y-1">
                                            <p className="font-semibold text-slate-300 leading-snug">{t.title}</p>
                                            <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">📁 {t.project}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Due Tomorrow */}
                            <div className="bg-slate-955/40 border border-slate-850 rounded-2xl p-4.5 space-y-3">
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-800 text-slate-400 border border-slate-700/60">
                                    Due Tomorrow
                                </span>
                                <div className="space-y-2.5">
                                    {upcomingTasks.tomorrow.map((t) => (
                                        <div key={t.id} className="text-xs p-2.5 bg-slate-950/60 border border-slate-850/60 rounded-xl space-y-1">
                                            <p className="font-semibold text-slate-300 leading-snug">{t.title}</p>
                                            <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">📁 {t.project}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Overdue */}
                            <div className="bg-slate-955/40 border border-slate-850 rounded-2xl p-4.5 space-y-3">
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                    Overdue
                                </span>
                                <div className="space-y-2.5">
                                    {upcomingTasks.overdue.map((t) => (
                                        <div key={t.id} className="text-xs p-2.5 bg-slate-950/60 border border-slate-850/60 rounded-xl space-y-1">
                                            <p className="font-semibold text-slate-300 leading-snug">{t.title}</p>
                                            <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">📁 {t.project}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Columns (Col Span 1) */}
                <div className="space-y-6">
                    
                    {/* Quick Actions Panel */}
                    <div className="space-y-3">
                        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Quick Actions</h2>
                        <div className="bg-slate-955/40 border border-slate-850 rounded-2xl p-4 space-y-2">
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                className="w-full justify-start text-xs font-semibold"
                                onClick={() => setCreateWorkOpen(true)}
                            >
                                <Plus className="h-4.5 w-4.5 mr-2" />
                                Create Workspace
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                className="w-full justify-start text-xs font-semibold"
                                onClick={() => setCreateProjOpen(true)}
                            >
                                <Plus className="h-4.5 w-4.5 mr-2" />
                                Create Project
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                className="w-full justify-start text-xs font-semibold"
                                onClick={() => setCreateTaskOpen(true)}
                            >
                                <Plus className="h-4.5 w-4.5 mr-2" />
                                Create Task
                            </Button>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-3">
                        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Recent Activity</h2>
                        <div className="bg-slate-955/40 border border-slate-850 rounded-2xl p-5 space-y-4">
                            <TimelineItem user="Ujjwal" title="created project 'Client Web'" time="5 mins ago" />
                            <TimelineItem user="Sarah Connor" title="assigned task 'Draft pricing tiers' to John" time="30 mins ago" />
                            <TimelineItem user="Marcus Wright" title="added comment on task 'Verify constraints'" time="1 hour ago" />
                            <TimelineItem user="Developer" title="created workspace 'Apollo Space'" time="3 hours ago" />
                        </div>
                    </div>

                </div>

            </div>

            {/* Visual Action Modals (Quick Actions) */}
            <Dialog 
                isOpen={createWorkOpen} 
                onClose={() => setCreateWorkOpen(false)}
                title="Create Workspace"
                description="Initialize a new isolated collaboration space."
            >
                <div className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Workspace Name</label>
                        <Input placeholder="Marketing Space, Apollo Space" required />
                    </div>
                    <div className="flex justify-end gap-3 pt-2 text-xs">
                        <Button variant="ghost" onClick={() => setCreateWorkOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={() => setCreateWorkOpen(false)}>Create Workspace</Button>
                    </div>
                </div>
            </Dialog>

            <Dialog 
                isOpen={createProjOpen} 
                onClose={() => setCreateProjOpen(false)}
                title="Create Project"
                description="Add a task board to partition tasks."
            >
                <div className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Project Name</label>
                        <Input placeholder="API integration, Frontend design" required />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                        <Input placeholder="Detail project parameters..." />
                    </div>
                    <div className="flex justify-end gap-3 pt-2 text-xs">
                        <Button variant="ghost" onClick={() => setCreateProjOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={() => setCreateProjOpen(false)}>Create Project</Button>
                    </div>
                </div>
            </Dialog>

            <Dialog 
                isOpen={createTaskOpen} 
                onClose={() => setCreateTaskOpen(false)}
                title="Create Task"
                description="Assign steps to project boards."
            >
                <div className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Task Title</label>
                        <Input placeholder="Verify endpoints integration" required />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                        <Input placeholder="Detail step specifications..." />
                    </div>
                    <div className="flex justify-end gap-3 pt-2 text-xs">
                        <Button variant="ghost" onClick={() => setCreateTaskOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={() => setCreateTaskOpen(false)}>Create Task</Button>
                    </div>
                </div>
            </Dialog>

        </div>
    );
}

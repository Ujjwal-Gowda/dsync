'use client'

import type { Role, Workspace } from "@/types/user";
import useWorkspace from "@/hooks/useWorkspace";
import CurrentUser from "@/hooks/currentUser";
import { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Users, 
  Clock, 
  Plus, 
  FolderKanban, 
  Activity, 
  ShieldAlert,
  ArrowRight,
  TrendingUp
} from "lucide-react";

export interface WorkSpaceItem {
    role: Role,
    workspaces: Workspace
}

export default function Dashboard() {
    const { data: workspaces, isLoading, error } = useWorkspace();
    const { data: user } = CurrentUser();
    const [showCreateModal, setShowCreateModal] = useState(false);

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                    <p className="text-slate-400 text-xs font-medium">Fetching dashboard info...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-2xl mx-auto mt-10">
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-6 rounded-2xl flex flex-col items-center text-center gap-4">
                    <ShieldAlert className="h-10 w-10 text-rose-400" />
                    <div>
                        <h3 className="font-bold text-lg text-white">Failed to Load Dashboard</h3>
                        <p className="text-sm mt-1 text-rose-300/80">{error.message}</p>
                    </div>
                </div>
            </div>
        );
    }

    const list: WorkSpaceItem[] = workspaces?.data || [];

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans text-slate-100">
            
            {/* Top welcome banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900/40 via-indigo-950/20 to-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider">WORKSPACE METRICS</span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Welcome, {user?.name || 'Developer'}!
                    </h1>
                    <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                        Here is a summary of your workspace activities and project developments. Start collaborating by choosing a space or creating a new one.
                    </p>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950/40 border border-slate-800/60 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Total Workspaces</span>
                        <div className="text-2xl font-extrabold text-white">{list.length}</div>
                    </div>
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                        <Briefcase className="h-5 w-5" />
                    </div>
                </div>

                <div className="bg-slate-950/40 border border-slate-800/60 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Owner Roles</span>
                        <div className="text-2xl font-extrabold text-white">
                            {list.filter(w => w.role === 'OWNER').length}
                        </div>
                    </div>
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                        <Users className="h-5 w-5" />
                    </div>
                </div>

                <div className="bg-slate-950/40 border border-slate-800/60 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Total Memberships</span>
                        <div className="text-2xl font-extrabold text-white">{list.length}</div>
                    </div>
                    <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                </div>

                <div className="bg-slate-950/40 border border-slate-800/60 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">System Status</span>
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                            All Services Online
                        </div>
                    </div>
                    <div className="p-3 bg-slate-800/40 text-slate-400 rounded-xl">
                        <Clock className="h-5 w-5" />
                    </div>
                </div>
            </div>

            {/* Workspaces & Activity Layout split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left: Workspaces List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <FolderKanban className="h-5 w-5 text-indigo-400" />
                            Workspaces List
                        </h2>
                        <Link 
                            href="/workspace" 
                            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                        >
                            View All
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {list.length > 0 ? (
                            list.map((work: WorkSpaceItem) => {
                                const w = work.workspaces;
                                if (!w) return null;
                                return (
                                    <Link 
                                        key={w.id} 
                                        href={`/workspace/${w.id}`}
                                        className="group block p-5 bg-slate-950/20 hover:bg-slate-950/40 border border-slate-800/60 hover:border-slate-700/80 rounded-2xl shadow-sm transition-all hover:scale-[1.01]"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-3">
                                                <div className="h-9 w-9 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-sm text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                                    {w.name ? w.name[0].toUpperCase() : 'W'}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">
                                                        {w.name}
                                                    </h3>
                                                    <span className="text-[10px] text-slate-500 font-semibold tracking-wider">
                                                        ID: {w.id}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                                                work.role === 'OWNER' 
                                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                                                : work.role === 'ADMIN'
                                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                                            }`}>
                                                {work.role}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="col-span-2 py-10 text-center bg-slate-950/20 border border-dashed border-slate-800 rounded-2xl">
                                <p className="text-slate-500 text-sm">No workspaces found.</p>
                                <button 
                                    onClick={() => setShowCreateModal(true)}
                                    className="mt-4 text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1.5"
                                >
                                    <Plus className="h-4 w-4" /> Create a workspace
                                </button>
                            </div>
                        )}
                        
                        {/* Quick create action card */}
                        <button 
                            onClick={() => setShowCreateModal(true)}
                            className="p-5 border border-dashed border-slate-800 hover:border-indigo-500/40 rounded-2xl flex flex-col items-center justify-center text-center gap-2 group transition-all cursor-pointer bg-transparent"
                        >
                            <div className="p-2 bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white rounded-xl transition-all">
                                <Plus className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-300">Create New Workspace</span>
                            <span className="text-[10px] text-slate-500">Add an isolated space to manage team projects</span>
                        </button>
                    </div>
                </div>

                {/* Right: Recent activity logs */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity className="h-5 w-5 text-indigo-400" />
                        Recent Activities
                    </h2>
                    
                    <div className="bg-slate-950/20 border border-slate-800/60 rounded-2xl p-5 space-y-4">
                        <div className="space-y-3.5">
                            {/* Mock log 1 */}
                            <div className="flex gap-3 text-xs leading-relaxed">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                                <div>
                                    <p className="text-slate-300 font-semibold">User details retrieved</p>
                                    <span className="text-[9px] text-slate-500">Just now</span>
                                </div>
                            </div>
                            {/* Mock log 2 */}
                            <div className="flex gap-3 text-xs leading-relaxed">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                                <div>
                                    <p className="text-slate-300">Workspace data synced with server</p>
                                    <span className="text-[9px] text-slate-500">10 mins ago</span>
                                </div>
                            </div>
                            {/* Mock log 3 */}
                            <div className="flex gap-3 text-xs leading-relaxed">
                                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-1.5 shrink-0" />
                                <div>
                                    <p className="text-slate-300">Connected to websocket server</p>
                                    <span className="text-[9px] text-slate-500">1 hour ago</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-[10px] border-t border-slate-800/80 pt-3 text-slate-500 italic text-center">
                            Activity logs are simulated based on backend events
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Workspace Visual Modal (Pure UI / Toggle State) */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
                        <div className="space-y-1.5">
                            <h3 className="text-lg font-bold text-white">Create Workspace</h3>
                            <p className="text-slate-400 text-xs">Configure a name for your new organization hub</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider block">Workspace Name</label>
                            <input 
                                type="text" 
                                placeholder="Marketing Team, Dev Ops, etc."
                                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2 text-xs">
                            <button 
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                            >
                                Create Workspace
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

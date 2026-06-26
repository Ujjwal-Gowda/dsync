'use client'

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useWorkspace from "@/hooks/useWorkspace";
import { 
  getWorkspacesMembers, 
  createWorkspaces, 
  addWorkspacesMember, 
  deleteWorkspacesMember,
  deleteWorkspace,
  updateWorkspace
} from "@/services/workspace.service";
import Link from "next/link";
import { 
  Briefcase, 
  Users, 
  Plus, 
  FolderKanban, 
  Settings as SettingsIcon, 
  BarChart3, 
  Mail, 
  Shield, 
  Trash2, 
  ChevronRight, 
  ExternalLink,
  Edit2,
  Calendar,
  Grid
} from "lucide-react";

export default function WorkspaceDetail() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    
    // Note: workspace/[[...id]] returns an array of path segments or undefined.
    const idArray = params?.id;
    const workId = Array.isArray(idArray) ? idArray[0] : idArray;

    // Local UI states
    const [activeTab, setActiveTab] = useState<"projects" | "members" | "analytics" | "settings">("projects");
    const [showCreateProjModal, setShowCreateProjModal] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showCreateWorkModal, setShowCreateWorkModal] = useState(false);
    const [newProjName, setNewProjName] = useState("");
    const [newProjDesc, setNewProjDesc] = useState("");
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [newMemberRole, setNewMemberRole] = useState("MEMBER");
    const [newWorkName, setNewWorkName] = useState("");

    // Queries
    // 1. Fetch all user workspaces (when in list mode)
    const { data: workspaces, isLoading: isLoadingList } = useWorkspace();
    
    // 2. Fetch specific workspace details (members + projects)
    const { data: workspaceDetail, isLoading: isLoadingDetail, error: detailError } = useQuery({
        queryKey: ['workspace-detail', workId],
        queryFn: () => getWorkspacesMembers(Number(workId)),
        enabled: !!workId,
    });

    // Modal action placeholders (UI only, trigger-ready)
    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault();
        // The user will attach functional mutations later, close modal for now
        setShowCreateProjModal(false);
        setNewProjName("");
        setNewProjDesc("");
    };

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        setShowAddMemberModal(false);
        setNewMemberEmail("");
    };

    const handleCreateWorkspace = (e: React.FormEvent) => {
        e.preventDefault();
        setShowCreateWorkModal(false);
        setNewWorkName("");
    };

    // Mode A: WORKSPACE DIRECTORY (No Specific ID)
    if (!workId) {
        const workspaceList = workspaces?.data || [];
        return (
            <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                            <Briefcase className="h-6 w-6 text-indigo-400" />
                            Workspaces Directory
                        </h1>
                        <p className="text-slate-400 text-xs mt-1">Select a workspace to manage projects, tasks, and team members.</p>
                    </div>
                    <button 
                        onClick={() => setShowCreateWorkModal(true)}
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98]"
                    >
                        <Plus className="h-4 w-4" />
                        New Workspace
                    </button>
                </div>

                {isLoadingList ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-32 bg-slate-950/20 border border-slate-800/40 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : workspaceList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {workspaceList.map((item: any) => {
                            const w = item.workspaces;
                            return (
                                <Link 
                                    key={w.id}
                                    href={`/workspace/${w.id}`}
                                    className="p-6 bg-slate-950/20 border border-slate-850 hover:border-indigo-500/40 rounded-2xl shadow-sm hover:scale-[1.01] transition-all flex flex-col justify-between h-40 group"
                                >
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                {item.role}
                                            </span>
                                            <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                                        </div>
                                        <h3 className="font-extrabold text-sm text-white truncate group-hover:text-indigo-400 transition-colors">
                                            {w.name}
                                        </h3>
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-semibold border-t border-slate-900 pt-3 flex justify-between items-center">
                                        <span>Workspace ID: {w.id}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-950/10 border border-dashed border-slate-800 rounded-2xl">
                        <Briefcase className="h-10 w-10 text-slate-600 mx-auto mb-4" />
                        <h3 className="font-bold text-slate-300">No Workspaces Found</h3>
                        <p className="text-slate-500 text-xs mt-1">Get started by creating your first collaboration workspace.</p>
                        <button 
                            onClick={() => setShowCreateWorkModal(true)}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition-all cursor-pointer"
                        >
                            Create Workspace
                        </button>
                    </div>
                )}

                {/* Create Workspace Modal */}
                {showCreateWorkModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                        <form onSubmit={handleCreateWorkspace} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
                            <div className="space-y-1.5">
                                <h3 className="text-lg font-bold text-white">Create Workspace</h3>
                                <p className="text-slate-400 text-xs font-medium">Add an organizational namespace for tasks and boards.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Workspace Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newWorkName}
                                    onChange={(e) => setNewWorkName(e.target.value)}
                                    placeholder="Engineering Dept, Project Apollo, etc."
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2 text-xs">
                                <button type="button" onClick={() => setShowCreateWorkModal(false)} className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl cursor-pointer">
                                    Create Workspace
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        );
    }

    // Mode B: SINGLE WORKSPACE DASHBOARD
    if (isLoadingDetail) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                    <p className="text-slate-400 text-xs font-medium">Loading workspace layout...</p>
                </div>
            </div>
        );
    }

    if (detailError || !workspaceDetail?.data) {
        return (
            <div className="p-8 max-w-2xl mx-auto mt-10">
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-6 rounded-2xl flex flex-col items-center text-center gap-4">
                    <Shield className="h-10 w-10 text-rose-400" />
                    <div>
                        <h3 className="font-bold text-lg text-white">Workspace Not Accessible</h3>
                        <p className="text-sm mt-1 text-rose-300/80">
                            You may not have permissions to view this workspace or it has been deleted.
                        </p>
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

    const workspace = workspaceDetail.data;
    const projectsList = workspace.projects || [];
    const membersList = workspace.members || [];

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
            
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 bg-slate-850 border border-slate-800 text-indigo-400 flex items-center justify-center font-bold text-base rounded-xl">
                            {workspace.name ? workspace.name[0].toUpperCase() : 'W'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-white tracking-tight leading-none">{workspace.name}</h1>
                            <span className="text-[10px] text-slate-500 font-medium">Workspace Dashboard</span>
                        </div>
                    </div>
                </div>

                {/* Tab selector buttons */}
                <div className="flex bg-slate-950/40 p-1.5 rounded-xl border border-slate-850 shrink-0 text-xs font-semibold">
                    <button 
                        onClick={() => setActiveTab("projects")} 
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <FolderKanban className="h-3.5 w-3.5" />
                        Projects
                    </button>
                    <button 
                        onClick={() => setActiveTab("members")} 
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'members' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Users className="h-3.5 w-3.5" />
                        Members
                    </button>
                    <button 
                        onClick={() => setActiveTab("analytics")} 
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <BarChart3 className="h-3.5 w-3.5" />
                        Analytics
                    </button>
                    <button 
                        onClick={() => setActiveTab("settings")} 
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <SettingsIcon className="h-3.5 w-3.5" />
                        Settings
                    </button>
                </div>
            </div>

            {/* TAB CONTENTS */}
            
            {/* 1. PROJECTS TAB */}
            {activeTab === "projects" && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <FolderKanban className="h-5 w-5 text-indigo-400" />
                            Workspace Projects ({projectsList.length})
                        </h2>
                        <button 
                            onClick={() => setShowCreateProjModal(true)}
                            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl cursor-pointer"
                        >
                            <Plus className="h-3.5 w-3.5" /> Create Project
                        </button>
                    </div>

                    {projectsList.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {projectsList.map((p: any) => (
                                <Link 
                                    key={p.id}
                                    href={`/project/${p.id}`}
                                    className="p-5 bg-slate-950/20 hover:bg-slate-950/40 border border-slate-850 hover:border-slate-700/80 rounded-2xl shadow-sm flex flex-col justify-between h-44 group transition-all"
                                >
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                p.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                            }`}>
                                                {p.status || 'ACTIVE'}
                                            </span>
                                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                        </div>
                                        <h3 className="font-extrabold text-sm text-white group-hover:text-indigo-400 transition-colors truncate">
                                            {p.name}
                                        </h3>
                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                            {p.description || "No description provided."}
                                        </p>
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-semibold border-t border-slate-900 pt-3">
                                        Created: {new Date(p.createdAt).toLocaleDateString()}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-slate-950/10 border border-dashed border-slate-800 rounded-2xl">
                            <FolderKanban className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-500 text-sm">No projects created yet.</p>
                            <button 
                                onClick={() => setShowCreateProjModal(true)}
                                className="mt-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1.5"
                            >
                                <Plus className="h-4 w-4" /> Create first project
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* 2. MEMBERS TAB */}
            {activeTab === "members" && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Users className="h-5 w-5 text-indigo-400" />
                            Workspace Members ({membersList.length})
                        </h2>
                        <button 
                            onClick={() => setShowAddMemberModal(true)}
                            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl cursor-pointer"
                        >
                            <Plus className="h-3.5 w-3.5" /> Invite Member
                        </button>
                    </div>

                    <div className="bg-slate-950/20 border border-slate-850 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-850 bg-slate-950/40 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {membersList.map((m: any) => (
                                    <tr key={m.userId} className="border-b border-slate-900/60 hover:bg-slate-950/10 transition-colors">
                                        <td className="p-4 font-semibold text-slate-200">{m.user?.name || "N/A"}</td>
                                        <td className="p-4 text-slate-400">{m.user?.email || "N/A"}</td>
                                        <td className="p-4">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                m.role === 'OWNER' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : m.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'
                                            }`}>
                                                {m.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                title="Remove Member"
                                                className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 3. ANALYTICS TAB */}
            {activeTab === "analytics" && (
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-indigo-400" />
                        Workspace Metrics Overview
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-950/20 border border-slate-850 p-6 rounded-2xl space-y-4">
                            <h3 className="text-sm font-bold text-slate-300">Task Status Breakdown (Mock)</h3>
                            <div className="space-y-3 pt-2">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-slate-400">Completed Tasks</span>
                                        <span className="text-emerald-400">45%</span>
                                    </div>
                                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full w-[45%]" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-slate-400">In Progress</span>
                                        <span className="text-indigo-400">30%</span>
                                    </div>
                                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full w-[30%]" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-slate-400">To Do</span>
                                        <span className="text-slate-500">25%</span>
                                    </div>
                                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                                        <div className="bg-slate-800 h-full w-[25%]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-950/20 border border-slate-850 p-6 rounded-2xl flex flex-col justify-between h-52">
                            <div>
                                <h3 className="text-sm font-bold text-slate-300 mb-1">Key Performance Ratios</h3>
                                <p className="text-slate-500 text-xs">Simulated based on active task assignments</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
                                    <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Velocity</span>
                                    <div className="text-lg font-black text-white">8.4 / wk</div>
                                </div>
                                <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
                                    <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Quality Index</span>
                                    <div className="text-lg font-black text-emerald-400">96.8%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. SETTINGS TAB */}
            {activeTab === "settings" && (
                <div className="space-y-6 max-w-2xl">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <SettingsIcon className="h-5 w-5 text-indigo-400" />
                        Workspace Parameters
                    </h2>

                    <div className="bg-slate-950/20 border border-slate-850 rounded-2xl p-6 space-y-6">
                        {/* Edit Name */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Workspace Brand Name</h3>
                            <div className="flex gap-3">
                                <input 
                                    type="text" 
                                    defaultValue={workspace.name}
                                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 text-xs outline-none transition-all"
                                />
                                <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 rounded-xl cursor-pointer">
                                    <Edit2 className="h-3.5 w-3.5" /> Save
                                </button>
                            </div>
                        </div>

                        {/* Danger zone */}
                        <div className="border-t border-slate-900 pt-5 space-y-3">
                            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Danger Zone</h3>
                            <p className="text-slate-500 text-xs">
                                Deleting this workspace is irreversible. All child projects and tasks will be soft-deleted.
                            </p>
                            <button className="flex items-center gap-1.5 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer">
                                <Trash2 className="h-4 w-4" /> Delete Workspace
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Project Modal */}
            {showCreateProjModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <form onSubmit={handleCreateProject} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
                        <div className="space-y-1.5">
                            <h3 className="text-lg font-bold text-white">Create New Project</h3>
                            <p className="text-slate-400 text-xs font-medium">Add a task tracking workspace child.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Project Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newProjName}
                                    onChange={(e) => setNewProjName(e.target.value)}
                                    placeholder="Marketing Q3 Board, Engineering Sprint"
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Description</label>
                                <textarea 
                                    required
                                    value={newProjDesc}
                                    onChange={(e) => setNewProjDesc(e.target.value)}
                                    placeholder="Provide context about what this project boards track..."
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 outline-none h-20 resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2 text-xs">
                            <button type="button" onClick={() => setShowCreateProjModal(false)} className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl cursor-pointer">
                                Create Project
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Invite Member Modal */}
            {showAddMemberModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <form onSubmit={handleAddMember} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
                        <div className="space-y-1.5">
                            <h3 className="text-lg font-bold text-white">Invite Member</h3>
                            <p className="text-slate-400 text-xs font-medium">Add an existing user to collaborate in this workspace.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Member User ID</label>
                                <input 
                                    type="number" 
                                    required
                                    value={newMemberEmail}
                                    onChange={(e) => setNewMemberEmail(e.target.value)}
                                    placeholder="Enter numeric user ID"
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 text-xs text-slate-200 placeholder-slate-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Access Role</label>
                                <select 
                                    value={newMemberRole}
                                    onChange={(e) => setNewMemberRole(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 text-xs text-slate-200 outline-none"
                                >
                                    <option value="MEMBER">MEMBER</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="OWNER">OWNER</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2 text-xs">
                            <button type="button" onClick={() => setShowAddMemberModal(false)} className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl cursor-pointer">
                                Invite User
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>
    );
}

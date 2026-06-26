'use client'

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search as SearchIcon, 
  Briefcase, 
  Users, 
  FolderKanban, 
  Edit3, 
  Trash2, 
  MoreVertical, 
  ExternalLink,
  Mail,
  UserCheck,
  UserX,
  Activity,
  Layers,
  Settings as SettingsIcon,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Dropdown } from "@/components/ui/dropdown";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatsCard, TimelineItem, AvatarGroup } from "@/components/ui/shared";

export default function WorkspaceDetail() {
    const params = useParams();
    const router = useRouter();
    
    // workspace/[[...id]] returns segment arrays
    const idArray = params?.id;
    const workId = Array.isArray(idArray) ? idArray[0] : idArray;

    // UI Tab toggle state
    const [activeTab, setActiveTab] = useState<"overview" | "projects" | "members" | "activity" | "settings">("overview");

    // Modal Visual states
    const [createWorkOpen, setCreateWorkOpen] = useState(false);
    const [createProjOpen, setCreateProjOpen] = useState(false);
    const [inviteMemberOpen, setInviteMemberOpen] = useState(false);
    const [editWorkOpen, setEditWorkOpen] = useState(false);

    // MOCK DATA for Workspaces Directory list
    const mockWorkspaces = [
        { id: 1, name: "Marketing Launch Space", owner: "Sarah Connor", membersCount: 5, projectsCount: 3, progress: 75 },
        { id: 2, name: "API Gateways DevOps", owner: "Marcus Wright", membersCount: 3, projectsCount: 4, progress: 40 },
        { id: 3, name: "Design Branding Assets", owner: "Ujjwal", membersCount: 8, projectsCount: 2, progress: 90 },
    ];

    // MOCK DATA for Selected Workspace Details
    const mockWorkspaceDetails = {
        name: "Marketing Launch Space",
        description: "Coordination directory tracking Q3 product rollout campaigns.",
        owner: "Sarah Connor",
        members: [
            { id: 1, name: "Sarah Connor", email: "sarah@dsync.io", role: "OWNER" },
            { id: 2, name: "Marcus Wright", email: "marcus@dsync.io", role: "ADMIN" },
            { id: 3, name: "Ujjwal", email: "ujjwal@dsync.io", role: "MEMBER" },
        ],
        projects: [
            { id: 10, name: "Social Content Board", status: "ACTIVE", progress: 65, tasksCount: 12 },
            { id: 11, name: "Email Copywriter Sprint", status: "PLANNING", progress: 20, tasksCount: 8 },
            { id: 12, name: "PR Press Rollout Catalog", status: "COMPLETED", progress: 100, tasksCount: 15 },
        ],
        activities: [
            { id: 1, user: "Ujjwal", title: "created project 'Social Content Board'", time: "2 hours ago" },
            { id: 2, user: "John", title: "commented on task 'Draft Twitter copy'", time: "4 hours ago" },
            { id: 3, user: "Sarah Connor", title: "moved task 'PR review' to Done", time: "1 day ago" },
            { id: 4, user: "Alex", title: "joined the workspace", time: "3 days ago" },
        ]
    };

    // Mode A: WORKSPACES Grid LIST
    if (!workId) {
        return (
            <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-850 pb-5">
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-indigo-400" />
                            Workspaces Directory
                        </h1>
                        <p className="text-xs text-slate-500">View and manage team organizations.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative w-48 sm:w-60">
                            <SearchIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                            <Input placeholder="Search workspaces..." className="pl-9 h-9" />
                        </div>
                        <Button 
                            variant="primary" 
                            size="sm" 
                            className="h-9 font-bold"
                            onClick={() => setCreateWorkOpen(true)}
                        >
                            <Plus className="h-4 w-4 mr-1.5" />
                            Create Workspace
                        </Button>
                    </div>
                </div>

                {/* Workspace cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {mockWorkspaces.map((w) => (
                        <Card key={w.id} className="h-48 flex flex-col justify-between p-5 relative">
                            {/* Card Header & Drodown */}
                            <div className="flex justify-between items-start">
                                <div className="space-y-1.5 min-w-0">
                                    <div className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase">
                                        {w.name[0]}
                                    </div>
                                    <h3 className="font-bold text-sm text-slate-200 truncate pr-4">{w.name}</h3>
                                </div>
                                <Dropdown 
                                    trigger={
                                        <button className="p-1 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors">
                                            <MoreVertical className="h-4.5 w-4.5" />
                                        </button>
                                    }
                                    items={[
                                        { label: "Edit Workspace", onClick: () => setEditWorkOpen(true) },
                                        { label: "Delete Workspace", onClick: () => {}, variant: "danger" }
                                    ]}
                                />
                            </div>

                            {/* Info layout */}
                            <div className="space-y-3 pt-3 border-t border-slate-950">
                                <div className="flex justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                                    <span>Owner: {w.owner}</span>
                                    <span>{w.membersCount} Members • {w.projectsCount} Projects</span>
                                </div>

                                {/* Progress bar */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
                                        <span>Progress</span>
                                        <span>{w.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${w.progress}%` }} />
                                    </div>
                                </div>
                            </div>

                            {/* Open button overlay click */}
                            <Link href={`/workspace/${w.id}`} className="absolute inset-x-0 bottom-0 py-2.5 bg-slate-950 hover:bg-slate-950/80 text-center text-[10px] font-bold text-indigo-400 hover:text-indigo-300 rounded-b-2xl transition-colors border-t border-slate-850/40">
                                Open Workspace
                            </Link>
                        </Card>
                    ))}
                </div>

                {/* Create Modal Form */}
                <Dialog 
                    isOpen={createWorkOpen} 
                    onClose={() => setCreateWorkOpen(false)}
                    title="Create Workspace"
                    description="Set up an organizational space for your projects."
                >
                    <div className="space-y-4 pt-1">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Workspace Name</label>
                            <Input placeholder="Engineering Workspace, Marketing space" required />
                        </div>
                        <div className="flex justify-end gap-3 pt-2 text-xs">
                            <Button variant="ghost" onClick={() => setCreateWorkOpen(false)}>Cancel</Button>
                            <Button variant="primary" onClick={() => setCreateWorkOpen(false)}>Create Workspace</Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }

    // Mode B: WORKSPACE DETAIL (Team Hub)
    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
            
            {/* Header info */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-850 pb-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 bg-slate-900 border border-slate-800 text-indigo-400 flex items-center justify-center font-bold text-sm rounded-xl">
                            {mockWorkspaceDetails.name[0]}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight leading-none">
                                {mockWorkspaceDetails.name}
                            </h1>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-1.5">Owner: {mockWorkspaceDetails.owner}</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 max-w-xl leading-relaxed">{mockWorkspaceDetails.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <Button variant="secondary" size="sm" onClick={() => setInviteMemberOpen(true)}>
                        Invite Member
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setEditWorkOpen(true)}>
                        <Edit3 className="h-4 w-4 mr-1.5" /> Edit
                    </Button>
                    <Button variant="danger" size="sm">
                        <Trash2 className="h-4 w-4 mr-1.5" /> Delete
                    </Button>
                </div>
            </div>

            {/* Tabs Selector */}
            <div className="flex bg-slate-950/40 p-1.5 rounded-xl border border-slate-850 shrink-0 text-xs font-semibold w-full overflow-x-auto">
                {(["overview", "projects", "members", "activity", "settings"] as const).map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)} 
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all capitalize cursor-pointer shrink-0 ${activeTab === tab ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        {tab === 'overview' && <Briefcase className="h-3.5 w-3.5" />}
                        {tab === 'projects' && <FolderKanban className="h-3.5 w-3.5" />}
                        {tab === 'members' && <Users className="h-3.5 w-3.5" />}
                        {tab === 'activity' && <Activity className="h-3.5 w-3.5" />}
                        {tab === 'settings' && <SettingsIcon className="h-3.5 w-3.5" />}
                        {tab}
                    </button>
                ))}
            </div>

            {/* TAB PANELS */}
            
            {/* 1. Overview Tab */}
            {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats card sub-grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <StatsCard title="Total Projects" value={mockWorkspaceDetails.projects.length} icon={<FolderKanban className="h-4.5 w-4.5" />} />
                            <StatsCard title="Active Members" value={mockWorkspaceDetails.members.length} icon={<Users className="h-4.5 w-4.5" />} />
                        </div>

                        {/* Recent Projects sublist */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recent Projects</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {mockWorkspaceDetails.projects.slice(0, 2).map((p) => (
                                    <Card key={p.id} className="p-4 flex flex-col justify-between h-28 hover:border-slate-800 transition-colors">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-xs text-slate-200 truncate">{p.name}</h4>
                                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">{p.status}</span>
                                        </div>
                                        <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${p.progress}%` }} />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Timeline right panel */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recent Activity</h3>
                        <div className="bg-slate-955/40 border border-slate-850 rounded-2xl p-5 space-y-4">
                            {mockWorkspaceDetails.activities.slice(0, 3).map((act) => (
                                <TimelineItem key={act.id} user={act.user} title={act.title} time={act.time} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Projects Tab */}
            {activeTab === "projects" && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative w-48 sm:w-60 shrink-0">
                            <SearchIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                            <Input placeholder="Search projects..." className="pl-9 h-9" />
                        </div>
                        <Button variant="primary" size="sm" onClick={() => setCreateProjOpen(true)}>
                            <Plus className="h-4 w-4 mr-1.5" />
                            Create Project
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {mockWorkspaceDetails.projects.map((p) => (
                            <Link href={`/project/${p.id}`} key={p.id} className="block group">
                                <Card hoverable className="p-5 flex flex-col justify-between h-36">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-xs text-slate-200 group-hover:text-indigo-400 transition-colors truncate pr-3">{p.name}</h4>
                                            <Badge variant={p.status === 'COMPLETED' ? 'success' : 'info'}>{p.status}</Badge>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-semibold">{p.tasksCount} Tasks Registered</p>
                                    </div>
                                    
                                    <div className="space-y-1 pt-3 border-t border-slate-950">
                                        <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
                                            <span>Completeness</span>
                                            <span>{p.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${p.progress}%` }} />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. Members Tab */}
            {activeTab === "members" && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <Button variant="primary" size="sm" onClick={() => setInviteMemberOpen(true)}>
                            <Plus className="h-4 w-4 mr-1.5" /> Invite Member
                        </Button>
                    </div>

                    <div className="bg-slate-955/20 border border-slate-850 rounded-2xl overflow-hidden shadow-sm">
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
                                {mockWorkspaceDetails.members.map((m) => {
                                    const avatarInitials = m.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
                                    return (
                                        <tr key={m.id} className="border-b border-slate-900/60 hover:bg-slate-950/10 transition-colors">
                                            <td className="p-4 font-semibold text-slate-200">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded bg-slate-800 text-[10px] text-indigo-400 flex items-center justify-center font-bold">
                                                        {avatarInitials}
                                                    </div>
                                                    <span>{m.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-400">{m.email}</td>
                                            <td className="p-4">
                                                <Badge variant={m.role === 'OWNER' ? 'info' : m.role === 'ADMIN' ? 'warning' : 'default'}>
                                                    {m.role}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Dropdown 
                                                    trigger={
                                                        <button className="p-1 text-slate-500 hover:text-white rounded-lg hover:bg-slate-950 border border-transparent hover:border-slate-850 transition-all cursor-pointer">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </button>
                                                    }
                                                    items={[
                                                        { label: "Promote to Admin", onClick: () => {}, icon: <UserCheck className="h-3.5 w-3.5" /> },
                                                        { label: "Remove from Team", onClick: () => {}, icon: <UserX className="h-3.5 w-3.5" />, variant: "danger" }
                                                    ]}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 4. Activity Tab */}
            {activeTab === "activity" && (
                <div className="bg-slate-955/20 border border-slate-850 rounded-2xl p-6 max-w-xl">
                    <div className="space-y-4">
                        {mockWorkspaceDetails.activities.map((act) => (
                            <TimelineItem key={act.id} user={act.user} title={act.title} time={act.time} />
                        ))}
                    </div>
                </div>
            )}

            {/* 5. Workspace Settings Tab */}
            {activeTab === "settings" && (
                <div className="space-y-6 max-w-2xl">
                    <div className="bg-slate-955/20 border border-slate-850 rounded-2xl p-6 space-y-6">
                        {/* Rename workspace */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Rename Workspace</h3>
                            <div className="flex gap-3">
                                <Input placeholder="Edit brand name..." defaultValue={mockWorkspaceDetails.name} className="flex-1" />
                                <Button variant="primary">Save</Button>
                            </div>
                        </div>

                        {/* Transfer Ownership */}
                        <div className="border-t border-slate-900 pt-5 space-y-2">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Transfer Ownership</h3>
                            <div className="flex gap-3">
                                <Input placeholder="Enter user email..." className="flex-1" />
                                <Button variant="secondary">Transfer</Button>
                            </div>
                        </div>

                        {/* Delete Workspace */}
                        <div className="border-t border-slate-900 pt-5 space-y-3">
                            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                                <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
                                Delete Workspace
                            </h3>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                Once deleted, this workspace and all associated boards, metrics, and tasks will be permanently removed.
                            </p>
                            <Button variant="danger">
                                <Trash2 className="h-4 w-4 mr-1.5" />
                                Delete Workspace
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Creator Dialog Forms */}
            <Dialog 
                isOpen={createProjOpen} 
                onClose={() => setCreateProjOpen(false)}
                title="Create Project"
                description="Link a workspace task board for team sprints."
            >
                <div className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Project Name</label>
                        <Input placeholder="Branding design Q3 Board" required />
                    </div>
                    <div className="flex justify-end gap-3 pt-2 text-xs">
                        <Button variant="ghost" onClick={() => setCreateProjOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={() => setCreateProjOpen(false)}>Create Project</Button>
                    </div>
                </div>
            </Dialog>

            <Dialog 
                isOpen={inviteMemberOpen} 
                onClose={() => setInviteMemberOpen(false)}
                title="Invite Member"
                description="Invite an existing user into this workspace team."
            >
                <div className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                        <Input type="email" placeholder="name@company.com" required />
                    </div>
                    <div className="flex justify-end gap-3 pt-2 text-xs">
                        <Button variant="ghost" onClick={() => setInviteMemberOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={() => setInviteMemberOpen(false)}>Invite User</Button>
                    </div>
                </div>
            </Dialog>

            <Dialog 
                isOpen={editWorkOpen} 
                onClose={() => setEditWorkOpen(false)}
                title="Edit Workspace"
                description="Update core specifications of the workspace."
            >
                <div className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Workspace Name</label>
                        <Input placeholder="Rename workspace..." defaultValue={mockWorkspaceDetails.name} required />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                        <Input placeholder="Update description..." defaultValue={mockWorkspaceDetails.description} />
                    </div>
                    <div className="flex justify-end gap-3 pt-2 text-xs">
                        <Button variant="ghost" onClick={() => setEditWorkOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={() => setEditWorkOpen(false)}>Update</Button>
                    </div>
                </div>
            </Dialog>

        </div>
    );
}

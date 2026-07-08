'use client'

import { useState } from "react";
import Link from "next/link";
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter as FilterIcon, 
  SlidersHorizontal, 
  ExternalLink,
  MoreVertical,
  Edit2,
  Trash2
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
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { AvatarGroup } from "@/components/ui/shared";

export default function ProjectsList() {
    const [createProjOpen, setCreateProjOpen] = useState(false);

    // MOCK DATA for project list
    const mockProjects = [
        { 
            id: 1, 
            name: "Social Content Board", 
            workspace: "Marketing Launch Space", 
            status: "ACTIVE", 
            progress: 65, 
            createdBy: "Sarah Connor",
            members: [{ name: "Sarah Connor" }, { name: "Marcus Wright" }, { name: "Ujjwal" }]
        },
        { 
            id: 2, 
            name: "Email Copywriter Sprint", 
            workspace: "Marketing Launch Space", 
            status: "PLANNING", 
            progress: 20, 
            createdBy: "Sarah Connor",
            members: [{ name: "Sarah Connor" }, { name: "Ujjwal" }]
        },
        { 
            id: 3, 
            name: "API Gateways DevOps", 
            workspace: "API Gateways DevOps", 
            status: "ACTIVE", 
            progress: 40, 
            createdBy: "Marcus Wright",
            members: [{ name: "Marcus Wright" }, { name: "Sarah Connor" }]
        },
        { 
            id: 4, 
            name: "PR Press Rollout Catalog", 
            workspace: "Marketing Launch Space", 
            status: "COMPLETED", 
            progress: 100, 
            createdBy: "Sarah Connor",
            members: [{ name: "Sarah Connor" }, { name: "Marcus Wright" }, { name: "Ujjwal" }]
        }
    ];

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-850 pb-5">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        <FolderKanban className="h-5 w-5 text-indigo-400" />
                        Projects Directory
                    </h1>
                    <p className="text-xs text-slate-500">Query and structure work boards globally.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-48 sm:w-60">
                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                        <Input placeholder="Search projects..." className="pl-9 h-9" />
                    </div>
                    <Button 
                        variant="default" 
                        size="sm" 
                        className="h-9 font-bold"
                        onClick={() => setCreateProjOpen(true)}
                    >
                        <Plus className="h-4 w-4 mr-1.5" />
                        Create Project
                    </Button>
                </div>
            </div>

            {/* Table Filters */}
            <div className="flex flex-wrap gap-3 items-center justify-between text-xs font-semibold pb-1">
                <div className="flex items-center gap-2.5">
                    <button className="flex items-center gap-1.5 bg-slate-950/40 hover:bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-slate-400 hover:text-white transition-all cursor-pointer">
                        <FilterIcon className="h-3.5 w-3.5" />
                        Filter Status
                    </button>
                    <button className="flex items-center gap-1.5 bg-slate-955/40 hover:bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-slate-400 hover:text-white transition-all cursor-pointer">
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        Sort Order
                    </button>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {mockProjects.length} Projects Total
                </span>
            </div>

            {/* Table Layout using official Table components */}
            <div className="bg-slate-955/20 border border-slate-850 rounded-2xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-950/40 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        <TableRow className="border-b border-slate-855 hover:bg-transparent">
                            <TableHead className="p-4 text-slate-500">Project</TableHead>
                            <TableHead className="p-4 text-slate-500">Workspace</TableHead>
                            <TableHead className="p-4 text-slate-500">Status</TableHead>
                            <TableHead className="p-4 text-slate-500">Progress</TableHead>
                            <TableHead className="p-4 text-slate-500">Created By</TableHead>
                            <TableHead className="p-4 text-slate-500">Members</TableHead>
                            <TableHead className="p-4 text-center text-slate-500">Open</TableHead>
                            <TableHead className="p-4 text-right text-slate-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockProjects.map((p) => {
                            const creatorInitial = p.createdBy[0].toUpperCase();
                            return (
                                <TableRow key={p.id} className="border-b border-slate-900/60 hover:bg-slate-950/10 transition-colors">
                                    <TableCell className="p-4 font-bold text-slate-200">{p.name}</TableCell>
                                    <TableCell className="p-4 text-slate-400">{p.workspace}</TableCell>
                                    <TableCell className="p-4">
                                        <Badge>
                                            {p.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="p-4">
                                        <div className="flex items-center gap-3 min-w-28">
                                            <div className="flex-1 bg-slate-955 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${p.progress}%` }} />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 shrink-0">{p.progress}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-5.5 w-5.5 rounded bg-slate-800 text-[9px] text-indigo-400 flex items-center justify-center font-bold">
                                                {creatorInitial}
                                            </div>
                                            <span className="text-slate-300 font-medium">{p.createdBy}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-4">
                                        <AvatarGroup users={p.members} max={3} />
                                    </TableCell>
                                    <TableCell className="p-4 text-center">
                                        <Link href={`/project/${p.id}`} className="p-1.5 text-indigo-400 hover:text-indigo-300 bg-slate-950/60 border border-slate-850 hover:border-slate-700/60 rounded-xl transition-all inline-flex items-center">
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </Link>
                                    </TableCell>
                                    <TableCell className="p-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-950 border border-transparent hover:border-slate-850 transition-all cursor-pointer">
                                                <MoreVertical className="h-4 w-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-slate-955 border border-slate-850 text-slate-300">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Edit2 className="h-3.5 w-3.5 mr-2 inline" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-rose-450 hover:text-rose-400 cursor-pointer">
                                                    <Trash2 className="h-3.5 w-3.5 mr-2 inline" /> Delete Project
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Create Project Modal */}
            <Dialog open={createProjOpen} onOpenChange={setCreateProjOpen}>
                <DialogContent className="bg-slate-900 border border-slate-800 text-slate-100">
                    <DialogHeader>
                        <DialogTitle>Create Project</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Link a workspace task board for team sprints.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-1">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Project Name</label>
                            <Input placeholder="Branding design Q3 Board" required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                            <Input placeholder="Detail project parameters..." />
                        </div>
                        <div className="flex justify-end gap-3 pt-2 text-xs">
                            <Button variant="ghost" onClick={() => setCreateProjOpen(false)}>Cancel</Button>
                            <Button variant="default" onClick={() => setCreateProjOpen(false)}>Create Project</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}

'use client'

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  MessageSquare, 
  Calendar, 
  User, 
  Tag, 
  Trash2, 
  Clock, 
  AlertCircle,
  Save,
  CheckSquare,
  Paperclip,
  GitBranch,
  Edit2,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TimelineItem } from "@/components/ui/shared";
import { Status, Priority } from "@/types/user";

export default function TaskDetail() {
    const params = useParams();
    const router = useRouter();
    const taskId = Number(params?.id);

    const [commentText, setCommentText] = useState("");
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [editDescText, setEditDescText] = useState("");
    const [editTaskOpen, setEditTaskOpen] = useState(false);
    const [moveTaskOpen, setMoveTaskOpen] = useState(false);
    const [assignTaskOpen, setAssignTaskOpen] = useState(false);

    // MOCK DATA for Linear-style Task details
    const mockTask = {
        id: taskId,
        title: "Draft Twitter launch copy",
        description: "Draft 3 engaging tweet threads highlighting dynamic sync speeds, pricing options, and teammate role structures.",
        status: Status.TODO,
        priority: Priority.HIGH,
        due: "June 30, 2026",
        assignee: "Sarah Connor",
        labels: ["Marketing", "Social"],
        history: [
            { id: 1, user: "Sarah Connor", title: "created task", time: "2 hours ago" },
            { id: 2, user: "Sarah Connor", title: "assigned task to Sarah Connor", time: "1 hour ago" },
            { id: 3, user: "System", title: "attached label 'Marketing' and 'Social'", time: "45 mins ago" },
        ],
        comments: [
            { id: 10, user: "Ujjwal", content: "Make sure to emphasize role based access features as well.", time: "30 mins ago" },
            { id: 11, user: "Sarah Connor", content: "Good catch, will add that in the second tweet thread.", time: "15 mins ago" }
        ]
    };

    const getPriorityColor = (p: Priority) => {
        switch(p) {
            case Priority.URGENT: return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
            case Priority.HIGH: return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
            case Priority.MEDIUM: return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
            case Priority.LOW: return "bg-slate-800 text-slate-400 border border-slate-750";
            default: return "bg-slate-850 text-slate-400";
        }
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCommentText("");
    };

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
            
            {/* Top Back Nav & Quick Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-850 pb-5">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-xs text-slate-450 hover:text-white transition-all cursor-pointer bg-slate-950/40 px-3 py-2 rounded-xl border border-slate-850 w-fit"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Project Board
                </button>

                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setEditTaskOpen(true)}>
                        <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setMoveTaskOpen(true)}>
                        <GitBranch className="h-3.5 w-3.5 mr-1.5" /> Move
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setAssignTaskOpen(true)}>
                        <User className="h-3.5 w-3.5 mr-1.5" /> Assign
                    </Button>
                    <Button variant="danger" size="sm">
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                    </Button>
                </div>
            </div>

            {/* Split Grid: Linear-style layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Left side: Metadata & Title/Description details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                            {mockTask.title}
                        </h1>

                        {/* Linear Style properties bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-955/20 border border-slate-850 rounded-2xl text-xs">
                            <div className="space-y-1">
                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Status</span>
                                <Badge variant="info">{mockTask.status}</Badge>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Priority</span>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${getPriorityColor(mockTask.priority)}`}>
                                    {mockTask.priority}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Assignee</span>
                                <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                                    <div className="h-5 w-5 rounded bg-slate-800 text-[9px] text-indigo-400 flex items-center justify-center font-bold">
                                        {mockTask.assignee[0]}
                                    </div>
                                    <span>{mockTask.assignee}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Due Date</span>
                                <div className="flex items-center gap-1 text-slate-400 font-semibold">
                                    <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                    <span>{mockTask.due}</span>
                                </div>
                            </div>
                        </div>

                        {/* Labels block */}
                        {mockTask.labels.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Labels:</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {mockTask.labels.map((lbl, i) => (
                                        <span key={i} className="text-[9px] font-bold bg-slate-950 border border-slate-850 px-2 py-0.5 rounded-lg text-slate-400">
                                            {lbl}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Task Description */}
                    <div className="bg-slate-955/20 border border-slate-850 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-950 pb-3">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Description</h3>
                            <button 
                                onClick={() => {
                                    setIsEditingDesc(!isEditingDesc);
                                    setEditDescText(mockTask.description || "");
                                }}
                                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                            >
                                {isEditingDesc ? "Cancel" : "Edit"}
                            </button>
                        </div>

                        {isEditingDesc ? (
                            <div className="space-y-3">
                                <textarea 
                                    value={editDescText}
                                    onChange={(e) => setEditDescText(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-200 outline-none h-28 resize-none"
                                />
                                <div className="flex justify-end">
                                    <Button variant="primary" size="sm" onClick={() => setIsEditingDesc(false)}>
                                        <Save className="h-3.5 w-3.5 mr-1" /> Save
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
                                {mockTask.description || "No description provided."}
                            </p>
                        )}
                    </div>

                    {/* Files Section (Future Placeholder) */}
                    <div className="bg-slate-955/20 border border-slate-850 rounded-2xl p-5 space-y-3">
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Attachments (Future)</h3>
                        <div className="flex items-center gap-2 p-3 bg-slate-950/40 border border-dashed border-slate-850 rounded-xl text-slate-500 text-xs justify-center cursor-not-allowed">
                            <Paperclip className="h-4 w-4" />
                            <span>Upload files (attachments mapping coming soon)</span>
                        </div>
                    </div>
                </div>

                {/* Right side: Comments, Activity Timeline, and History */}
                <div className="space-y-6">
                    {/* Discussion timeline */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <MessageSquare className="h-4 w-4 text-indigo-400" />
                            Comments & Timeline
                        </h3>

                        <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                            {mockTask.comments.map((c) => {
                                const initials = c.user.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
                                return (
                                    <div key={c.id} className="p-3.5 bg-slate-955/40 border border-slate-850 rounded-2xl space-y-2">
                                        <div className="flex items-center justify-between gap-3 text-[10px]">
                                            <div className="flex items-center gap-1.5 text-slate-200 font-bold">
                                                <div className="h-4.5 w-4.5 rounded bg-slate-800 text-[8px] text-indigo-400 flex items-center justify-center font-bold">
                                                    {initials}
                                                </div>
                                                <span>{c.user}</span>
                                            </div>
                                            <span className="text-slate-500">{c.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Comment Input */}
                        <form onSubmit={handleCommentSubmit} className="space-y-3">
                            <textarea 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment to thread..."
                                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-200 outline-none h-16 resize-none"
                            />
                            <div className="flex justify-end">
                                <Button type="submit" size="sm">Comment</Button>
                            </div>
                        </form>
                    </div>

                    {/* History Audit Trail */}
                    <div className="space-y-3 pt-4 border-t border-slate-900">
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-indigo-400" />
                            History logs
                        </h3>
                        <div className="bg-slate-955/20 border border-slate-850 rounded-2xl p-4.5 space-y-3.5">
                            {mockTask.history.map((hist) => (
                                <TimelineItem key={hist.id} user={hist.user} title={hist.title} time={hist.time} />
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Actions Portals */}
            <Dialog isOpen={editTaskOpen} onClose={() => setEditTaskOpen(false)} title="Edit Task" description="Modify task configuration.">
                <div className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Task Title</label>
                        <Input defaultValue={mockTask.title} required />
                    </div>
                    <div className="flex justify-end gap-3 pt-2 text-xs">
                        <Button variant="ghost" onClick={() => setEditTaskOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={() => setEditTaskOpen(false)}>Save</Button>
                    </div>
                </div>
            </Dialog>

            <Dialog isOpen={moveTaskOpen} onClose={() => setMoveTaskOpen(false)} title="Move Task" description="Shift task to another project board column.">
                <div className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Status</label>
                        <select className="w-full bg-slate-955 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none">
                            <option>TODO</option>
                            <option>IN PROGRESS</option>
                            <option>IN REVIEW</option>
                            <option>DONE</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-2 text-xs">
                        <Button variant="ghost" onClick={() => setMoveTaskOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={() => setMoveTaskOpen(false)}>Move Status</Button>
                    </div>
                </div>
            </Dialog>

            <Dialog isOpen={assignTaskOpen} onClose={() => setAssignTaskOpen(false)} title="Assign Task" description="Delegate this task sheet to another user.">
                <div className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assignee Name</label>
                        <Input placeholder="Enter teammate name..." required />
                    </div>
                    <div className="flex justify-end gap-3 pt-2 text-xs">
                        <Button variant="ghost" onClick={() => setAssignTaskOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={() => setAssignTaskOpen(false)}>Assign Task</Button>
                    </div>
                </div>
            </Dialog>

        </div>
    );
}

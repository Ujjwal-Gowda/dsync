'use client'

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTask, updateTask, deleteTasks, updateTaskStatus } from "@/services/task.service";
import { fetchComment, createComment } from "@/services/comments.service";
import Link from "next/link";
import { 
  ArrowLeft, 
  MessageSquare, 
  Calendar, 
  User, 
  Tag, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Play,
  Save,
  Loader2,
  CheckSquare
} from "lucide-react";
import { Status, Priority } from "@/types/user";

export default function TaskDetail() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const taskId = Number(params?.id);

    const [commentText, setCommentText] = useState("");
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [editDescText, setEditDescText] = useState("");

    // Queries
    const { data: taskResponse, isLoading: isTaskLoading, error: taskError } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTask(taskId),
        enabled: !!taskId,
    });

    const { data: commentsResponse, isLoading: isCommentsLoading } = useQuery({
        queryKey: ['task-comments', taskId],
        queryFn: () => fetchComment(taskId),
        enabled: !!taskId,
    });

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Visual toggle only, user can hook mutation later
        setCommentText("");
    };

    if (isTaskLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                    <p className="text-slate-400 text-xs font-medium">Fetching task specifications...</p>
                </div>
            </div>
        );
    }

    if (taskError || !taskResponse?.data) {
        return (
            <div className="p-8 max-w-2xl mx-auto mt-10">
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-6 rounded-2xl flex flex-col items-center text-center gap-4">
                    <AlertCircle className="h-10 w-10 text-rose-400" />
                    <div>
                        <h3 className="font-bold text-lg text-white">Task Unavailable</h3>
                        <p className="text-sm mt-1 text-rose-300/80">The requested task does not exist or has been deleted.</p>
                    </div>
                    <button 
                        onClick={() => router.back()} 
                        className="px-4 py-2 bg-slate-800 text-xs font-semibold rounded-xl border border-slate-700 text-white hover:bg-slate-700 transition-all cursor-pointer"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const task = taskResponse.data;
    const realComments = commentsResponse?.data || [];

    // Fallback Mock Comments
    const mockComments = [
        {
            id: 1,
            content: "We should define a clean types directory and import it on the client.",
            userId: 2,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            user: { name: "Sarah Connor" }
        },
        {
            id: 2,
            content: "Websockets updates are working nicely. We just need to link the Kanban columns status updates.",
            userId: 3,
            createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
            user: { name: "Marcus Wright" }
        }
    ];

    const comments = realComments.length > 0 ? realComments : mockComments;

    const getPriorityBadgeColor = (p: Priority) => {
        switch(p) {
            case Priority.URGENT: return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
            case Priority.HIGH: return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
            case Priority.MEDIUM: return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
            case Priority.LOW: return "bg-slate-800 text-slate-400 border border-slate-750";
            default: return "bg-slate-800 text-slate-400";
        }
    };

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
            
            {/* Header / Back Action */}
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-5">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-all cursor-pointer bg-slate-950/40 px-3.5 py-2 rounded-xl border border-slate-850"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Project Board
                </button>

                <div className="flex items-center gap-2.5">
                    <span className="text-[10px] text-slate-500 font-semibold tracking-wider">
                        TASK ID: #{task.id}
                    </span>
                </div>
            </div>

            {/* Content layout: Split 2/3 and 1/3 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left side: Task Title, Description, Subtasks, Comments */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Task Title */}
                    <div className="space-y-2">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                            {task.title}
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getPriorityBadgeColor(task.priority)}`}>
                                {task.priority} Priority
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-800 text-slate-300 border border-slate-700">
                                {task.status}
                            </span>
                        </div>
                    </div>

                    {/* Task Description */}
                    <div className="bg-slate-950/20 border border-slate-850 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Description</h3>
                            <button 
                                onClick={() => {
                                    setIsEditingDesc(!isEditingDesc);
                                    setEditDescText(task.description || "");
                                }}
                                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                            >
                                {isEditingDesc ? "Cancel" : "Edit Details"}
                            </button>
                        </div>

                        {isEditingDesc ? (
                            <div className="space-y-3">
                                <textarea 
                                    value={editDescText}
                                    onChange={(e) => setEditDescText(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 outline-none h-28 resize-none"
                                />
                                <div className="flex justify-end">
                                    <button 
                                        onClick={() => setIsEditingDesc(false)}
                                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer"
                                    >
                                        <Save className="h-3.5 w-3.5" /> Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
                                {task.description || "No description provided for this task details sheet."}
                            </p>
                        )}
                    </div>

                    {/* Comments Area */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <MessageSquare className="h-4.5 w-4.5 text-indigo-400" />
                            Discussion Activity ({comments.length})
                        </h3>

                        {/* Comment list */}
                        <div className="space-y-4">
                            {comments.map((comment: any) => (
                                <div 
                                    key={comment.id}
                                    className="p-4 bg-slate-950/20 border border-slate-850 rounded-2xl flex gap-3 items-start"
                                >
                                    <div className="h-7 w-7 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                        {comment.user?.name ? comment.user.name[0] : 'U'}
                                    </div>
                                    <div className="space-y-1.5 min-w-0 flex-1">
                                        <div className="flex justify-between items-center gap-4">
                                            <span className="text-xs font-bold text-slate-200">
                                                {comment.user?.name || `User ID: ${comment.userId}`}
                                            </span>
                                            <span className="text-[9px] text-slate-500">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* New Comment Input */}
                        <form onSubmit={handleCommentSubmit} className="space-y-3.5 pt-2">
                            <textarea 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment to this task board sheet..."
                                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 outline-none h-20 resize-none"
                            />
                            <div className="flex justify-end">
                                <button 
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                                >
                                    Comment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right side: Meta Parameters details panel */}
                <div className="bg-slate-950/20 border border-slate-850 rounded-2xl p-5 space-y-6">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-900 pb-3">
                        Meta Parameters
                    </h3>

                    {/* Properties mapping */}
                    <div className="space-y-4 text-xs">
                        {/* Status */}
                        <div className="space-y-1.5">
                            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Status Code</span>
                            <select 
                                defaultValue={task.status}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none"
                            >
                                <option value={Status.TODO}>TODO</option>
                                <option value={Status.IN_PROGRESS}>IN PROGRESS</option>
                                <option value={Status.IN_REVIEW}>IN REVIEW</option>
                                <option value={Status.DONE}>DONE</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div className="space-y-1.5">
                            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Priority</span>
                            <select 
                                defaultValue={task.priority}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none"
                            >
                                <option value={Priority.LOW}>LOW</option>
                                <option value={Priority.MEDIUM}>MEDIUM</option>
                                <option value={Priority.HIGH}>HIGH</option>
                                <option value={Priority.URGENT}>URGENT</option>
                            </select>
                        </div>

                        {/* Assignee */}
                        <div className="space-y-1.5 pt-2">
                            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Assignee</span>
                            <div className="flex items-center gap-2 p-2 bg-slate-950/50 border border-slate-850 rounded-xl">
                                <div className="h-6 w-6 bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-[10px] rounded-lg">
                                    U
                                </div>
                                <span className="text-xs text-slate-300">
                                    {task.assigneeId ? `User ID: ${task.assigneeId}` : "Unassigned"}
                                </span>
                            </div>
                        </div>

                        {/* Date Created */}
                        <div className="space-y-1.5 pt-2">
                            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Date Registered</span>
                            <div className="flex items-center gap-2 text-slate-400 text-xs">
                                <Clock className="h-4 w-4 text-slate-500" />
                                <span>{new Date(task.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Danger zone actions */}
                    <div className="border-t border-slate-900 pt-5 mt-4 space-y-3">
                        <h4 className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Danger Actions</h4>
                        <button 
                            className="w-full flex items-center justify-center gap-2 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 font-semibold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                        >
                            <Trash2 className="h-4 w-4" /> Delete Task
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
}

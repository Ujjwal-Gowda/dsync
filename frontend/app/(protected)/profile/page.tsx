'use client'

import CurrentUser from "@/hooks/currentUser";
import { 
  User, 
  Mail, 
  Shield, 
  CheckSquare, 
  CheckCircle2, 
  FolderKanban, 
  MessageSquare,
  Clock
} from "lucide-react";
import { StatsCard, TimelineItem } from "@/components/ui/shared";

export default function ProfilePage() {
    const { data: user, isLoading } = CurrentUser();

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center bg-slate-900">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                    <p className="text-slate-400 text-xs font-semibold">Retrieving user profile card...</p>
                </div>
            </div>
        );
    }

    const name = user?.name || "Ujjwal";
    const email = user?.email || "ujjwal@dsync.io";
    const initials = name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

    return (
        <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6 text-slate-100 font-sans">
            
            {/* Profile card Header */}
            <div className="bg-slate-950/20 border border-slate-850 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
                {/* Visual back glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Avatar */}
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-650 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-indigo-500/10 shrink-0 select-none">
                    {initials}
                </div>

                <div className="space-y-1.5 text-center sm:text-left min-w-0 flex-1 relative z-10">
                    <h1 className="text-xl font-bold text-white tracking-tight">{name}</h1>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4 text-slate-500" />
                            {email}
                        </span>
                        <span className="flex items-center gap-1">
                            <Shield className="h-4 w-4 text-slate-500" />
                            Workspace Member
                        </span>
                    </div>
                </div>
            </div>

            {/* Profile Statistics metrics dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatsCard title="Tasks Assigned" value="14" icon={<CheckSquare className="h-4.5 w-4.5" />} />
                <StatsCard title="Tasks Completed" value="8" icon={<CheckCircle2 className="h-4.5 w-4.5 text-emerald-450" />} />
                <StatsCard title="Projects Created" value="3" icon={<FolderKanban className="h-4.5 w-4.5" />} />
                <StatsCard title="Comments Made" value="25" icon={<MessageSquare className="h-4.5 w-4.5" />} />
            </div>

            {/* Recent activity timeline log feed */}
            <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="h-4.5 w-4.5 text-indigo-400" />
                    My Activity Log
                </h3>

                <div className="bg-slate-955/20 border border-slate-850 rounded-2xl p-6 space-y-4">
                    <TimelineItem user={name} title="completed task 'Draft Twitter copy' in Social Content Board" time="15 mins ago" />
                    <TimelineItem user={name} title="added comment 'Verify dynamic schema imports' in Gateway Server" time="2 hours ago" />
                    <TimelineItem user={name} title="created project 'Email Copywriter Sprint' under Marketing launch" time="1 day ago" />
                    <TimelineItem user={name} title="joined Dsync Collaboration Hub workspace team space" time="3 days ago" />
                </div>
            </div>

        </div>
    );
}

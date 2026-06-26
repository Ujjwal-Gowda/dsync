'use client'

import { useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "@/components/ui/shared";

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState<"all" | "unread" | "mentions" | "assignments">("all");

    // MOCK DATA for Notifications
    const mockNotifications = [
        { id: 1, type: "assignment", sender: "Sarah Connor", message: "assigned task 'Draft Twitter copy' to you", time: "5 mins ago", unread: true, project: "Social Content Board", task: "Draft Twitter copy" },
        { id: 2, type: "mention", sender: "Marcus Wright", message: "mentioned you in a comment: '@Ujjwal make sure to verify API endpoints'", time: "30 mins ago", unread: true, project: "API Gateways DevOps", task: "Verify endpoints Integration" },
        { id: 3, type: "comment", sender: "John Doe", message: "commented on project social assets checklist", time: "1 hour ago", unread: false, project: "Social Content Board" },
        { id: 4, type: "system", sender: "System", message: "successfully integrated Prisma migrations database configuration schemas", time: "1 day ago", unread: false }
    ];

    const filtered = mockNotifications.filter((n) => {
        if (activeTab === "unread") return n.unread;
        if (activeTab === "mentions") return n.type === "mention";
        if (activeTab === "assignments") return n.type === "assignment";
        return true;
    });

    return (
        <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6 text-slate-100 font-sans">
            
            {/* Header section */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-850 pb-5">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        <Bell className="h-5 w-5 text-indigo-400" />
                        Notifications Center
                    </h1>
                    <p className="text-xs text-slate-500">View real-time alerts, mentions, and assignments.</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="secondary" size="sm">
                        <CheckCheck className="h-4 w-4 mr-1.5" /> Mark all read
                    </Button>
                    <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-300">
                        <Trash2 className="h-4 w-4 mr-1.5" /> Clear all
                    </Button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-950/40 p-1.5 rounded-xl border border-slate-855 text-xs font-semibold w-full sm:w-fit">
                {(["all", "unread", "mentions", "assignments"] as const).map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)} 
                        className={`px-4 py-2 rounded-lg transition-all capitalize cursor-pointer shrink-0 ${activeTab === tab ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Notifications feed list */}
            <div className="space-y-3.5">
                {filtered.length > 0 ? (
                    filtered.map((n) => (
                        <NotificationItem 
                            key={n.id}
                            sender={n.sender}
                            message={n.message}
                            time={n.time}
                            unread={n.unread}
                            project={n.project}
                            task={n.task}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-950/10 border border-dashed border-slate-850 rounded-2xl text-slate-500 text-xs italic">
                        No notifications found in this category.
                    </div>
                )}
            </div>

        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import CurrentUser from '@/hooks/currentUser';
import useWorkspace from "@/hooks/useWorkspace";
import { logOut } from "@/services/auth.service";
import Link from 'next/link';
import { 
  Layers, 
  LayoutDashboard, 
  FolderKanban, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Plus, 
  ChevronRight, 
  User, 
  Briefcase, 
  Menu, 
  X,
  Activity
} from 'lucide-react';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { data: user, isLoading: isUserLoading } = CurrentUser();
    const { data: workspaces, isLoading: isWorkspacesLoading } = useWorkspace();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    const handleLogout = async () => {
        try {
            await logOut();
            router.push('/login');
        } catch (error) {
            console.error("Logout failed", error);
            // Fallback redirect
            router.push('/login');
        }
    };

    if (isUserLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                    <p className="text-slate-400 text-xs font-medium tracking-wide">Syncing session...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const workspacesList = workspaces?.data || [];

    // Get initials for profile fallback
    const initials = user.name
        ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
        : 'US';

    return (
        <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100 font-sans">
            
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/60 p-5 flex flex-col justify-between transition-transform duration-300 md:relative md:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-2.5">
                            <div className="bg-indigo-600 p-1.5 rounded-lg">
                                <Layers className="h-4.5 w-4.5 text-white" />
                            </div>
                            <span className="font-bold text-lg text-white tracking-tight">Dsync</span>
                        </Link>
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden p-1 text-slate-400 hover:text-white rounded"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Main Nav */}
                    <nav className="space-y-1">
                        <Link 
                            href="/dashboard"
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                                pathname === '/dashboard' 
                                ? 'bg-indigo-600 text-white' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                            }`}
                        >
                            <LayoutDashboard className="h-4.5 w-4.5" />
                            Dashboard
                        </Link>

                        <Link 
                            href="/workspace"
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                                pathname === '/workspace' 
                                ? 'bg-indigo-600 text-white' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                            }`}
                        >
                            <Briefcase className="h-4.5 w-4.5" />
                            Workspaces
                        </Link>
                    </nav>

                    {/* Workspaces Section */}
                    <div className="space-y-2 pt-4">
                        <div className="flex items-center justify-between px-3">
                            <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">My Workspaces</span>
                            <Link href="/workspace" className="text-slate-400 hover:text-indigo-400 p-0.5 rounded transition-colors">
                                <Plus className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                        <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                            {isWorkspacesLoading ? (
                                <div className="px-3 py-2 text-xs text-slate-500 animate-pulse">Loading list...</div>
                            ) : workspacesList.length > 0 ? (
                                workspacesList.map((work: any) => {
                                    const w = work.workspaces;
                                    const isSelected = pathname?.includes(`/workspace/${w.id}`);
                                    return (
                                        <Link
                                            key={w.id}
                                            href={`/workspace/${w.id}`}
                                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                                isSelected 
                                                ? 'bg-slate-800 text-indigo-400 border border-slate-700/60' 
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                                            }`}
                                        >
                                            <span className="truncate">{w.name}</span>
                                            <ChevronRight className={`h-3 w-3 opacity-60 transition-transform ${isSelected ? 'rotate-90 text-indigo-400' : ''}`} />
                                        </Link>
                                    );
                                })
                            ) : (
                                <p className="px-3 py-2 text-xs text-slate-500 italic">No workspaces</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer User Profile Panel */}
                <div className="border-t border-slate-800/80 pt-4 mt-auto">
                    <div className="flex items-center gap-3 px-1">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/10">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-200 truncate">{user.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                        </div>
                        <button 
                            onClick={handleLogout}
                            title="Sign Out"
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                        >
                            <LogOut className="h-4.5 w-4.5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
                {/* Header */}
                <header className="h-16 border-b border-slate-800/60 bg-slate-950/30 px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-1 text-slate-400 hover:text-white rounded"
                        >
                            <Menu className="h-5.5 w-5.5" />
                        </button>
                        
                        <div className="hidden sm:flex items-center text-xs text-slate-500 gap-2 font-medium">
                            <span>Dsync Space</span>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-slate-300 font-semibold capitalize">
                                {pathname?.split('/').filter(Boolean).pop() || 'Dashboard'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative hidden md:block w-64">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <input 
                                type="text" 
                                placeholder="Search workspace..."
                                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-1.5 pl-9 pr-4 text-xs placeholder-slate-500 outline-none transition-all"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl relative transition-all">
                            <Bell className="h-4.5 w-4.5" />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto bg-slate-900/60">
                    {children}
                </main>
            </div>
        </div>
    );
}

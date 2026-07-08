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
  Briefcase, 
  FolderKanban, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  Search,
  Plus,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [quickCreateOpen, setQuickCreateOpen] = useState(false);

    const { data: user, isLoading: isUserLoading } = CurrentUser();
    const { data: workspaces } = useWorkspace();

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
            router.push('/login');
        }
    };

    if (isUserLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                    <p className="text-slate-400 text-xs font-semibold">Loading session...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const workspacesList = workspaces?.data || [];
    const activeWorkspace = workspacesList.find((w: any) => pathname?.includes(`/workspace/${w.workspaces?.id}`))?.workspaces;

    const navItems = [
        { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
        { label: "Workspaces", href: "/workspace", icon: <Briefcase className="h-4.5 w-4.5" /> },
        { label: "Projects", href: "/project", icon: <FolderKanban className="h-4.5 w-4.5" /> },
        { label: "Notifications", href: "/notifications", icon: <Bell className="h-4.5 w-4.5" /> },
        { label: "Settings", href: "/settings", icon: <Settings className="h-4.5 w-4.5" /> },
    ];

    const initials = user.name
        ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
        : 'US';

    return (
        <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100 font-sans">
            
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-955/60 backdrop-blur-sm md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-60 bg-slate-955 border-r border-slate-850 p-5 flex flex-col justify-between transition-transform duration-300 md:relative md:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="space-y-6">
                    {/* Logo */}
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-2.5">
                            <div className="bg-indigo-650 p-1.5 rounded-lg">
                                <Layers className="h-4.5 w-4.5 text-white" />
                            </div>
                            <span className="font-extrabold text-base text-white tracking-tight">Dsync Hub</span>
                        </Link>
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden p-1 text-slate-400 hover:text-white rounded"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isSelected = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                            return (
                                <Link 
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                                        isSelected 
                                        ? 'bg-indigo-650 text-white shadow-sm' 
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                                    }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Workspace Switcher in Sidebar using official DropdownMenu */}
                    <div className="pt-2 border-t border-slate-900">
                        <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase block px-3 mb-2">Active Workspace</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-full flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-350 hover:text-white transition-all cursor-pointer">
                                <span className="truncate">{activeWorkspace ? activeWorkspace.name : "Select Workspace"}</span>
                                <ChevronDown className="h-3.5 w-3.5 opacity-65 shrink-0 ml-1.5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-52 bg-slate-950 border border-slate-850 text-slate-300">
                                {workspacesList.length > 0 ? (
                                    workspacesList.map((item: any) => (
                                        <DropdownMenuItem 
                                            key={item.workspaces?.id} 
                                            onClick={() => router.push(`/workspace/${item.workspaces?.id}`)}
                                            className="block w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-900 text-slate-450 hover:text-white transition-colors cursor-pointer outline-none"
                                        >
                                            {item.workspaces?.name}
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-[10px] text-slate-500 italic">No spaces</div>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* User Card */}
                <div className="border-t border-slate-905 pt-4">
                    <div className="flex items-center gap-3 px-1">
                        <Link href="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 group">
                            <div className="h-8.5 w-8.5 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                                {initials}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-200 truncate group-hover:text-indigo-400 transition-colors">{user.name}</p>
                                <p className="text-[9px] text-slate-500 truncate">Settings</p>
                            </div>
                        </Link>
                        <button 
                            onClick={handleLogout}
                            title="Logout"
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors shrink-0 cursor-pointer"
                        >
                            <LogOut className="h-4.5 w-4.5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/50">
                {/* Header Navbar */}
                <header className="h-16 border-b border-slate-850 bg-slate-955/20 px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-1 text-slate-400 hover:text-white rounded"
                        >
                            <Menu className="h-5.5 w-5.5" />
                        </button>

                        {/* Breadcrumbs */}
                        <div className="hidden sm:flex items-center text-[10px] text-slate-500 gap-1.5 font-bold uppercase tracking-wider">
                            <span>Dsync</span>
                            <span className="opacity-50">/</span>
                            <span className="text-slate-300">
                                {pathname?.split('/').filter(Boolean).pop() || 'Dashboard'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative hidden md:block w-48 lg:w-56">
                            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                            <Input 
                                type="text" 
                                placeholder="Search workspace..."
                                className="pl-9"
                            />
                        </div>

                        {/* Quick Create Button */}
                        <Button 
                            variant="default" 
                            size="sm"
                            className="h-8 py-0 px-3 text-xs font-bold"
                            onClick={() => setQuickCreateOpen(true)}
                        >
                            <Plus className="h-4.5 w-4.5 mr-1" />
                            Create
                        </Button>

                        {/* Notification Bell */}
                        <Link href="/notifications">
                            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl relative transition-all cursor-pointer">
                                <Bell className="h-4.5 w-4.5" />
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                            </button>
                        </Link>

                        {/* Profile Avatar */}
                        <Link href="/profile" className="shrink-0">
                            <div className="h-8 w-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs ring-1 ring-slate-800 hover:ring-indigo-500/50 transition-all">
                                {initials}
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* Quick Actions Creator Dialog using official Dialog */}
            <Dialog open={quickCreateOpen} onOpenChange={setQuickCreateOpen}>
                <DialogContent className="bg-slate-900 border border-slate-800 text-slate-100">
                    <DialogHeader>
                        <DialogTitle>Quick Create Action</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Select an entity to configure and create instantly.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-3 text-center pt-2">
                        <Link href="/workspace" onClick={() => setQuickCreateOpen(false)} className="p-4 bg-slate-950 hover:bg-slate-950/80 border border-slate-850 hover:border-indigo-500/50 rounded-xl transition-all space-y-2 block">
                            <Briefcase className="h-5 w-5 text-indigo-400 mx-auto" />
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Workspace</div>
                        </Link>
                        <Link href="/project" onClick={() => setQuickCreateOpen(false)} className="p-4 bg-slate-950 hover:bg-slate-950/80 border border-slate-850 hover:border-indigo-500/50 rounded-xl transition-all space-y-2 block">
                            <FolderKanban className="h-5 w-5 text-indigo-400 mx-auto" />
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Project</div>
                        </Link>
                        <Link href="/project" onClick={() => setQuickCreateOpen(false)} className="p-4 bg-slate-950 hover:bg-slate-950/80 border border-slate-855 hover:border-indigo-500/50 rounded-xl transition-all space-y-2 block">
                            <Layers className="h-5 w-5 text-indigo-400 mx-auto" />
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Task</div>
                        </Link>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

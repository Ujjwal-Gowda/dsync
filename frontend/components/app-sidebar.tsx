import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Briefcase, FolderKanban, CheckSquare, User, Settings } from "lucide-react"
import Link from "next/link"
import CurrentUser from "@/hooks/currentUser"
import { usePathname } from "next/navigation"

export function AppSidebar() {
    const { data: user } = CurrentUser();
    const pathname = usePathname();

    const menuItems = [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Workspaces", url: "/workspace", icon: Briefcase },
        { title: "Projects", url: "/project", icon: FolderKanban },
        { title: "Tasks", url: "/task", icon: CheckSquare },
    ]

    return (
        <Sidebar className="border-r border-border bg-card">
            <SidebarHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-xl shadow-md shadow-primary/20">
                        D
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-base leading-tight tracking-tight text-foreground">Dsync</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Workspace</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="py-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.url || pathname.startsWith(item.url + "/");
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            render={<Link href={item.url} />}
                                            isActive={isActive}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                                isActive 
                                                    ? "bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/10" 
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            }`}
                                        >
                                            <item.icon className={`h-4.5 w-4.5 ${isActive ? "text-primary-foreground" : "text-muted-foreground/80 group-hover:text-foreground"}`} />
                                            <span className="text-sm">{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-border/40 bg-muted/20">
                {user ? (
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold shadow-inner">
                                {user.name ? user.name[0].toUpperCase() : <User className="h-4.5 w-4.5" />}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-foreground truncate leading-tight">{user.name}</span>
                                <span className="text-[11px] text-muted-foreground truncate leading-none mt-0.5">{user.email}</span>
                            </div>
                        </div>
                        <Link href="/settings" className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors shrink-0">
                            <Settings className="h-4 w-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="flex h-9 w-full animate-pulse rounded-lg bg-muted" />
                )}
            </SidebarFooter>
        </Sidebar>
    )
}

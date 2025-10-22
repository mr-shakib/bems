"use client";

import { UserButton } from "@/features/auth/components/user-button";
import { MobileSidebar } from "./mobile-sidebar";
import { usePathname } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useGetProjects } from "@/features/projects/api/use-get-projects";

export const Navbar = () => {
    const pathname = usePathname();
    const workspaceId = useWorkspaceId();
    
    // Get workspace data from workspaces list
    const { data: workspaces } = useGetWorkspaces();
    const workspace = workspaces?.documents.find((ws: any) => ws.$id === workspaceId);
    
    // Extract project ID if we're on a project page
    const projectIdMatch = pathname.match(/\/projects\/([^\/]+)/);
    const projectId = projectIdMatch ? projectIdMatch[1] : null;
    
    // Get projects data if we're on a project page
    const { data: projects } = useGetProjects({ workspaceId });
    const project = projects?.documents.find((p: any) => p.$id === projectId);

    // Determine header content based on route
    const getHeaderContent = () => {
        // Projects list page
        if (pathname.includes('/projects') && !projectId) {
            return {
                title: "Projects",
                description: "View and manage all your projects"
            };
        }
        
        // Specific project page
        if (pathname.includes('/projects') && projectId && project) {
            return {
                title: project.name,
                description: `${project.description || 'Project dashboard and tasks'}`
            };
        }
        
        // Tasks page
        if (pathname.includes('/tasks')) {
            return {
                title: "Tasks",
                description: "Manage your tasks and track progress"
            };
        }
        
        // Settings page
        if (pathname.includes('/settings')) {
            return {
                title: "Settings",
                description: "Manage workspace settings and preferences"
            };
        }
        
        // Members page
        if (pathname.includes('/members')) {
            return {
                title: "Members",
                description: "Manage team members and permissions"
            };
        }
        
        // Default to workspace home
        return {
            title: workspace?.name ? `Welcome to ${workspace.name}` : "Home",
            description: "Monitor all of your projects and tasks in one place"
        };
    };

    const { title, description } = getHeaderContent();

    return (
        <nav className="pt-3 sm:pt-4 px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ease-out">
            <div className="flex-col hidden lg:flex animate-fade-in">
                <h1 className="text-xl sm:text-2xl font-semibold transition-all duration-300 ease-out hover:text-primary">{title}</h1>
                <p className="text-muted-foreground text-sm sm:text-base transition-all duration-300 ease-out">{description}</p>
            </div>
            <div className="flex items-center gap-3 animate-slide-in-right">
                <div className="transition-all duration-300 ease-out hover:scale-105">
                    <MobileSidebar />
                </div>
                <div className="transition-all duration-300 ease-out hover:scale-105">
                    <UserButton />
                </div>
            </div>
        </nav>
    );
};

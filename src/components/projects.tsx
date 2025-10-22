"use client";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { FolderOpen, Loader2 } from "lucide-react";

export const Projects = () => {
    const pathname = usePathname();
    const {open} = useCreateProjectModal();
    const workspaceId = useWorkspaceId();
    const { data, isLoading } = useGetProjects({
        workspaceId,
    });

    return (
        <div className="space-y-3">
           <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-slate-500" />
                <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Projects</p>
            </div>
            <button
                onClick={open}
                className={cn(
                    "p-1.5 rounded-lg text-slate-500 transition-all duration-300 ease-out transform",
                    "hover:text-slate-700 hover:bg-slate-100 hover:scale-110 hover:shadow-sm",
                    "active:scale-95 active:transition-transform active:duration-75",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-400"
                )}
                title="Create new project"
            >
                <RiAddCircleFill className="size-4 transition-transform duration-300 hover:rotate-90" />
            </button>
           </div>

           <div className="space-y-1">
               {isLoading ? (
                   // Loading shimmer for projects
                   <div className="space-y-1">
                       {[...Array(3)].map((_, index) => (
                           <div key={index} className="flex items-center gap-3 px-3 py-2.5 rounded-xl animate-pulse">
                               <div className="w-8 h-8 bg-slate-200 rounded-lg animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                               <div className="flex-1 h-4 bg-slate-200 rounded animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                           </div>
                       ))}
                   </div>
               ) : data?.documents.length === 0 ? (
                   // Empty state
                   <div className="flex flex-col items-center justify-center py-6 text-center">
                       <FolderOpen className="w-8 h-8 text-slate-400 mb-2" />
                       <p className="text-sm text-slate-500 mb-3">No projects yet</p>
                       <button
                           onClick={open}
                           className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                       >
                           Create your first project
                       </button>
                   </div>
               ) : (
                   // Projects list
                   data?.documents.map((project) => {
                        const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
                        const isActive = pathname === href;
                        return (
                            <Link href={href} key={project.$id} className="block">
                                <div
                                className = {cn(
                                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl",
                                    "transition-colors duration-150 ease-out border border-transparent",
                                    "hover:shadow-md hover:shadow-black/5 hover:scale-[1.01]",
                                    "active:scale-[0.99] active:transition-transform active:duration-75",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                                    isActive
                                        ? "bg-blue-50/80 text-blue-900 border-blue-100/60 shadow-md scale-[1.01]"
                                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-50/80 hover:border-slate-200/50"
                                )}>
                                    <div className={cn(
                                        "relative z-10 transition-colors duration-150 ease-out"
                                    )}>
                                        <ProjectAvatar
                                            image={project.imageUrl}
                                            name={project.name}
                                            fallbackClassName={cn(
                                                "w-8 h-8 transition-colors duration-150",
                                                isActive 
                                                    ? "bg-blue-100/80 text-blue-700 shadow-sm" 
                                                    : "bg-slate-100 text-slate-600 group-hover:bg-white"
                                            )}
                                        />
                                    </div>
                                    <span className={cn(
                                        'relative z-10 truncate text-sm transition-colors duration-150 ease-out',
                                        isActive 
                                            ? 'font-semibold text-blue-800 bg-blue-100/40 px-2 py-0.5 rounded-lg shadow-sm drop-shadow-sm' 
                                            : 'font-medium group-hover:text-slate-900'
                                    )}>{project.name}</span>
                                    

                                </div>
                            </Link>
                        )
                   })
               )}
           </div>
        </div>
    );
};

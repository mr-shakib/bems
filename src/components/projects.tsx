"use client";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { FolderOpen } from "lucide-react";

export const Projects = () => {
    const pathname = usePathname();
    const {open} = useCreateProjectModal();
    const workspaceId = useWorkspaceId();
    const { data} = useGetProjects({
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
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Create new project"
            >
                <RiAddCircleFill className="size-4" />
            </button>
           </div>

           <div className="space-y-1">
               {data?.documents.map((project) => {
                    const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
                    const isActive = pathname === href;
                    return (
                        <Link href={href} key={project.$id}>
                            <div
                            className = {cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                                "hover:shadow-sm border border-transparent group",
                                isActive
                                    ? "bg-blue-50/80 text-blue-900 border-blue-100/60 shadow-sm"
                                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-50/80 hover:border-slate-200/50"
                            )}>
                                <ProjectAvatar
                                    image={project.imageUrl}
                                    name={project.name}
                                    fallbackClassName={cn(
                                        "w-8 h-8",
                                        isActive ? "bg-blue-100/80 text-blue-700" : "bg-slate-100 text-slate-600"
                                    )}
                                />
                                <span className={cn(
                                    'truncate text-sm transition-colors duration-200',
                                    isActive 
                                        ? 'font-semibold text-blue-800 bg-blue-100/40 px-2 py-0.5 rounded-md' 
                                        : 'font-medium group-hover:text-slate-900'
                                )}>{project.name}</span>
                            </div>
                        </Link>
                    )
               })}
           </div>
        </div>
    );
};

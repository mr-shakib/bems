"use client"

import { RiAddCircleFill } from "react-icons/ri";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";


export const WorkspaceSwitcher = () => {
    const workspaceId = useWorkspaceId();
    const { data: workspaces } = useGetWorkspaces();
    const router = useRouter();
    const { open } = useCreateWorkspaceModal();

    const onselect = (id: string) => {
        router.push(`/workspaces/${id}`);
    };

    // If we're on a workspace page but the workspaceId doesn't match any existing workspace,
    // we should select the first available workspace
    const selectedWorkspaceId = workspaces?.documents.some(w => w.$id === workspaceId)
        ? workspaceId
        : workspaces?.documents[0]?.$id;

    return (
        <div className="space-y-3">
           <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-500" />
                <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Workspaces</p>
            </div>
            <button
                onClick={open}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Create new workspace"
            >
                <RiAddCircleFill className="size-4" />
            </button>
           </div>

           <Select onValueChange={onselect} value={selectedWorkspaceId || workspaceId}>
            <SelectTrigger className={cn(
                "w-full bg-white/80 backdrop-blur-sm border-slate-200/60",
                "font-medium p-3 h-11 text-sm shadow-sm",
                "hover:bg-white hover:shadow-md transition-all duration-200",
                "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
            )}>
             <SelectValue placeholder="Select a workspace" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm border-slate-200/60">
             {workspaces?.documents.map((workspace) => (
              <SelectItem
                key={workspace.$id}
                value={workspace.$id}
                className="py-3 px-3 hover:bg-slate-50 focus:bg-slate-50"
              >
                <div className="flex justify-start items-center gap-3 font-medium">
                  <WorkspaceAvatar image={workspace.imageUrl} name={workspace.name} />
                  <span className="truncate text-sm text-slate-700">{workspace.name}</span>
                </div>
              </SelectItem>
             ))}
            </SelectContent>
           </Select>
        </div>
    );
};
"use client"

import { RiAddCircleFill } from "react-icons/ri";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";

import { 
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
 } from "@/components/ui/select";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";


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
        <div className="flex flex-col gap-y-2">
           <div className="flex items-center justify-between">
            <p className="text-xs uppercase text-neutral-500 font-medium">Workspaces</p>
            <RiAddCircleFill onClick={open} className="size-4 sm:size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
           </div>
           <Select onValueChange={onselect} value={selectedWorkspaceId || workspaceId}>
            <SelectTrigger className="w-full bg-neutral-200 font-medium p-2 sm:p-1 h-9 sm:h-10 text-sm">
             <SelectValue placeholder="Select a workspace" />
            </SelectTrigger>
            <SelectContent>
             {workspaces?.documents.map((workspace) => (
              <SelectItem key={workspace.$id} value={workspace.$id} className="py-2">
                <div className="flex justify-start items-center gap-2 sm:gap-3 font-medium">
                  <WorkspaceAvatar image={workspace.imageUrl} name={workspace.name} />
                  <span className="truncate text-sm">{workspace.name}</span>
                </div>
              </SelectItem>
             ))}
            </SelectContent>
           </Select>
        </div>
    );
};
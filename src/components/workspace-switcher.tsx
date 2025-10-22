"use client"

import { RiAddCircleFill } from "react-icons/ri";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { Building2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useTransition, useEffect } from "react";



export const WorkspaceSwitcher = () => {
    const workspaceId = useWorkspaceId();
    const { data: workspaces, isLoading } = useGetWorkspaces();
    const router = useRouter();
    const { open } = useCreateWorkspaceModal();
    const [isPending, startTransition] = useTransition();
    const [switchingToId, setSwitchingToId] = useState<string | null>(null);

    // Clear switching state when transition completes
    useEffect(() => {
        if (!isPending && switchingToId) {
            setSwitchingToId(null);
        }
    }, [isPending, switchingToId]);

    const onselect = (id: string) => {
        setSwitchingToId(id);
        startTransition(() => {
            router.push(`/workspaces/${id}`);
        });
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
                <Building2 className={cn(
                    "w-4 h-4 text-slate-500 transition-all duration-300",
                    isLoading && "animate-pulse"
                )} />
                <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">
                    Workspaces
                    {isLoading && (
                        <span className="ml-1 inline-block w-1 h-1 bg-slate-400 rounded-full animate-pulse" />
                    )}
                </p>
            </div>
            <button
                onClick={open}
                disabled={isPending}
                className={cn(
                    "p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100",
                    "transition-all duration-200 hover:scale-110 active:scale-95",
                    isPending && "opacity-50 cursor-not-allowed"
                )}
                title="Create new workspace"
            >
                <RiAddCircleFill className="size-4" />
            </button>
           </div>

           <Select onValueChange={onselect} value={selectedWorkspaceId || workspaceId} disabled={isPending || isLoading}>
            <SelectTrigger className={cn(
                "w-full bg-white/80 backdrop-blur-sm border-slate-200/60",
                "font-medium p-3 h-11 text-sm shadow-sm",
                "hover:bg-white hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-200/80",
                "hover:scale-[1.01] active:scale-[0.99]",
                "transition-all duration-300 ease-out",
                "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300",
                (isPending || isLoading) && "opacity-75 cursor-not-allowed",
                isPending && "animate-pulse"
            )}>
             <div className="flex items-center gap-2 w-full">
                {(isPending || isLoading) && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                )}
                <SelectValue placeholder={isLoading ? "Loading workspaces..." : "Select a workspace"} />
             </div>
            </SelectTrigger>
            <SelectContent className={cn(
                "bg-white/95 backdrop-blur-sm border-slate-200/60 shadow-xl",
                "data-[state=open]:workspace-switcher-open",
                "data-[state=closed]:workspace-switcher-close"
            )}>
             {isLoading ? (
                <div className="py-6 px-3 text-center">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-blue-500 mb-2" />
                    <p className="text-sm text-slate-500">Loading workspaces...</p>
                </div>
             ) : (
                workspaces?.documents.map((workspace, index) => {
                    const isCurrentlySwitching = switchingToId === workspace.$id;
                    return (
                        <SelectItem
                            key={workspace.$id}
                            value={workspace.$id}
                            disabled={isPending}
                            className={cn(
                                "py-3 px-3 cursor-pointer transition-all duration-200 ease-out",
                                "hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80",
                                "hover:shadow-sm hover:scale-[1.01] hover:translate-x-1",
                                "focus:bg-gradient-to-r focus:from-blue-50/80 focus:to-purple-50/80",
                                "focus:shadow-sm focus:scale-[1.01] focus:translate-x-1",
                                "workspace-item-enter",
                                isPending && "opacity-50",
                                isCurrentlySwitching && "bg-blue-50/60 animate-pulse"
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex justify-start items-center gap-3 font-medium">
                                <div className={cn(
                                    "transition-transform duration-200 ease-out hover:scale-110",
                                    isCurrentlySwitching && "animate-pulse"
                                )}>
                                    <WorkspaceAvatar image={workspace.imageUrl} name={workspace.name} />
                                </div>
                                <div className="flex items-center gap-2 flex-1">
                                    <span className="truncate text-sm text-slate-700 transition-colors duration-200">
                                        {workspace.name}
                                    </span>
                                    {isCurrentlySwitching && (
                                        <Loader2 className="h-3 w-3 animate-spin text-blue-500 flex-shrink-0" />
                                    )}
                                </div>
                            </div>
                        </SelectItem>
                    );
                })
             )}
            </SelectContent>
           </Select>
        </div>
    );
};
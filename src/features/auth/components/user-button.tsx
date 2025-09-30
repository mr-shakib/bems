"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";

import { DottedSeparator } from "../../../components/dotted-separator"; 

import { useLogout } from "@/features/auth/api/use-logout";
import { useCurrent } from "@/features/auth/api/use-current";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const UserButton = () => {
    const { data: user, isLoading } = useCurrent();
    const { mutate: logout } = useLogout();
    const workspaceId = useWorkspaceId();
    const [userAvatar, setUserAvatar] = useState<string>("");

    // Load user avatar from localStorage
    useEffect(() => {
        if (user) {
            const savedAvatar = localStorage.getItem(`user-avatar-${user.$id}`);
            if (savedAvatar) {
                setUserAvatar(savedAvatar);
            }
        }
    }, [user]);

    if (isLoading) {
        return (
        <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
            <div className="relative w-4 h-4">
                <div className="w-4 h-4 border border-slate-200 rounded-full"></div>
                <div className="absolute inset-0 w-4 h-4 border border-slate-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            </div>
        );
    }

    if(!user){
        return null;
    }

    const { name, email } = user;

   const avatarFallback = name
   ? name.charAt(0).toUpperCase()
   : email.charAt(0).toUpperCase() ?? "N";

   return(
    <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="outline-none relative">
            <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
                {userAvatar ? (
                    <img 
                        src={userAvatar} 
                        alt={user.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <AvatarFallback className="bg-neutral-200 text-neutral-500 font-medium flex items-center justify-center">
                        { avatarFallback } 
                    </AvatarFallback>
                )}
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" className="w-60" sideOffset={10}>
            <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
                <Avatar className="size-[52px] border border-neutral-300">
                    {userAvatar ? (
                        <img 
                            src={userAvatar} 
                            alt={user.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <AvatarFallback className="bg-neutral-200 text-xl font-medium flex items-center justify-center">
                            { avatarFallback } 
                        </AvatarFallback>
                    )}
                </Avatar>
                <div className="flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-neutral-900">
                        { name || "User"}
                    </p>
                    <p className="text-xs text-neutral-500">
                        { email }
                    </p>
                </div>
            </div>
            <DottedSeparator className="mb-1"/>
            <DropdownMenuItem asChild className="h-10 flex items-center justify-center font-medium cursor-pointer">
                <Link href={`/workspaces/${workspaceId}/profile`}>
                    <User className="size-4 mr-2" />
                    Profile
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
            onClick={() => logout()}
            className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer">
                <LogOut className="size-4 mr-2" />
                Log out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
   );
};
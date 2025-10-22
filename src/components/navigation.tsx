"use client";

import { Settings, UserIcon, Home, CheckCircle2 } from "lucide-react";
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from "react-icons/go";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

const routes = [
    {
        label: "Home",
        href: "",
        icon: GoHome,
        activeIcon: GoHomeFill,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        hoverColor: "hover:bg-blue-50/80"
    },
    {
        label: "My Tasks",
        href: "/tasks",
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill,
        color: "text-green-600",
        bgColor: "bg-green-50",
        hoverColor: "hover:bg-green-50/80"
    },
    {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        activeIcon: Settings,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        hoverColor: "hover:bg-purple-50/80"
    },
    {
        label: "Members",
        href: "/members",
        icon: UserIcon,
        activeIcon: UserIcon,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        hoverColor: "hover:bg-orange-50/80"
    }
];


export const Navigation = () => {
    const workspaceId = useWorkspaceId();
    const pathname = usePathname();

    return(
        <div className="space-y-1">
            <div className="flex items-center gap-2 px-2 mb-3">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Navigation</p>
            </div>

            <ul className="space-y-1">
                {routes.map((item) => {
                    const fullHref = `/workspaces/${workspaceId}${item.href}`
                    const isActive = pathname === fullHref;
                    const Icon = isActive ? item.activeIcon : item.icon;

                    return(
                        <li key={item.href}>
                            <Link href={fullHref} className="block">
                                <div className={cn(
                                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium",
                                    "transition-colors duration-150 ease-out border border-transparent",
                                    "hover:shadow-md hover:shadow-black/5 hover:scale-[1.01]",
                                    "active:scale-[0.99] active:transition-transform active:duration-75",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                                    isActive
                                        ? `${item.bgColor} ${item.color} border-slate-200/60 shadow-md scale-[1.01]`
                                        : `text-slate-600 hover:text-slate-900 ${item.hoverColor} hover:border-slate-200/50`
                                )}>
                                    <div className={cn(
                                        "relative z-10 flex items-center justify-center w-8 h-8 rounded-lg",
                                        "transition-colors duration-150 ease-out",
                                        isActive
                                            ? `${item.bgColor} ${item.color} shadow-sm`
                                            : "text-slate-500 group-hover:text-slate-700 group-hover:bg-white/60"
                                    )}>
                                        <Icon className={cn(
                                            "w-4 h-4 transition-colors duration-150 ease-out",
                                            isActive && "drop-shadow-sm"
                                        )} />
                                    </div>
                                    <span className={cn(
                                        "relative z-10 text-sm font-medium transition-colors duration-150 ease-out",
                                        isActive && "font-semibold drop-shadow-sm"
                                    )}>
                                        {item.label}
                                    </span>
                                    {isActive && (
                                        <div className="relative z-10 ml-auto">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full animate-pulse-slow shadow-sm",
                                                item.color.replace('text-', 'bg-'),
                                                "animate-fade-in"
                                            )} />
                                        </div>
                                    )}
                                    

                                </div>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};
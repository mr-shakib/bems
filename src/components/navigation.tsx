import { Settings, UserIcon } from "lucide-react";
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from "react-icons/go";
import Link from "next/link";
import { cn } from "@/lib/utils";

const routes = [
    {
        label: "Home",
        path: "/",
        icon: GoHome,
        activeIcon: GoHomeFill,
    },
    {
        label: "My Tasks",
        path: "/tasks",
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill,
    },
    {
        label: "Settings",
        path: "/settings",
        icon: Settings,
        activeIcon: Settings,
    },
    {
        label: "Members",
        path: "/members",
        icon: UserIcon,
        activeIcon: UserIcon,
    }
];


export const Navigation = () => {
    return(
        <ul className="flex flex-col">
            {routes.map((item) => {
                const isActive = false;
                const Icon = isActive ? item.activeIcon : item.icon;
                return(
                    <Link key={item.path} href={item.path}>
                        <div className={cn(
                            "flex items-center p-2.5 gap-2.5 rounded-md font-medium hover:text-primary transition text-neutrals-500",
                            isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                        )}>
                            <Icon className="size-5 text-neutrals-500" />
                            {item.label}
                        </div>
                    </Link>
                )
        })}
        </ul>
    );
};
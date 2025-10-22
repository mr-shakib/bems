"use client"

import { MenuIcon} from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Sidebar } from "./sidebar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const MobileSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="secondary"
                    className="lg:hidden hover:bg-white/10 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95"
                >
                    <MenuIcon className="size-4 text-neutral-500 hover:text-white transition-all duration-300 ease-out transform hover:rotate-180"/>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="p-0 w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 backdrop-blur-md animate-slide-in-left"
            >
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <Sidebar/>
                </div>
            </SheetContent>
        </Sheet>
    );
};

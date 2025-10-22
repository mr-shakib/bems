import Link from "next/link";

import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Projects } from "./projects";
import { BemsLogo } from "./bems-logo";

export const Sidebar = () => {
    return (
        <aside className="h-full bg-neutral-100 p-3 sm:p-4 w-full transition-all duration-300 ease-out">
            <div className="animate-fade-in">
                <Link href="/" className="block smooth-hover">
                    <BemsLogo size="lg" className="w-32 sm:w-36 md:w-40 transition-all duration-300" />
                </Link>
            </div>
            
            <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                <DottedSeparator className="my-3 sm:my-4" />
            </div>
            
            <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                <WorkspaceSwitcher />
            </div>
            
            <div className="animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                <DottedSeparator className="my-3 sm:my-4" />
            </div>
            
            <div className="animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                <Navigation />
            </div>
            
            <div className="animate-slide-in-left" style={{ animationDelay: '0.5s' }}>
                <DottedSeparator className="my-3 sm:my-4" />
            </div>
            
            <div className="animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                <Projects/>
            </div>
        </aside>
    );
};
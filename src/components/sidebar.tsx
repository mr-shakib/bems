import Link from "next/link";

import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Projects } from "./projects";
import { BemsLogo } from "./bems-logo";

export const Sidebar = () => {
    return (
        <aside className="h-full bg-neutral-100 p-3 sm:p-4 w-full">
            <Link href="/">
                <BemsLogo 
                    size="lg"
                    className="w-32 sm:w-36 md:w-40"
                />
            </Link>
            <DottedSeparator className="my-3 sm:my-4"/>
            <WorkspaceSwitcher />
            <DottedSeparator className="my-3 sm:my-4"/>
            <Navigation />
            <DottedSeparator className="my-3 sm:my-4"/>
            <Projects/>
        </aside>
    );
};
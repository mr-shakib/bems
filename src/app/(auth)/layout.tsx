"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BemsLogo } from "@/components/bems-logo";


interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    const pathname = usePathname();
    const isSignIn = pathname === "/sign-in"
    
    return(
        <main className="bg-neutral-100 min-h-screen">
            <div className="mx-auto max-w-screen-2xl p-4 sm:p-6 lg:p-8">
                <nav className="flex justify-between items-center mb-4 sm:mb-6">
                    <BemsLogo size="lg" className="w-24 sm:w-32 md:w-38" />
                    <Button asChild variant="secondary" size="sm" className="h-8 sm:h-9 px-3 sm:px-4 text-sm">
                        <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
                            {isSignIn ? "Sign Up" : "Login"}
                        </Link>
                    </Button>
                </nav>
                <div className="flex flex-col items-center justify-center pt-2 sm:pt-4 md:pt-8 lg:pt-14">
                    {children}
                </div>
            </div>
        </main>
    );
}

export default AuthLayout;
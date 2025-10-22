"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface RouteLoadingListenerProps {
  children: React.ReactNode;
}

export const RouteLoadingListener = ({ children }: RouteLoadingListenerProps) => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start loading animation
    setIsLoading(true);
    setProgress(0);

    // Simulate loading progress
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressTimer);
          return 90;
        }
        return prev + Math.random() * 30;
      });
    }, 100);

    // Complete loading after a short delay
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    }, 300);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [pathname]);

  return (
    <>
      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:200%_100%] animate-shimmer">
            <div 
              className="h-full bg-white/30 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Page Content with Loading State */}
      <div className={cn(
        "transition-all duration-300 ease-out",
        isLoading ? "opacity-90 scale-[0.99]" : "opacity-100 scale-100"
      )}>
        {children}
      </div>
    </>
  );
};

// Loading Skeleton for Navigation Items
export const NavigationSkeleton = () => {
  return (
    <div className="space-y-1 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 bg-slate-200 rounded-lg animate-shimmer" />
          <div className="h-4 bg-slate-200 rounded-md flex-1 animate-shimmer" />
        </div>
      ))}
    </div>
  );
};

// Loading Skeleton for Projects
export const ProjectsSkeleton = () => {
  return (
    <div className="space-y-1 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 bg-slate-200 rounded-lg animate-shimmer" />
          <div className="h-4 bg-slate-200 rounded-md flex-1 animate-shimmer" />
        </div>
      ))}
    </div>
  );
};
"use client";

import { Skeleton } from "@/components/ui/skeleton";

const LoadingPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <div className="w-full max-w-4xl space-y-6 p-6">
        <Skeleton className="h-8 w-64 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadingPage;
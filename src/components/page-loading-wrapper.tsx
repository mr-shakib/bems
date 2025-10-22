"use client";

import { ReactNode, useState } from "react";
import { 
  SkeletonWorkspaceDashboard,
  SkeletonProjectGrid,
  SkeletonTaskList,
  SkeletonKanbanBoard,
  SkeletonSettings,
  SkeletonProfile,
  SkeletonDashboard
} from "@/components/ui/skeleton";

interface PageLoadingWrapperProps {
  children: ReactNode;
  isLoading: boolean;
  type?: 'dashboard' | 'workspace' | 'projects' | 'tasks' | 'kanban' | 'settings' | 'profile' | 'default';
  className?: string;
}

export const PageLoadingWrapper = ({ 
  children, 
  isLoading, 
  type = 'default',
  className = ""
}: PageLoadingWrapperProps) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  const renderSkeleton = () => {
    switch (type) {
      case 'dashboard':
        return <SkeletonDashboard className={className} />;
      case 'workspace':
        return <SkeletonWorkspaceDashboard className={className} />;
      case 'projects':
        return <SkeletonProjectGrid className={className} />;
      case 'tasks':
        return <SkeletonTaskList className={className} />;
      case 'kanban':
        return <SkeletonKanbanBoard className={className} />;
      case 'settings':
        return <SkeletonSettings className={className} />;
      case 'profile':
        return <SkeletonProfile className={className} />;
      default:
        return <SkeletonDashboard className={className} />;
    }
  };

  return (
    <div className="animate-in fade-in-0 duration-200">
      {renderSkeleton()}
    </div>
  );
};

// Hook for managing loading states
export const usePageLoading = (initialLoading = true) => {
  const [isLoading, setIsLoading] = useState(initialLoading);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading,
    setIsLoading
  };
};
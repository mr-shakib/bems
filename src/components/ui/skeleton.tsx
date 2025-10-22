import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'rounded' | 'circular';
  animation?: 'pulse' | 'shimmer' | 'wave';
}

function Skeleton({
  className,
  variant = 'default',
  animation = 'shimmer',
  ...props
}: SkeletonProps) {
  const baseClasses = "bg-muted";
  
  const variantClasses = {
    default: "rounded-md",
    rounded: "rounded-lg",
    circular: "rounded-full"
  };

  const animationClasses = {
    pulse: "animate-pulse",
    shimmer: "animate-shimmer skeleton",
    wave: "animate-pulse-slow"
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      {...props}
    />
  );
}

// Specialized skeleton components
function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 space-y-3 border rounded-lg", className)} {...props}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

function SkeletonAvatar({ className, size = "md", ...props }: React.HTMLAttributes<HTMLDivElement> & { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return (
    <Skeleton
      variant="circular"
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  );
}

function SkeletonText({ 
  lines = 3, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

function SkeletonButton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      className={cn("h-10 w-24 rounded-md", className)}
      {...props}
    />
  );
}

function SkeletonTable({ 
  rows = 5, 
  columns = 4, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { rows?: number; columns?: number }) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

function SkeletonNavigation({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton variant="circular" className="h-6 w-6" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

function SkeletonDashboard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonCard />
        </div>
        <div>
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonText,
  SkeletonButton,
  SkeletonTable,
  SkeletonNavigation,
  SkeletonDashboard,
};

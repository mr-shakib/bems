"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className }: PageTransitionProps) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Start exit animation
    setIsVisible(false);
    
    const timer = setTimeout(() => {
      // Update children and start enter animation
      setDisplayChildren(children);
      setIsVisible(true);
    }, 75); // Reduced transition time

    return () => clearTimeout(timer);
  }, [pathname, children]);

  useEffect(() => {
    // Initial mount
    setIsVisible(true);
  }, []);

  return (
    <div
      className={cn(
        "transition-opacity duration-150 ease-out",
        isVisible 
          ? "opacity-100" 
          : "opacity-0",
        className
      )}
    >
      {displayChildren}
    </div>
  );
};

// Staggered animation for lists
interface StaggeredAnimationProps {
  children: React.ReactNode[];
  className?: string;
  delay?: number;
}

export const StaggeredAnimation = ({ 
  children, 
  className, 
  delay = 50 
}: StaggeredAnimationProps) => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    children.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleItems(prev => [...prev, index]);
      }, index * delay);
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [children, delay]);

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            "transition-opacity duration-200 ease-out",
            visibleItems.includes(index)
              ? "opacity-100"
              : "opacity-0"
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Fade in animation for individual elements
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export const FadeIn = ({ 
  children, 
  delay = 0, 
  direction = 'up',
  className 
}: FadeInProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "transition-opacity duration-200 ease-out",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
};

// Scale in animation
interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const ScaleIn = ({ children, delay = 0, className }: ScaleInProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "transition-opacity duration-200 ease-out",
        isVisible 
          ? "opacity-100" 
          : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
};
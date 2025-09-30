"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TopLoadingBar } from "@/components/loading-components";

export const GlobalNavigationLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show loading when pathname changes (navigation starts)
    setIsLoading(true);

    // Hide loading after a short delay to simulate page load
    // In a real app, this would be tied to actual data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // Reduced timing for better UX

    return () => clearTimeout(timer);
  }, [pathname]);

  return <TopLoadingBar isVisible={isLoading} />;
};
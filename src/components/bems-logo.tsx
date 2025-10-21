import Image from "next/image";
import { cn } from "@/lib/utils";

interface BemsLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const BemsLogo = ({ className, size = "md" }: BemsLogoProps) => {
  const sizeClasses = {
    sm: { width: 60, height: 24 },
    md: { width: 90, height: 36 }, 
    lg: { width: 120, height: 48 },
    xl: { width: 150, height: 60 }
  };

  const { width, height } = sizeClasses[size];

  return (
    <div className={cn("select-none flex items-center", className)}>
      <Image
        src="/assets/images/logo_bems.png"
        alt="BEMS Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );
};
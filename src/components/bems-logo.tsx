import { cn } from "@/lib/utils";

interface BemsLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const BemsLogo = ({ className, size = "md" }: BemsLogoProps) => {
  const sizeClasses = {
    sm: "text-lg font-bold",
    md: "text-2xl font-bold", 
    lg: "text-3xl font-bold",
    xl: "text-4xl font-bold"
  };

  return (
    <div className={cn("select-none", className)}>
      <span 
        className={cn(
          "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent",
          sizeClasses[size]
        )}
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: "0.05em"
        }}
      >
        bems
      </span>
    </div>
  );
};
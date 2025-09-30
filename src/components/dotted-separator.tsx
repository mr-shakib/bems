import { cn } from "@/lib/utils";

interface DottedSeparatorProps {
  className?: string;
  color?: string;
  height?: string;
  dotSize?: string;
  gapSize?: string;
  direction?: "horizontal" | "vertical";
}

export const DottedSeparator = ({
  className,
  color = "linear-gradient(90deg, #64748b 0%, #94a3b8 50%, #64748b 100%)",
  height = "2px",
  dotSize = "2px",
  gapSize = "6px",
  direction = "horizontal",
}: DottedSeparatorProps) => {
  const isHorizontal = direction === "horizontal";

  // Convert to numbers (removing px) for calculation
  const dotNum = parseInt(dotSize, 10);
  const gapNum = parseInt(gapSize, 10);

  return (
    <div
      className={cn(
        isHorizontal
          ? "w-full flex items-center"
          : "h-full flex flex-col items-center",
        className
      )}
    >
      <div
        className={cn(
          "transition-all duration-300 hover:opacity-80",
          isHorizontal ? "flex-grow" : "flex-grow-0"
        )}
        style={{
          width: isHorizontal ? "100%" : height,
          height: isHorizontal ? height : "100%",
          backgroundImage: `radial-gradient(circle, ${color.includes('gradient') ? 'transparent' : color} 25%, transparent 25%)`,
          backgroundSize: isHorizontal
            ? `${dotNum + gapNum}px ${height}`
            : `${height} ${dotNum + gapNum}px`,
          backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient overlay for modern look */}
        {color.includes('gradient') && (
          <div
            className="w-full h-full opacity-60"
            style={{
              background: color,
              maskImage: `radial-gradient(circle, black 25%, transparent 25%)`,
              maskSize: isHorizontal
                ? `${dotNum + gapNum}px ${height}`
                : `${height} ${dotNum + gapNum}px`,
              maskRepeat: isHorizontal ? "repeat-x" : "repeat-y",
              maskPosition: "center",
              WebkitMaskImage: `radial-gradient(circle, black 25%, transparent 25%)`,
              WebkitMaskSize: isHorizontal
                ? `${dotNum + gapNum}px ${height}`
                : `${height} ${dotNum + gapNum}px`,
              WebkitMaskRepeat: isHorizontal ? "repeat-x" : "repeat-y",
              WebkitMaskPosition: "center",
            }}
          />
        )}
      </div>
    </div>
  );
};

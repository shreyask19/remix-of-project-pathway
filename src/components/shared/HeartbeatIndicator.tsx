import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeartbeatIndicatorProps {
  avgReviewTimeHours: number | null | undefined;
  size?: "sm" | "md";
  showLabel?: boolean;
}

const HeartbeatIndicator = ({ 
  avgReviewTimeHours, 
  size = "sm",
  showLabel = false 
}: HeartbeatIndicatorProps) => {
  // Default to neutral if no data
  const hours = avgReviewTimeHours ?? 0;
  
  // Determine status based on review time
  const getStatus = () => {
    if (hours === 0) return { color: "bg-muted-foreground", label: "New", description: "No review data yet" };
    if (hours < 6) return { color: "bg-success", label: "Fast", description: `Reviews in ~${Math.round(hours)}h` };
    if (hours < 24) return { color: "bg-warning", label: "Active", description: `Reviews in ~${Math.round(hours)}h` };
    if (hours < 72) return { color: "bg-orange-500", label: "Moderate", description: `Reviews in ~${Math.round(hours)}h` };
    return { color: "bg-destructive", label: "Slow", description: `Reviews in ~${Math.round(hours)}h` };
  };

  const status = getStatus();
  const dotSize = size === "sm" ? "w-2 h-2" : "w-3 h-3";

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1.5 cursor-help">
            <motion.div
              className={`${dotSize} rounded-full ${status.color}`}
              animate={{
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {showLabel && (
              <span className="text-xs text-muted-foreground">{status.label}</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <p className="font-medium">{status.label}</p>
          <p className="text-muted-foreground">{status.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HeartbeatIndicator;

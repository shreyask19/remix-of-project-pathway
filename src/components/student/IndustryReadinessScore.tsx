import { motion } from "framer-motion";
import { useMemo } from "react";
import { TrendingUp, AlertCircle, Sparkles, Target } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface IndustryReadinessScoreProps {
  score: number;
  projectsCompleted: number;
  breakdown?: {
    difficultyScore: number;
    gradeScore: number;
    authenticityScore: number;
    diversityScore: number;
  };
  size?: "sm" | "md" | "lg";
  showImproveHint?: boolean;
  className?: string;
}

const IndustryReadinessScore = ({
  score,
  projectsCompleted,
  breakdown,
  size = "md",
  showImproveHint = true,
  className,
}: IndustryReadinessScoreProps) => {
  const minProjectsRequired = 3;
  const isBuilding = projectsCompleted < minProjectsRequired;

  // Size configurations
  const sizeConfig = {
    sm: { outer: 80, stroke: 6, fontSize: "text-lg", labelSize: "text-[8px]" },
    md: { outer: 120, stroke: 8, fontSize: "text-2xl", labelSize: "text-xs" },
    lg: { outer: 160, stroke: 10, fontSize: "text-4xl", labelSize: "text-sm" },
  };

  const config = sizeConfig[size];
  const radius = (config.outer - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = isBuilding ? 0 : Math.min(score, 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Color based on score
  const getColor = (value: number) => {
    if (value < 40) return { stroke: "stroke-destructive", text: "text-destructive", bg: "bg-destructive/10" };
    if (value < 70) return { stroke: "stroke-warning", text: "text-warning", bg: "bg-warning/10" };
    return { stroke: "stroke-success", text: "text-success", bg: "bg-success/10" };
  };

  const colors = getColor(score);

  // Improvement suggestions based on weakest area
  const improvementHint = useMemo(() => {
    if (!breakdown || isBuilding) return null;

    const scores = [
      { key: "difficulty", label: "Project Difficulty", value: breakdown.difficultyScore, tip: "Take on harder challenges to boost your score" },
      { key: "grade", label: "Average Grade", value: breakdown.gradeScore, tip: "Focus on quality submissions to improve grades" },
      { key: "authenticity", label: "Authenticity", value: breakdown.authenticityScore, tip: "Ensure thorough video walkthroughs and code commits" },
      { key: "diversity", label: "Skill Diversity", value: breakdown.diversityScore, tip: "Explore projects in different categories" },
    ];

    const weakest = scores.reduce((min, s) => (s.value < min.value ? s : min), scores[0]);
    return weakest.tip;
  }, [breakdown, isBuilding]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Circular Gauge */}
      <div className="relative" style={{ width: config.outer, height: config.outer }}>
        <svg
          className="transform -rotate-90"
          width={config.outer}
          height={config.outer}
        >
          {/* Background circle */}
          <circle
            cx={config.outer / 2}
            cy={config.outer / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            className="text-secondary"
          />
          {/* Progress circle */}
          {!isBuilding && (
            <motion.circle
              cx={config.outer / 2}
              cy={config.outer / 2}
              r={radius}
              fill="none"
              strokeWidth={config.stroke}
              strokeLinecap="round"
              className={colors.stroke}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          )}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isBuilding ? (
            <>
              <Sparkles className={cn("text-muted-foreground", size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8")} />
              <span className={cn("font-medium text-muted-foreground mt-1", config.labelSize)}>
                Building...
              </span>
            </>
          ) : (
            <>
              <motion.span
                className={cn("font-bold", colors.text, config.fontSize)}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {score}
              </motion.span>
              <span className={cn("text-muted-foreground", config.labelSize)}>
                out of 100
              </span>
            </>
          )}
        </div>
      </div>

      {/* Label */}
      <p className={cn("font-semibold text-foreground mt-2", size === "sm" ? "text-xs" : "text-sm")}>
        Industry Readiness
      </p>

      {/* Breakdown Tooltip */}
      {breakdown && !isBuilding && size !== "sm" && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="mt-2 text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                <TrendingUp className="w-3 h-3" />
                View Breakdown
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="w-64 p-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Difficulty (30%)</span>
                  <span className={getColor(breakdown.difficultyScore).text}>
                    {breakdown.difficultyScore}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Grade Avg (30%)</span>
                  <span className={getColor(breakdown.gradeScore).text}>
                    {breakdown.gradeScore}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Authenticity (20%)</span>
                  <span className={getColor(breakdown.authenticityScore).text}>
                    {breakdown.authenticityScore}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Diversity (20%)</span>
                  <span className={getColor(breakdown.diversityScore).text}>
                    {breakdown.diversityScore}%
                  </span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Building State Info */}
      {isBuilding && size !== "sm" && (
        <p className="mt-2 text-xs text-muted-foreground text-center max-w-[200px]">
          Complete {minProjectsRequired - projectsCompleted} more project{minProjectsRequired - projectsCompleted !== 1 ? "s" : ""} to unlock your score
        </p>
      )}

      {/* Improvement Hint */}
      {showImproveHint && improvementHint && !isBuilding && size !== "sm" && (
        <div className="mt-3 flex items-start gap-2 p-2 rounded-lg bg-primary/5 max-w-[240px]">
          <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">{improvementHint}</p>
        </div>
      )}
    </div>
  );
};

export default IndustryReadinessScore;

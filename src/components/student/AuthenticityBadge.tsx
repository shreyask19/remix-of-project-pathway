import { Shield, ShieldCheck, ShieldAlert, ShieldX, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { AuthenticityBreakdown } from "@/lib/transformers";

interface AuthenticityBadgeProps {
  score: number | null;
  breakdown?: AuthenticityBreakdown | null;
  flagged?: boolean;
  flagReasons?: string[];
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

const AuthenticityBadge = ({ 
  score, 
  breakdown, 
  flagged = false,
  flagReasons = [],
  size = "md",
  showDetails = true,
}: AuthenticityBadgeProps) => {
  if (score === null || score === undefined) {
    return (
      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
        <Shield className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
        <span>Not verified</span>
      </div>
    );
  }

  const getScoreColor = () => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  const getScoreBgColor = () => {
    if (score >= 80) return "bg-success/10";
    if (score >= 60) return "bg-primary/10";
    if (score >= 40) return "bg-warning/10";
    return "bg-destructive/10";
  };

  const getScoreLabel = () => {
    if (score >= 80) return "High Trust";
    if (score >= 60) return "Verified";
    if (score >= 40) return "Review Needed";
    return "Low Trust";
  };

  const getIcon = () => {
    const iconSize = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4";
    if (flagged) return <ShieldAlert className={`${iconSize} ${getScoreColor()}`} />;
    if (score >= 80) return <ShieldCheck className={`${iconSize} ${getScoreColor()}`} />;
    if (score >= 60) return <ShieldCheck className={`${iconSize} ${getScoreColor()}`} />;
    if (score >= 40) return <ShieldAlert className={`${iconSize} ${getScoreColor()}`} />;
    return <ShieldX className={`${iconSize} ${getScoreColor()}`} />;
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const badge = (
    <div className={`inline-flex items-center gap-1.5 rounded-xl ${getScoreBgColor()} ${getScoreColor()} ${sizeClasses[size]} font-medium`}>
      {getIcon()}
      <span>{score}%</span>
      {size !== "sm" && <span className="opacity-80">· {getScoreLabel()}</span>}
    </div>
  );

  if (!showDetails || !breakdown) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">{badge}</div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Shield className="w-4 h-4" />
              Authenticity Breakdown
            </div>
            
            <div className="space-y-2 text-sm">
              {breakdown.github && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">GitHub Activity</span>
                  <span className={breakdown.github.score >= 25 ? "text-success" : breakdown.github.score >= 15 ? "text-warning" : "text-destructive"}>
                    {breakdown.github.score}/40
                  </span>
                </div>
              )}
              {breakdown.video && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Video Walkthrough</span>
                  <span className={breakdown.video.score >= 20 ? "text-success" : breakdown.video.score >= 10 ? "text-warning" : "text-destructive"}>
                    {breakdown.video.score}/30
                  </span>
                </div>
              )}
              {breakdown.timing && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Submission Timing</span>
                  <span className={breakdown.timing.score >= 20 ? "text-success" : breakdown.timing.score >= 10 ? "text-warning" : "text-destructive"}>
                    {breakdown.timing.score}/30
                  </span>
                </div>
              )}
            </div>

            {flagged && flagReasons.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-destructive font-medium mb-1">⚠️ Flagged for Review</p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {flagReasons.map((reason, i) => (
                    <li key={i}>• {reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AuthenticityBadge;

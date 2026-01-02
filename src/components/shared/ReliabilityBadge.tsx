import { ShieldCheck, Clock, Briefcase, Award } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStudentBadges, type StudentBadges } from "@/hooks/useReliabilityBadge";

interface ReliabilityBadgeProps {
  studentId?: string;
  badges?: StudentBadges;
  variant?: "small" | "large";
  showIfEmpty?: boolean;
}

const ReliabilityBadge = ({ 
  studentId, 
  badges: propBadges,
  variant = "small",
  showIfEmpty = false 
}: ReliabilityBadgeProps) => {
  const { badges: fetchedBadges, isLoading } = useStudentBadges(propBadges ? undefined : studentId);
  const badges = propBadges || fetchedBadges;

  if (isLoading) {
    return null;
  }

  if (badges.total === 0 && !showIfEmpty) {
    return null;
  }

  const badgeDetails = [
    { type: "punctuality", count: badges.punctuality, icon: Clock, label: "Punctuality" },
    { type: "professionalism", count: badges.professionalism, icon: Briefcase, label: "Professionalism" },
    { type: "reliability", count: badges.reliability, icon: ShieldCheck, label: "Reliability" },
  ].filter(b => b.count > 0);

  if (variant === "large") {
    return (
      <div className="flex flex-wrap gap-2">
        {badges.total === 0 ? (
          <span className="text-sm text-muted-foreground">No badges yet</span>
        ) : (
          <>
            {badgeDetails.map(({ type, count, icon: Icon, label }) => (
              <div
                key={type}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {count > 1 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-success/20 text-xs">
                    ×{count}
                  </span>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  // Small variant - inline badge
  if (badges.total === 0) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium cursor-help">
            <ShieldCheck className="w-3 h-3" />
            <span>{badges.total}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-3">
          <div className="space-y-2">
            <p className="font-medium text-foreground flex items-center gap-1.5">
              <Award className="w-4 h-4 text-success" />
              Reliability Badges ({badges.total})
            </p>
            <div className="space-y-1 text-sm">
              {badgeDetails.map(({ type, count, icon: Icon, label }) => (
                <div key={type} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </span>
                  <span className="font-medium text-foreground">{count}</span>
                </div>
              ))}
            </div>
            {badges.total >= 3 && (
              <p className="text-xs text-success pt-1 border-t border-border">
                ✓ Highly Reliable Student
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ReliabilityBadge;

import { GitBranch, GitCommit, Calendar, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AuthenticityIndicatorsProps {
  githubUrl: string | null;
  submittedAt: string | null;
}

const AuthenticityIndicators = ({ githubUrl, submittedAt }: AuthenticityIndicatorsProps) => {
  // In a production app, this would call GitHub API via an edge function
  // For now, we'll show placeholder indicators with realistic UI
  
  const isGitHubUrl = githubUrl?.includes("github.com");
  
  // Simulated data - in production, fetch from GitHub API
  const repoData = {
    ageInDays: null as number | null, // Would be calculated from repo created_at
    commitCount: null as number | null, // Would be fetched from API
    lastCommit: null as string | null, // Would show relative time
    hasReadme: null as boolean | null,
  };

  // Placeholder indicators
  const indicators = [
    {
      icon: Calendar,
      label: "Repository Age",
      value: repoData.ageInDays !== null 
        ? `${repoData.ageInDays} days old` 
        : "Unknown",
      status: repoData.ageInDays !== null && repoData.ageInDays > 7 
        ? "good" 
        : repoData.ageInDays !== null && repoData.ageInDays < 3 
        ? "warning" 
        : "unknown",
      tooltip: "Older repositories with consistent commit history suggest genuine work",
    },
    {
      icon: GitCommit,
      label: "Commit Count",
      value: repoData.commitCount !== null 
        ? `${repoData.commitCount} commits` 
        : "Unknown",
      status: repoData.commitCount !== null && repoData.commitCount >= 10 
        ? "good" 
        : repoData.commitCount !== null && repoData.commitCount < 5 
        ? "warning" 
        : "unknown",
      tooltip: "Multiple commits over time indicate iterative development",
    },
    {
      icon: Clock,
      label: "Last Activity",
      value: repoData.lastCommit || "Unknown",
      status: "unknown" as const,
      tooltip: "Recent activity shows active development",
    },
    {
      icon: GitBranch,
      label: "Branch Activity",
      value: "Pending verification",
      status: "unknown" as const,
      tooltip: "Multiple branches can indicate proper development workflow",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-success";
      case "warning":
        return "text-warning";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle2 className="w-3 h-3 text-success" />;
      case "warning":
        return <AlertTriangle className="w-3 h-3 text-warning" />;
      default:
        return null;
    }
  };

  if (!isGitHubUrl) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <GitBranch className="w-4 h-4 text-foreground" />
          <h4 className="text-sm font-medium text-foreground">Authenticity Indicators</h4>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary ml-auto">
            Coming Soon
          </span>
        </div>
        
        <p className="text-xs text-muted-foreground mb-4">
          GitHub repository metrics will be analyzed to verify project authenticity.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {indicators.map((indicator) => (
            <Tooltip key={indicator.label}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 cursor-help">
                  <indicator.icon className={`w-4 h-4 ${getStatusColor(indicator.status)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground truncate">{indicator.label}</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-medium text-foreground truncate">{indicator.value}</p>
                      {getStatusIcon(indicator.status)}
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">{indicator.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="mt-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Note:</span> Full GitHub analytics integration 
            is coming soon. This will help verify that submitted projects represent genuine student work.
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AuthenticityIndicators;

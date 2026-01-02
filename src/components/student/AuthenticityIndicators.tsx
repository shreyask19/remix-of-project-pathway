import { useState, useEffect } from "react";
import { GitBranch, GitCommit, Calendar, Clock, Video, Shield, Loader2, RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { AuthenticityBreakdown } from "@/lib/transformers";
import AuthenticityBadge from "./AuthenticityBadge";

interface AuthenticityIndicatorsProps {
  submissionId?: string;
  githubUrl?: string | null;
  videoUrl?: string | null;
  submittedAt?: string | null;
  authenticityScore?: number | null;
  authenticityBreakdown?: AuthenticityBreakdown | null;
  flagged?: boolean;
  flagReasons?: string[];
  onVerificationComplete?: (result: any) => void;
}

const AuthenticityIndicators = ({ 
  submissionId,
  githubUrl, 
  videoUrl,
  submittedAt,
  authenticityScore,
  authenticityBreakdown,
  flagged = false,
  flagReasons = [],
  onVerificationComplete,
}: AuthenticityIndicatorsProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [score, setScore] = useState<number | null>(authenticityScore ?? null);
  const [breakdown, setBreakdown] = useState<AuthenticityBreakdown | null>(authenticityBreakdown ?? null);
  const [isFlagged, setIsFlagged] = useState(flagged);
  const [flags, setFlags] = useState<string[]>(flagReasons);

  useEffect(() => {
    setScore(authenticityScore ?? null);
    setBreakdown(authenticityBreakdown ?? null);
    setIsFlagged(flagged);
    setFlags(flagReasons);
  }, [authenticityScore, authenticityBreakdown, flagged, flagReasons]);

  const triggerVerification = async () => {
    if (!submissionId) return;
    
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-authenticity", {
        body: { submissionId },
      });

      if (error) throw error;

      setScore(data.score);
      setBreakdown(data.breakdown);
      setIsFlagged(data.flagged);
      setFlags(data.flagReasons || []);
      
      onVerificationComplete?.(data);
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const isGitHubUrl = githubUrl?.includes("github.com");

  // If we have a score, show the detailed breakdown
  if (score !== null && breakdown) {
    return (
      <TooltipProvider>
        <div className="p-4 rounded-xl bg-muted/50 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-foreground" />
              <h4 className="text-sm font-medium text-foreground">Authenticity Verification</h4>
            </div>
            <AuthenticityBadge 
              score={score} 
              breakdown={breakdown} 
              flagged={isFlagged}
              flagReasons={flags}
              size="md"
              showDetails={false}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* GitHub Score */}
            <div className="p-3 rounded-xl bg-background/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <GitCommit className={`w-4 h-4 ${breakdown.github?.score && breakdown.github.score >= 25 ? "text-success" : breakdown.github?.score && breakdown.github.score >= 15 ? "text-warning" : "text-destructive"}`} />
                <span className="text-xs font-medium text-foreground">GitHub</span>
              </div>
              <p className="text-lg font-bold text-foreground">{breakdown.github?.score ?? 0}/40</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{breakdown.github?.details}</p>
            </div>

            {/* Video Score */}
            <div className="p-3 rounded-xl bg-background/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Video className={`w-4 h-4 ${breakdown.video?.score && breakdown.video.score >= 20 ? "text-success" : breakdown.video?.score && breakdown.video.score >= 10 ? "text-warning" : "text-destructive"}`} />
                <span className="text-xs font-medium text-foreground">Video</span>
              </div>
              <p className="text-lg font-bold text-foreground">{breakdown.video?.score ?? 0}/30</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{breakdown.video?.details}</p>
            </div>

            {/* Timing Score */}
            <div className="p-3 rounded-xl bg-background/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className={`w-4 h-4 ${breakdown.timing?.score && breakdown.timing.score >= 20 ? "text-success" : breakdown.timing?.score && breakdown.timing.score >= 10 ? "text-warning" : "text-destructive"}`} />
                <span className="text-xs font-medium text-foreground">Timing</span>
              </div>
              <p className="text-lg font-bold text-foreground">{breakdown.timing?.score ?? 0}/30</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{breakdown.timing?.details}</p>
            </div>
          </div>

          {/* Flag Warning */}
          {isFlagged && flags.length > 0 && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 mb-3">
              <p className="text-xs font-medium text-destructive mb-1">⚠️ Flagged for Manual Review</p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {flags.map((reason, i) => (
                  <li key={i}>• {reason}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Re-verify Button */}
          {submissionId && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
              onClick={triggerVerification}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              Re-verify Authenticity
            </Button>
          )}
        </div>
      </TooltipProvider>
    );
  }

  // No score yet - show pending verification UI
  return (
    <TooltipProvider>
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-foreground" />
          <h4 className="text-sm font-medium text-foreground">Authenticity Verification</h4>
        </div>
        
        <p className="text-xs text-muted-foreground mb-4">
          Verify the authenticity of this submission by analyzing GitHub activity, video walkthrough, and submission timing.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 cursor-help">
                <GitCommit className={`w-4 h-4 ${isGitHubUrl ? "text-primary" : "text-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">GitHub</p>
                  <p className="text-xs font-medium text-foreground truncate">
                    {isGitHubUrl ? "Ready to verify" : "No GitHub URL"}
                  </p>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">Repository age, commit count, and activity patterns</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 cursor-help">
                <Video className={`w-4 h-4 ${videoUrl ? "text-primary" : "text-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Video</p>
                  <p className="text-xs font-medium text-foreground truncate">
                    {videoUrl ? "Ready to verify" : "No video URL"}
                  </p>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">Video walkthrough demonstrates understanding</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 cursor-help">
                <Clock className={`w-4 h-4 ${submittedAt ? "text-primary" : "text-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Timing</p>
                  <p className="text-xs font-medium text-foreground truncate">
                    {submittedAt ? "Ready to verify" : "Not submitted"}
                  </p>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">Reasonable development timeline</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 cursor-help">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Overall</p>
                  <p className="text-xs font-medium text-foreground truncate">Pending</p>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">Combined authenticity score</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {submissionId && (
          <Button 
            className="w-full gap-2"
            onClick={triggerVerification}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Verify Authenticity
              </>
            )}
          </Button>
        )}
      </div>
    </TooltipProvider>
  );
};

export default AuthenticityIndicators;

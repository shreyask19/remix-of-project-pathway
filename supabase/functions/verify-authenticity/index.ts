import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthenticityResult {
  overall: number;
  github: { score: number; details: string; data?: any };
  video: { score: number; details: string };
  timing: { score: number; details: string };
  flagReasons: string[];
}

interface GitHubRepoData {
  created_at: string;
  pushed_at: string;
  size: number;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
}

interface GitHubCommitData {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
}

// Extract owner and repo from GitHub URL
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/\?#]+)/,
    /github\.com:([^\/]+)\/([^\/\?#]+)\.git/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
    }
  }
  return null;
}

// Verify GitHub repository activity
async function verifyGitHubActivity(githubUrl: string): Promise<{ score: number; details: string; data?: any }> {
  console.log(`[GitHub] Verifying: ${githubUrl}`);
  
  const parsed = parseGitHubUrl(githubUrl);
  if (!parsed) {
    console.log("[GitHub] Invalid URL format");
    return { score: 0, details: "Invalid GitHub URL format" };
  }

  const { owner, repo } = parsed;
  console.log(`[GitHub] Parsed: owner=${owner}, repo=${repo}`);

  try {
    // Fetch repository info (public API, no auth needed)
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Heuristic-Authenticity-Checker",
      },
    });

    if (!repoResponse.ok) {
      console.log(`[GitHub] Repo fetch failed: ${repoResponse.status}`);
      if (repoResponse.status === 404) {
        return { score: 0, details: "Repository not found or is private" };
      }
      return { score: 10, details: "Could not verify repository" };
    }

    const repoData: GitHubRepoData = await repoResponse.json();
    console.log(`[GitHub] Repo data received: created_at=${repoData.created_at}`);

    // Fetch commits
    const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`, {
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Heuristic-Authenticity-Checker",
      },
    });

    let commitCount = 0;
    let commitSpan = 0;
    let uniqueAuthors = new Set<string>();

    if (commitsResponse.ok) {
      const commits: GitHubCommitData[] = await commitsResponse.json();
      commitCount = commits.length;
      
      commits.forEach(c => {
        if (c.commit?.author?.email) {
          uniqueAuthors.add(c.commit.author.email);
        }
      });

      if (commits.length >= 2) {
        const firstCommit = new Date(commits[commits.length - 1].commit.author.date);
        const lastCommit = new Date(commits[0].commit.author.date);
        commitSpan = Math.ceil((lastCommit.getTime() - firstCommit.getTime()) / (1000 * 60 * 60 * 24));
      }
    }

    console.log(`[GitHub] Commits: ${commitCount}, Span: ${commitSpan} days, Authors: ${uniqueAuthors.size}`);

    // Calculate score based on multiple factors
    let score = 0;
    const details: string[] = [];

    // Repository age (max 10 points)
    const repoCreatedAt = new Date(repoData.created_at);
    const repoAgeDays = Math.ceil((Date.now() - repoCreatedAt.getTime()) / (1000 * 60 * 60 * 24));
    if (repoAgeDays >= 7) {
      score += 10;
      details.push(`Repo created ${repoAgeDays} days ago`);
    } else if (repoAgeDays >= 3) {
      score += 5;
      details.push(`Repo only ${repoAgeDays} days old`);
    } else {
      details.push(`Suspicious: repo created just ${repoAgeDays} days ago`);
    }

    // Commit count (max 15 points)
    if (commitCount >= 20) {
      score += 15;
      details.push(`${commitCount}+ commits`);
    } else if (commitCount >= 10) {
      score += 10;
      details.push(`${commitCount} commits`);
    } else if (commitCount >= 5) {
      score += 5;
      details.push(`Only ${commitCount} commits`);
    } else {
      details.push(`Suspicious: only ${commitCount} commits`);
    }

    // Commit spread over time (max 10 points)
    if (commitSpan >= 7) {
      score += 10;
      details.push(`Development span: ${commitSpan} days`);
    } else if (commitSpan >= 3) {
      score += 5;
      details.push(`Short dev span: ${commitSpan} days`);
    } else if (commitCount > 0) {
      details.push(`Suspicious: all commits in ${commitSpan} days`);
    }

    // Repo size (max 5 points)
    if (repoData.size > 100) {
      score += 5;
      details.push(`Repo size: ${repoData.size}KB`);
    } else if (repoData.size > 50) {
      score += 3;
    }

    return {
      score: Math.min(score, 40), // Max 40 points for GitHub
      details: details.join(". "),
      data: {
        repoAgeDays,
        commitCount,
        commitSpan,
        uniqueAuthors: uniqueAuthors.size,
        repoSize: repoData.size,
      },
    };
  } catch (error) {
    console.error("[GitHub] Error:", error);
    return { score: 5, details: "Error verifying GitHub repository" };
  }
}

// Verify video presence
async function verifyVideoPresence(videoUrl: string | null): Promise<{ score: number; details: string }> {
  console.log(`[Video] Verifying: ${videoUrl}`);
  
  if (!videoUrl || !videoUrl.trim()) {
    return { score: 0, details: "No video walkthrough provided" };
  }

  // Check for known video platforms
  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const isLoom = videoUrl.includes("loom.com");
  const isVimeo = videoUrl.includes("vimeo.com");
  const isDrive = videoUrl.includes("drive.google.com");

  if (isYouTube || isLoom || isVimeo || isDrive) {
    console.log("[Video] Valid platform detected");
    return {
      score: 30,
      details: `Video walkthrough provided via ${isYouTube ? "YouTube" : isLoom ? "Loom" : isVimeo ? "Vimeo" : "Google Drive"}`,
    };
  }

  // Check if URL is accessible
  try {
    const response = await fetch(videoUrl, { method: "HEAD" });
    if (response.ok) {
      return { score: 25, details: "Video URL verified accessible" };
    }
    return { score: 10, details: "Video URL may not be accessible" };
  } catch {
    return { score: 15, details: "Video URL provided but could not verify" };
  }
}

// Verify submission timing
function verifyTiming(submittedAt: string | null, challengeCreatedAt: string | null): { score: number; details: string } {
  console.log(`[Timing] Submitted: ${submittedAt}, Challenge created: ${challengeCreatedAt}`);
  
  if (!submittedAt) {
    return { score: 0, details: "Submission not yet submitted" };
  }

  const submitted = new Date(submittedAt);
  const now = new Date();
  
  // Check if submission is reasonable (not in future)
  if (submitted > now) {
    return { score: 0, details: "Invalid submission date" };
  }

  // If we have challenge creation date, verify student worked on it for reasonable time
  if (challengeCreatedAt) {
    const challengeCreated = new Date(challengeCreatedAt);
    const workDays = Math.ceil((submitted.getTime() - challengeCreated.getTime()) / (1000 * 60 * 60 * 24));
    
    if (workDays >= 7) {
      return { score: 30, details: `Submitted after ${workDays} days of work` };
    } else if (workDays >= 3) {
      return { score: 20, details: `Submitted after ${workDays} days` };
    } else if (workDays >= 1) {
      return { score: 10, details: `Quick submission: ${workDays} day(s)` };
    } else {
      return { score: 5, details: "Suspicious: submitted same day as challenge" };
    }
  }

  return { score: 15, details: "Submission timing verified" };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { submissionId } = await req.json();
    console.log(`[Main] Processing submission: ${submissionId}`);

    if (!submissionId) {
      return new Response(
        JSON.stringify({ error: "submissionId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch submission with challenge info
    const { data: submission, error: fetchError } = await supabase
      .from("submissions")
      .select(`
        *,
        challenge:challenges(id, created_at, deadline)
      `)
      .eq("id", submissionId)
      .single();

    if (fetchError || !submission) {
      console.error("[Main] Submission not found:", fetchError);
      return new Response(
        JSON.stringify({ error: "Submission not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[Main] Submission found: github=${submission.files_url}, video=${submission.video_url}`);

    // Run all verifications
    const [githubResult, videoResult] = await Promise.all([
      verifyGitHubActivity(submission.files_url || ""),
      verifyVideoPresence(submission.video_url),
    ]);

    const timingResult = verifyTiming(
      submission.submitted_at,
      submission.challenge?.created_at
    );

    // Calculate overall score
    const overallScore = githubResult.score + videoResult.score + timingResult.score;
    console.log(`[Main] Scores - GitHub: ${githubResult.score}, Video: ${videoResult.score}, Timing: ${timingResult.score}, Overall: ${overallScore}`);

    // Determine flag reasons
    const flagReasons: string[] = [];
    if (githubResult.score < 15) flagReasons.push("Low GitHub activity score");
    if (videoResult.score < 15) flagReasons.push("Missing or unverified video");
    if (timingResult.score < 10) flagReasons.push("Suspicious submission timing");
    if (overallScore < 50) flagReasons.push("Overall authenticity below threshold");

    const shouldFlag = overallScore < 50;

    const breakdown: AuthenticityResult = {
      overall: overallScore,
      github: githubResult,
      video: videoResult,
      timing: timingResult,
      flagReasons,
    };

    // Update submission with authenticity data
    const { error: updateError } = await supabase
      .from("submissions")
      .update({
        authenticity_score: overallScore,
        authenticity_breakdown: breakdown,
        github_repo_url: submission.files_url,
        github_verified_at: new Date().toISOString(),
        video_verified_at: new Date().toISOString(),
        flagged_for_review: shouldFlag,
        flag_reasons: flagReasons,
      })
      .eq("id", submissionId);

    if (updateError) {
      console.error("[Main] Update error:", updateError);
      throw updateError;
    }

    // Log authenticity check
    await supabase.from("authenticity_logs").insert({
      submission_id: submissionId,
      check_type: "full_verification",
      check_result: breakdown,
      score_contribution: overallScore,
    });

    console.log(`[Main] Verification complete for ${submissionId}`);

    return new Response(
      JSON.stringify({
        success: true,
        submissionId,
        score: overallScore,
        breakdown,
        flagged: shouldFlag,
        flagReasons,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Main] Error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

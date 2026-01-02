import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ActiveProject {
  id: string;
  applicationId: string;
  challengeId: string;
  title: string;
  description: string;
  company: string;
  difficulty: string;
  credits: number;
  deadline: string | null;
  appliedAt: string;
  status: string;
  submissionStatus: string | null;
  progress: number;
}

export const useActiveProjects = () => {
  const { user } = useAuth();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["activeProjects", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get approved applications with challenge details
      const { data: applications, error: appError } = await supabase
        .from("project_applications")
        .select(`
          id,
          challenge_id,
          applied_at,
          status,
          challenges!project_applications_challenge_id_fkey (
            id,
            title,
            description,
            difficulty,
            credits,
            deadline,
            company_id,
            company_profiles!challenges_company_id_fkey (
              company_name
            )
          )
        `)
        .eq("student_id", user.id)
        .eq("status", "approved")
        .order("applied_at", { ascending: false });

      if (appError) throw appError;
      if (!applications || applications.length === 0) return [];

      // Get submissions for these applications
      const { data: submissions } = await supabase
        .from("submissions")
        .select("application_id, status")
        .in("application_id", applications.map(a => a.id));

      const submissionMap = new Map(
        (submissions || []).map(s => [s.application_id, s.status])
      );

      return applications.map((app): ActiveProject => {
        const challenge = app.challenges as any;
        const company = challenge?.company_profiles;
        const submissionStatus = submissionMap.get(app.id) || null;
        
        // Calculate progress based on submission status
        let progress = 10; // Started
        if (submissionStatus === "draft") progress = 30;
        if (submissionStatus === "submitted") progress = 70;
        if (submissionStatus === "graded" || submissionStatus === "approved") progress = 100;

        return {
          id: app.id,
          applicationId: app.id,
          challengeId: app.challenge_id,
          title: challenge?.title || "Project",
          description: challenge?.description || "",
          company: company?.company_name || "Heuristic",
          difficulty: challenge?.difficulty || "Medium",
          credits: challenge?.credits || 0,
          deadline: challenge?.deadline,
          appliedAt: app.applied_at,
          status: app.status,
          submissionStatus,
          progress,
        };
      });
    },
    enabled: !!user,
  });

  const activeProject = projects?.[0] || null;
  const hasActiveProject = !!activeProject;

  return {
    projects: projects || [],
    activeProject,
    hasActiveProject,
    isLoading,
  };
};

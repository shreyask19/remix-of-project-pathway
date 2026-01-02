import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";

export interface CompanyActivity {
  id: string;
  type: "submission" | "graded" | "shortlisted" | "pipeline_update" | "hired";
  message: string;
  studentName: string;
  challengeTitle?: string;
  time: string;
  createdAt: Date;
}

export const useCompanyActivity = (limit: number = 10) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: activities, isLoading, refetch } = useQuery({
    queryKey: ["companyActivity", user?.id, limit],
    queryFn: async (): Promise<CompanyActivity[]> => {
      if (!user) return [];

      const allActivities: CompanyActivity[] = [];

      // Fetch company's challenges first
      const { data: challenges } = await supabase
        .from("challenges")
        .select("id, title")
        .eq("company_id", user.id);

      const challengeIds = challenges?.map(c => c.id) || [];
      const challengeMap = new Map(challenges?.map(c => [c.id, c.title]) || []);

      if (challengeIds.length > 0) {
        // Fetch recent submissions
        const { data: submissions } = await supabase
          .from("submissions")
          .select(`
            id,
            status,
            submitted_at,
            graded_at,
            grade,
            challenge_id,
            student_id
          `)
          .in("challenge_id", challengeIds)
          .neq("status", "draft")
          .order("submitted_at", { ascending: false })
          .limit(limit);

        // Get student profiles for names
        const studentIds = [...new Set(submissions?.map(s => s.student_id) || [])];
        
        let studentMap = new Map<string, string>();
        if (studentIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, first_name, last_name")
            .in("id", studentIds);
          
          studentMap = new Map(
            profiles?.map(p => [p.id, `${p.first_name} ${p.last_name}`.trim() || "Student"]) || []
          );
        }

        // Process submissions into activities
        submissions?.forEach(sub => {
          const studentName = studentMap.get(sub.student_id) || "Student";
          const challengeTitle = challengeMap.get(sub.challenge_id) || "Challenge";

          if (sub.status === "submitted" && sub.submitted_at) {
            allActivities.push({
              id: `sub-${sub.id}`,
              type: "submission",
              message: `New submission for ${challengeTitle}`,
              studentName,
              challengeTitle,
              time: formatTimeAgo(new Date(sub.submitted_at)),
              createdAt: new Date(sub.submitted_at),
            });
          }

          if ((sub.status === "graded" || sub.status === "approved") && sub.graded_at) {
            const gradeLabel = sub.grade && sub.grade >= 90 ? "Excellent" : 
                             sub.grade && sub.grade >= 70 ? "Satisfied" : "Average";
            allActivities.push({
              id: `grade-${sub.id}`,
              type: "graded",
              message: `Submission graded: ${gradeLabel}`,
              studentName,
              challengeTitle,
              time: formatTimeAgo(new Date(sub.graded_at)),
              createdAt: new Date(sub.graded_at),
            });
          }
        });
      }

      // Fetch pipeline activities
      const { data: pipelineItems } = await supabase
        .from("hiring_pipeline")
        .select(`
          id,
          stage,
          created_at,
          updated_at,
          student_id
        `)
        .eq("company_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(limit);

      if (pipelineItems && pipelineItems.length > 0) {
        const pipelineStudentIds = [...new Set(pipelineItems.map(p => p.student_id))];
        
        const { data: pipelineProfiles } = await supabase
          .from("profiles")
          .select("id, first_name, last_name")
          .in("id", pipelineStudentIds);

        const pipelineStudentMap = new Map(
          pipelineProfiles?.map(p => [p.id, `${p.first_name} ${p.last_name}`.trim() || "Student"]) || []
        );

        pipelineItems.forEach(item => {
          const studentName = pipelineStudentMap.get(item.student_id) || "Student";
          const stageLabel = item.stage === "hired" ? "hired" : 
                           item.stage === "interviewing" ? "moved to interview" : "shortlisted";

          allActivities.push({
            id: `pipeline-${item.id}`,
            type: item.stage === "hired" ? "hired" : "shortlisted",
            message: `${studentName} ${stageLabel}`,
            studentName,
            time: formatTimeAgo(new Date(item.updated_at)),
            createdAt: new Date(item.updated_at),
          });
        });
      }

      // Sort by date and return top N
      return allActivities
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit);
    },
    enabled: !!user,
  });

  // Real-time subscription for new submissions and pipeline updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("company-realtime-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "submissions",
        },
        (payload) => {
          // Check if this submission is for one of our challenges
          toast.info("New project submission received! 📥");
          queryClient.invalidateQueries({ queryKey: ["companyActivity"] });
          queryClient.invalidateQueries({ queryKey: ["companyStats"] });
          queryClient.invalidateQueries({ queryKey: ["submissions"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "submissions",
        },
        (payload) => {
          const newStatus = payload.new.status;
          if (newStatus === "approved") {
            toast.success("A submission has been approved by a teacher! ✓");
          } else if (newStatus === "disputed") {
            toast.warning("A grade has been disputed. Please review. ⚠️");
          }
          queryClient.invalidateQueries({ queryKey: ["companyActivity"] });
          queryClient.invalidateQueries({ queryKey: ["companyStats"] });
          queryClient.invalidateQueries({ queryKey: ["submissions"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "hiring_pipeline",
          filter: `company_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["companyActivity"] });
          queryClient.invalidateQueries({ queryKey: ["companyStats"] });
          queryClient.invalidateQueries({ queryKey: ["hiringPipeline"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "invitations",
          filter: `company_id=eq.${user.id}`,
        },
        (payload) => {
          const status = payload.new.status;
          if (status === "accepted") {
            toast.success("A student has accepted your invitation! 🎉");
          } else if (status === "declined") {
            toast.info("A student has declined your invitation.");
          }
          queryClient.invalidateQueries({ queryKey: ["companyInvitations"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return {
    activities: activities || [],
    isLoading,
    refetch,
  };
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

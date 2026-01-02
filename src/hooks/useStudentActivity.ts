import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";

export interface StudentActivity {
  id: string;
  type: "applied" | "submission" | "graded" | "approved" | "credits_earned";
  message: string;
  challengeTitle?: string;
  time: string;
  createdAt: Date;
  grade?: number;
  credits?: number;
}

export const useStudentActivity = (limit: number = 10) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: activities, isLoading, refetch } = useQuery({
    queryKey: ["studentActivity", user?.id, limit],
    queryFn: async (): Promise<StudentActivity[]> => {
      if (!user) return [];

      const allActivities: StudentActivity[] = [];

      // Fetch applications
      const { data: applications } = await supabase
        .from("project_applications")
        .select(`
          id,
          applied_at,
          status,
          challenge:challenges(title)
        `)
        .eq("student_id", user.id)
        .order("applied_at", { ascending: false })
        .limit(limit);

      applications?.forEach(app => {
        const challengeTitle = (app.challenge as { title: string } | null)?.title || "Challenge";
        allActivities.push({
          id: `app-${app.id}`,
          type: "applied",
          message: `Applied to ${challengeTitle}`,
          challengeTitle,
          time: formatTimeAgo(new Date(app.applied_at)),
          createdAt: new Date(app.applied_at),
        });
      });

      // Fetch submissions with status changes
      const { data: submissions } = await supabase
        .from("submissions")
        .select(`
          id,
          status,
          submitted_at,
          graded_at,
          approved_at,
          grade,
          challenge:challenges(title, credits)
        `)
        .eq("student_id", user.id)
        .neq("status", "draft")
        .order("created_at", { ascending: false })
        .limit(limit);

      submissions?.forEach(sub => {
        const challenge = sub.challenge as { title: string; credits: number } | null;
        const challengeTitle = challenge?.title || "Challenge";

        if (sub.submitted_at) {
          allActivities.push({
            id: `sub-${sub.id}`,
            type: "submission",
            message: `Submitted project for ${challengeTitle}`,
            challengeTitle,
            time: formatTimeAgo(new Date(sub.submitted_at)),
            createdAt: new Date(sub.submitted_at),
          });
        }

        if (sub.status === "graded" && sub.graded_at) {
          const gradeLabel = sub.grade && sub.grade >= 90 ? "Excellent" : 
                           sub.grade && sub.grade >= 70 ? "Satisfied" : "Average";
          allActivities.push({
            id: `graded-${sub.id}`,
            type: "graded",
            message: `Project graded: ${gradeLabel}`,
            challengeTitle,
            time: formatTimeAgo(new Date(sub.graded_at)),
            createdAt: new Date(sub.graded_at),
            grade: sub.grade || undefined,
          });
        }

        if (sub.status === "approved" && sub.approved_at) {
          allActivities.push({
            id: `approved-${sub.id}`,
            type: "approved",
            message: `Project approved! Earned ${challenge?.credits || 0} credits`,
            challengeTitle,
            time: formatTimeAgo(new Date(sub.approved_at)),
            createdAt: new Date(sub.approved_at),
            credits: challenge?.credits || 0,
          });
        }
      });

      // Sort by date and return top N
      return allActivities
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit);
    },
    enabled: !!user,
  });

  // Real-time subscription for grade updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("student-realtime-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "submissions",
          filter: `student_id=eq.${user.id}`,
        },
        (payload) => {
          const newStatus = payload.new.status;
          const oldStatus = payload.old.status;
          
          // Show toast notification for grade updates
          if (oldStatus !== newStatus) {
            if (newStatus === "graded") {
              const grade = payload.new.grade;
              const gradeLabel = grade >= 90 ? "Excellent" : grade >= 70 ? "Satisfied" : "Average";
              toast.success(`Your project was graded: ${gradeLabel}! 🎉`);
            } else if (newStatus === "approved") {
              toast.success("Your project was approved! Credits have been awarded! 🏆");
            } else if (newStatus === "disputed") {
              toast.info("A grade dispute has been raised. Awaiting review.");
            }
          }
          
          // Refetch activities and stats
          queryClient.invalidateQueries({ queryKey: ["studentActivity"] });
          queryClient.invalidateQueries({ queryKey: ["studentStats"] });
          queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "credits_ledger",
          filter: `student_id=eq.${user.id}`,
        },
        (payload) => {
          const amount = payload.new.amount;
          toast.success(`You earned ${amount} credits! 💰`);
          queryClient.invalidateQueries({ queryKey: ["studentStats"] });
          queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "invitations",
          filter: `student_id=eq.${user.id}`,
        },
        (payload) => {
          const type = payload.new.type;
          if (type === "interview") {
            toast.info("You have a new interview invitation! 📧");
          } else if (type === "offer") {
            toast.success("You received a job offer! 🎉");
          }
          queryClient.invalidateQueries({ queryKey: ["studentInvitations"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "hiring_pipeline",
          filter: `student_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const stage = payload.new.stage;
            if (stage === "interviewing") {
              toast.info("A company has moved you to the interview stage! 🎤");
            } else if (stage === "offer_sent") {
              toast.success("You have received a job offer! 🎉");
            } else if (stage === "hired") {
              toast.success("Congratulations! You've been hired! 🏆");
            }
          }
          queryClient.invalidateQueries({ queryKey: ["studentInvitations"] });
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

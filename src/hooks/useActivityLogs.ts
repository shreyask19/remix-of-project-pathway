import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface UseActivityLogsOptions {
  limit?: number;
  entityType?: string;
}

export const useActivityLogs = (options: UseActivityLogsOptions = {}) => {
  const { user } = useAuth();
  const { limit = 20, entityType } = options;

  const { data: activities, isLoading, refetch } = useQuery({
    queryKey: ["activityLogs", user?.id, limit, entityType],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (entityType) {
        query = query.eq("entity_type", entityType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as ActivityLog[];
    },
    enabled: !!user,
  });

  // Helper to format activity for display
  const formatActivity = (activity: ActivityLog): string => {
    const actionMap: Record<string, string> = {
      submission_created: "Created a new submission",
      submission_submitted: "Submitted project for review",
      submission_graded: "Project was graded",
      submission_approved: "Project was approved",
      grade_pending: "Grade pending review",
      grade_approved: "Grade was approved",
      grade_disputed: "Grade was disputed",
    };

    return actionMap[activity.action_type] || activity.action_type.replace(/_/g, " ");
  };

  return {
    activities: activities || [],
    isLoading,
    refetch,
    formatActivity,
  };
};

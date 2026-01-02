import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTeacherSettings } from "./useTeacherSettings";

export interface AtRiskStudent {
  id: string;
  name: string;
  credits: number;
  issue: string;
  urgency: "high" | "medium" | "low";
}

export const useAtRiskStudents = (limit: number = 10) => {
  const { user } = useAuth();
  const { settings } = useTeacherSettings();

  const { data: students, isLoading, refetch } = useQuery({
    queryKey: ["atRiskStudents", user?.id, limit],
    queryFn: async (): Promise<AtRiskStudent[]> => {
      if (!user) return [];

      const threshold = settings.credit_threshold || 300;
      const atRiskThreshold = threshold / 2;

      // Get teacher's institution
      const { data: teacherProfile } = await supabase
        .from("teacher_profiles")
        .select("institution_id")
        .eq("user_id", user.id)
        .maybeSingle();

      // Fetch students with low credits
      let query = supabase
        .from("student_profiles")
        .select("user_id, total_credits")
        .lt("total_credits", atRiskThreshold)
        .order("total_credits", { ascending: true })
        .limit(limit);

      if (teacherProfile?.institution_id) {
        query = query.eq("institution_id", teacherProfile.institution_id);
      }

      const { data: studentProfiles } = await query;
      if (!studentProfiles || studentProfiles.length === 0) return [];

      // Get profile names
      const userIds = studentProfiles.map(s => s.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .in("id", userIds);

      const profileMap = new Map(
        profiles?.map(p => [p.id, `${p.first_name} ${p.last_name}`.trim() || "Student"]) || []
      );

      // Check for missed deadlines
      const { data: pendingSubmissions } = await supabase
        .from("submissions")
        .select("student_id, status")
        .in("student_id", userIds)
        .eq("status", "draft");

      const pendingCountMap = new Map<string, number>();
      pendingSubmissions?.forEach(s => {
        pendingCountMap.set(s.student_id, (pendingCountMap.get(s.student_id) || 0) + 1);
      });

      return studentProfiles.map(sp => {
        const credits = sp.total_credits || 0;
        const pendingCount = pendingCountMap.get(sp.user_id) || 0;
        
        // Determine issue and urgency
        let issue = "Low project completion";
        let urgency: "high" | "medium" | "low" = "medium";

        if (credits === 0) {
          issue = "No projects started";
          urgency = "high";
        } else if (credits < threshold * 0.25) {
          issue = "Very low credits";
          urgency = "high";
        } else if (pendingCount > 2) {
          issue = "Multiple incomplete projects";
          urgency = "high";
        } else if (pendingCount > 0) {
          issue = "Pending submissions";
          urgency = "medium";
        } else if (credits < atRiskThreshold) {
          issue = "Below credit threshold";
          urgency = "low";
        }

        return {
          id: sp.user_id,
          name: profileMap.get(sp.user_id) || "Student",
          credits,
          issue,
          urgency,
        };
      }).sort((a, b) => {
        // Sort by urgency first, then by credits
        const urgencyOrder = { high: 0, medium: 1, low: 2 };
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        }
        return a.credits - b.credits;
      });
    },
    enabled: !!user,
  });

  return {
    students: students || [],
    isLoading,
    refetch,
  };
};

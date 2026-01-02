import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface StudentStats {
  totalCredits: number;
  projectsCompleted: number;
  skillScore: number;
  avgGrade: number;
  exemptionThreshold: number;
  hasFirstProject: boolean;
}

export const useStudentStats = () => {
  const { user } = useAuth();

  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["studentStats", user?.id],
    queryFn: async (): Promise<StudentStats> => {
      if (!user) {
        return {
          totalCredits: 0,
          projectsCompleted: 0,
          skillScore: 0,
          avgGrade: 0,
          exemptionThreshold: 300,
          hasFirstProject: false,
        };
      }

      // Fetch total credits from student_profiles
      const { data: studentProfile } = await supabase
        .from("student_profiles")
        .select("total_credits")
        .eq("user_id", user.id)
        .maybeSingle();

      const totalCredits = studentProfile?.total_credits || 0;

      // Fetch completed projects (graded or approved submissions)
      const { data: completedSubmissions } = await supabase
        .from("submissions")
        .select("id, grade, status")
        .eq("student_id", user.id)
        .in("status", ["graded", "approved"]);

      const projectsCompleted = completedSubmissions?.length || 0;
      
      // Calculate average grade
      const gradedSubmissions = completedSubmissions?.filter(s => s.grade !== null) || [];
      const avgGrade = gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions.length
        : 0;

      // Get teacher settings for exemption threshold (default 300)
      const { data: teacherSettings } = await supabase
        .from("teacher_settings")
        .select("credit_threshold")
        .limit(1)
        .maybeSingle();

      const exemptionThreshold = teacherSettings?.credit_threshold || 300;

      // Calculate skill score: (avg_grade * 0.4) + (total_credits / exemption_threshold * 0.6) * 100
      const creditRatio = Math.min(totalCredits / exemptionThreshold, 1);
      const skillScore = projectsCompleted > 0
        ? Math.round((avgGrade * 0.4) + (creditRatio * 60))
        : 0;

      return {
        totalCredits,
        projectsCompleted,
        skillScore,
        avgGrade: Math.round(avgGrade),
        exemptionThreshold,
        hasFirstProject: projectsCompleted > 0,
      };
    },
    enabled: !!user,
  });

  return {
    stats: stats || {
      totalCredits: 0,
      projectsCompleted: 0,
      skillScore: 0,
      avgGrade: 0,
      exemptionThreshold: 300,
      hasFirstProject: false,
    },
    isLoading,
    refetch,
  };
};

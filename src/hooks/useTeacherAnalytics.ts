import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTeacherSettings } from "./useTeacherSettings";

export interface TeacherAnalyticsData {
  averageCredits: number;
  completionRate: number;
  atRiskCount: number;
  avgProjectScore: string;
  totalStudents: number;
  totalSubmissions: number;
  gradedSubmissions: number;
}

export const useTeacherAnalytics = () => {
  const { user } = useAuth();
  const { settings } = useTeacherSettings();

  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ["teacherAnalytics", user?.id],
    queryFn: async (): Promise<TeacherAnalyticsData> => {
      if (!user) {
        return {
          averageCredits: 0,
          completionRate: 0,
          atRiskCount: 0,
          avgProjectScore: "—",
          totalStudents: 0,
          totalSubmissions: 0,
          gradedSubmissions: 0,
        };
      }

      // Get teacher's institution
      const { data: teacherProfile } = await supabase
        .from("teacher_profiles")
        .select("institution_id")
        .eq("user_id", user.id)
        .maybeSingle();

      // Fetch all students (from same institution or all if no institution)
      let studentQuery = supabase
        .from("student_profiles")
        .select("user_id, total_credits");

      if (teacherProfile?.institution_id) {
        studentQuery = studentQuery.eq("institution_id", teacherProfile.institution_id);
      }

      const { data: students } = await studentQuery;
      const totalStudents = students?.length || 0;

      // Calculate average credits
      const averageCredits = totalStudents > 0
        ? Math.round((students?.reduce((sum, s) => sum + (s.total_credits || 0), 0) || 0) / totalStudents)
        : 0;

      // Calculate at-risk students (credits < threshold/2)
      const threshold = settings.credit_threshold || 300;
      const atRiskThreshold = threshold / 2;
      const atRiskCount = students?.filter(s => (s.total_credits || 0) < atRiskThreshold).length || 0;

      // Fetch submissions for completion rate
      const studentIds = students?.map(s => s.user_id) || [];
      
      let totalSubmissions = 0;
      let gradedSubmissions = 0;
      let totalGradeSum = 0;
      let gradedCount = 0;

      if (studentIds.length > 0) {
        // Total submissions (non-draft)
        const { count: submissionsCount } = await supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })
          .in("student_id", studentIds)
          .neq("status", "draft");

        totalSubmissions = submissionsCount || 0;

        // Graded/Approved submissions
        const { data: gradedSubs } = await supabase
          .from("submissions")
          .select("grade, status")
          .in("student_id", studentIds)
          .in("status", ["graded", "approved"]);

        gradedSubmissions = gradedSubs?.length || 0;

        // Calculate average grade
        gradedSubs?.forEach(s => {
          if (s.grade) {
            totalGradeSum += s.grade;
            gradedCount++;
          }
        });
      }

      // Completion rate
      const completionRate = totalSubmissions > 0
        ? Math.round((gradedSubmissions / totalSubmissions) * 100)
        : 0;

      // Average project score as letter grade
      const avgGrade = gradedCount > 0 ? totalGradeSum / gradedCount : 0;
      const avgProjectScore = avgGrade >= 90 ? "A" :
                             avgGrade >= 80 ? "B+" :
                             avgGrade >= 70 ? "B" :
                             avgGrade >= 60 ? "C+" :
                             avgGrade > 0 ? "C" : "—";

      return {
        averageCredits,
        completionRate,
        atRiskCount,
        avgProjectScore,
        totalStudents,
        totalSubmissions,
        gradedSubmissions,
      };
    },
    enabled: !!user,
  });

  return {
    analytics: analytics || {
      averageCredits: 0,
      completionRate: 0,
      atRiskCount: 0,
      avgProjectScore: "—",
      totalStudents: 0,
      totalSubmissions: 0,
      gradedSubmissions: 0,
    },
    isLoading,
    refetch,
  };
};

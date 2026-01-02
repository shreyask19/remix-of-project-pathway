import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface InstitutionStudent {
  id: string;
  name: string;
  email: string;
  credits: number;
  semester: string;
  projectsCompleted: number;
}

export interface CreditDistribution {
  range: string;
  count: number;
  percentage: number;
}

export const useInstitutionStudents = () => {
  const { user } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["institutionStudents", user?.id],
    queryFn: async () => {
      if (!user) return { students: [], creditDistribution: [] };

      // Get teacher's institution
      const { data: teacherProfile } = await supabase
        .from("teacher_profiles")
        .select("institution_id")
        .eq("user_id", user.id)
        .maybeSingle();

      // Fetch students
      let studentQuery = supabase
        .from("student_profiles")
        .select("user_id, total_credits, current_semester");

      if (teacherProfile?.institution_id) {
        studentQuery = studentQuery.eq("institution_id", teacherProfile.institution_id);
      }

      const { data: studentProfiles } = await studentQuery;
      if (!studentProfiles || studentProfiles.length === 0) {
        return { students: [], creditDistribution: [] };
      }

      // Get profile names and emails
      const userIds = studentProfiles.map(s => s.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .in("id", userIds);

      const profileMap = new Map(
        profiles?.map(p => [p.id, { 
          name: `${p.first_name} ${p.last_name}`.trim() || "Student",
          email: p.email 
        }]) || []
      );

      // Get submission counts
      const { data: submissions } = await supabase
        .from("submissions")
        .select("student_id, status")
        .in("student_id", userIds)
        .in("status", ["graded", "approved"]);

      const submissionCountMap = new Map<string, number>();
      submissions?.forEach(s => {
        submissionCountMap.set(s.student_id, (submissionCountMap.get(s.student_id) || 0) + 1);
      });

      const students: InstitutionStudent[] = studentProfiles.map(sp => {
        const profile = profileMap.get(sp.user_id);
        return {
          id: sp.user_id,
          name: profile?.name || "Student",
          email: profile?.email || "",
          credits: sp.total_credits || 0,
          semester: sp.current_semester || "—",
          projectsCompleted: submissionCountMap.get(sp.user_id) || 0,
        };
      });

      // Calculate credit distribution
      const ranges = [
        { min: 0, max: 50, label: "0-50" },
        { min: 51, max: 100, label: "51-100" },
        { min: 101, max: 150, label: "101-150" },
        { min: 151, max: 200, label: "151-200" },
        { min: 201, max: 250, label: "201-250" },
        { min: 251, max: 300, label: "251-300" },
        { min: 301, max: Infinity, label: "300+" },
      ];

      const totalStudents = studentProfiles.length;
      const creditDistribution: CreditDistribution[] = ranges.map(range => {
        const count = studentProfiles.filter(s => {
          const credits = s.total_credits || 0;
          return credits >= range.min && credits <= range.max;
        }).length;
        
        return {
          range: range.label,
          count,
          percentage: totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0,
        };
      }).filter(d => d.count > 0 || d.range === "0-50"); // Always show 0-50 range

      return { students, creditDistribution };
    },
    enabled: !!user,
  });

  return {
    students: data?.students || [],
    creditDistribution: data?.creditDistribution || [],
    isLoading,
    refetch,
  };
};

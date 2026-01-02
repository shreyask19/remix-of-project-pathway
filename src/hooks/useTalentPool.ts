import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface TalentStudent {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  university: string | null;
  program: string | null;
  graduationYear: string | null;
  skills: string[];
  credits: number;
  projectsCompleted: number;
  avgGrade: string;
  available: boolean;
}

export const useTalentPool = (options?: { minCredits?: number; skills?: string[] }) => {
  const { user } = useAuth();

  const { data: talents, isLoading } = useQuery({
    queryKey: ["talentPool", options],
    queryFn: async () => {
      // First get student profiles with credits > threshold
      let query = supabase
        .from("student_profiles")
        .select(`
          id,
          user_id,
          university_name,
          university_program,
          graduation_year,
          existing_skills,
          total_credits,
          profiles!student_profiles_user_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .gte("total_credits", options?.minCredits || 0)
        .order("total_credits", { ascending: false })
        .limit(50);

      const { data: students, error: studentsError } = await query;
      if (studentsError) throw studentsError;

      if (!students || students.length === 0) return [];

      // Get submission counts for each student
      const studentIds = students.map(s => s.user_id);
      const { data: submissions } = await supabase
        .from("submissions")
        .select("student_id, grade, status")
        .in("student_id", studentIds)
        .in("status", ["graded", "approved"]);

      // Calculate stats per student
      const submissionStats = new Map<string, { count: number; excellentCount: number }>();
      (submissions || []).forEach(sub => {
        const stats = submissionStats.get(sub.student_id) || { count: 0, excellentCount: 0 };
        stats.count++;
        if (sub.grade && sub.grade >= 90) stats.excellentCount++;
        submissionStats.set(sub.student_id, stats);
      });

      // Check if students are in any hiring pipeline
      const { data: pipelineData } = await supabase
        .from("hiring_pipeline")
        .select("student_id, stage")
        .in("student_id", studentIds)
        .eq("stage", "hired");

      const hiredStudents = new Set((pipelineData || []).map(p => p.student_id));

      return students.map((s): TalentStudent => {
        const stats = submissionStats.get(s.user_id) || { count: 0, excellentCount: 0 };
        const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
        
        return {
          id: s.id,
          userId: s.user_id,
          firstName: profile?.first_name || "",
          lastName: profile?.last_name || "",
          email: profile?.email || "",
          university: s.university_name,
          program: s.university_program,
          graduationYear: s.graduation_year,
          skills: s.existing_skills || [],
          credits: s.total_credits || 0,
          projectsCompleted: stats.count,
          avgGrade: stats.excellentCount > stats.count / 2 ? "Excellent" : stats.count > 0 ? "Satisfied" : "N/A",
          available: !hiredStudents.has(s.user_id),
        };
      });
    },
    enabled: !!user,
  });

  // Filter by skills if provided
  const filteredTalents = options?.skills?.length
    ? talents?.filter(t => 
        options.skills!.some(skill => 
          t.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
        )
      )
    : talents;

  return {
    talents: filteredTalents || [],
    isLoading,
  };
};

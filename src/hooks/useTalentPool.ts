import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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
  industryReadinessScore: number;
}

interface UseTalentPoolOptions {
  minCredits?: number;
  minReadinessScore?: number;
  skills?: string[];
  sortBy?: "credits" | "projects" | "name" | "readiness";
  availableOnly?: boolean;
}

const PAGE_SIZE = 20;

export const useTalentPool = (options?: UseTalentPoolOptions) => {
  const { user } = useAuth();

  const { data: talents, isLoading, refetch } = useQuery({
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
          industry_readiness_score,
          profiles!student_profiles_user_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .gte("total_credits", options?.minCredits || 0)
        .order("total_credits", { ascending: false })
        .limit(50);

      // Filter by minimum readiness score
      if (options?.minReadinessScore && options.minReadinessScore > 0) {
        query = query.gte("industry_readiness_score", options.minReadinessScore);
      }

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
          industryReadinessScore: s.industry_readiness_score || 0,
        };
      });
    },
    enabled: !!user,
    staleTime: 60 * 1000, // 1 minute cache
  });

  // Filter and sort talents
  let filteredTalents = talents || [];

  // Filter by skills
  if (options?.skills?.length) {
    filteredTalents = filteredTalents.filter(t => 
      options.skills!.some(skill => 
        t.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      )
    );
  }

  // Filter by availability
  if (options?.availableOnly) {
    filteredTalents = filteredTalents.filter(t => t.available);
  }

  // Sort
  if (options?.sortBy) {
    filteredTalents = [...filteredTalents].sort((a, b) => {
      switch (options.sortBy) {
        case "credits":
          return b.credits - a.credits;
        case "projects":
          return b.projectsCompleted - a.projectsCompleted;
        case "readiness":
          return b.industryReadinessScore - a.industryReadinessScore;
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        default:
          return 0;
      }
    });
  }

  return {
    talents: filteredTalents,
    isLoading,
    refetch,
  };
};

// Infinite query version for larger datasets
export const useInfiniteTalentPool = (options?: UseTalentPoolOptions) => {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: ["infiniteTalentPool", options],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

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
        `, { count: "exact" })
        .gte("total_credits", options?.minCredits || 0)
        .order("total_credits", { ascending: false })
        .range(start, end);

      const { data: students, error, count } = await query;
      if (error) throw error;

      if (!students || students.length === 0) {
        return { talents: [], totalCount: count || 0, nextPage: undefined };
      }

      // Transform students
      const talents = students.map((s): TalentStudent => {
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
          projectsCompleted: 0,
          avgGrade: "N/A",
          available: true,
          industryReadinessScore: 0,
        };
      });

      return {
        talents,
        totalCount: count || 0,
        nextPage: students.length === PAGE_SIZE ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !!user,
    staleTime: 60 * 1000,
  });
};

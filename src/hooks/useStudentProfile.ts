import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface StudentProfileData {
  universityName: string;
  universityProgram: string;
  batch: string;
  graduationYear: string;
  currentSemester: string;
  currentSubjects: string[];
  existingSkills: string[];
  interests: string[];
  careerGoals: string[];
  preferredProjectTypes: string[];
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  hoursPerWeek: string;
}

export interface SkillGraphData {
  category: string;
  score: number;
}

export const useStudentProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["studentProfile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: credits } = useQuery({
    queryKey: ["studentCredits", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const { data, error } = await supabase
        .from("student_profiles")
        .select("total_credits")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data?.total_credits ?? 0;
    },
    enabled: !!user,
  });

  // Fetch industry readiness score
  const { data: industryReadinessScore } = useQuery({
    queryKey: ["industryReadinessScore", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const { data, error } = await supabase
        .from("student_profiles")
        .select("industry_readiness_score")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data?.industry_readiness_score ?? 0;
    },
    enabled: !!user,
  });

  // Fetch skill graph data
  const { data: skillGraphData } = useQuery({
    queryKey: ["skillGraphData", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("skill_graph_data")
        .select("category, score")
        .eq("student_id", user.id);

      if (error) throw error;
      return (data || []) as SkillGraphData[];
    },
    enabled: !!user,
  });

  // Mutation to trigger industry readiness recalculation
  const recalculateReadiness = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase.functions.invoke("calculate-industry-readiness", {
        body: { studentId: user.id },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["industryReadinessScore"] });
      queryClient.invalidateQueries({ queryKey: ["skillGraphData"] });
    },
  });

  const saveProfile = useMutation({
    mutationFn: async (profileData: StudentProfileData) => {
      if (!user) throw new Error("Not authenticated");

      const dbData = {
        user_id: user.id,
        university_name: profileData.universityName,
        university_program: profileData.universityProgram,
        batch: profileData.batch,
        graduation_year: profileData.graduationYear,
        current_semester: profileData.currentSemester,
        current_subjects: profileData.currentSubjects,
        existing_skills: profileData.existingSkills,
        interests: profileData.interests,
        career_goals: profileData.careerGoals,
        preferred_project_types: profileData.preferredProjectTypes,
        linkedin_url: profileData.linkedinUrl,
        github_url: profileData.githubUrl,
        portfolio_url: profileData.portfolioUrl,
        hours_per_week: profileData.hoursPerWeek,
      };

      const { data, error } = await supabase
        .from("student_profiles")
        .upsert(dbData, { onConflict: "user_id" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
    },
  });

  return {
    profile,
    credits,
    industryReadinessScore,
    skillGraphData,
    isLoading,
    saveProfile,
    recalculateReadiness,
  };
};

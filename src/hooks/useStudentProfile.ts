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
    isLoading,
    saveProfile,
  };
};

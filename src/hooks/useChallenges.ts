import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Challenge {
  id: string;
  company_id: string;
  title: string;
  description: string;
  difficulty: string;
  credits: number;
  deadline: string | null;
  required_skills: string[];
  category: string;
  status: string;
  max_applicants: number;
  current_applicants: number;
  created_at: string;
  company?: {
    company_name: string;
    logo_url: string;
  };
}

export interface Application {
  id: string;
  student_id: string;
  challenge_id: string;
  status: string;
  cover_letter: string;
  applied_at: string;
  challenge?: Challenge;
}

export const useChallenges = () => {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all active challenges
  const { data: challenges, isLoading: challengesLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const { data: challengesData, error: challengesError } = await supabase
        .from("challenges")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (challengesError) throw challengesError;
      
      // Fetch company profiles separately
      const companyIds = [...new Set(challengesData?.map(c => c.company_id) || [])];
      const { data: companiesData } = await supabase
        .from("company_profiles")
        .select("user_id, company_name, logo_url")
        .in("user_id", companyIds);

      const companiesMap = new Map(companiesData?.map(c => [c.user_id, c]) || []);
      
      return (challengesData || []).map(challenge => ({
        ...challenge,
        company: companiesMap.get(challenge.company_id) || null,
      })) as (Challenge & { company: { company_name: string; logo_url: string } | null })[];
    },
    enabled: !!user,
  });

  // Fetch student's applications
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["applications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("project_applications")
        .select(`
          *,
          challenge:challenges(*)
        `)
        .eq("student_id", user.id)
        .order("applied_at", { ascending: false });

      if (error) throw error;
      return data as (Application & { challenge: Challenge })[];
    },
    enabled: !!user && role === "student",
  });

  // Apply to a challenge
  const applyToChallenge = useMutation({
    mutationFn: async ({ challengeId, coverLetter }: { challengeId: string; coverLetter?: string }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("project_applications")
        .insert({
          student_id: user.id,
          challenge_id: challengeId,
          cover_letter: coverLetter || "",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });

  // Create a challenge (for companies)
  const createChallenge = useMutation({
    mutationFn: async (challengeData: Partial<Challenge>) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("challenges")
        .insert({
          company_id: user.id,
          title: challengeData.title || "",
          description: challengeData.description || "",
          difficulty: challengeData.difficulty || "Medium",
          credits: challengeData.credits || 50,
          deadline: challengeData.deadline,
          required_skills: challengeData.required_skills || [],
          category: challengeData.category || "",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["companyChallenges"] });
    },
  });

  return {
    challenges,
    applications,
    challengesLoading,
    applicationsLoading,
    applyToChallenge,
    createChallenge,
  };
};

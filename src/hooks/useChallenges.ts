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
  instructions?: string;
  restrictions?: string[];
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

interface UseChallengesOptions {
  searchQuery?: string;
  category?: string;
  difficulty?: string;
}

export const useChallenges = (options: UseChallengesOptions = {}) => {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();
  const { searchQuery, category, difficulty } = options;

  // Fetch all active challenges with server-side filtering
  const { data: challenges, isLoading: challengesLoading } = useQuery({
    queryKey: ["challenges", searchQuery, category, difficulty],
    queryFn: async () => {
      let query = supabase
        .from("challenges")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      // Server-side filtering - only return matching rows
      if (category && category !== "all") {
        query = query.eq("category", category);
      }

      if (difficulty && difficulty !== "all") {
        query = query.eq("difficulty", difficulty);
      }

      if (searchQuery && searchQuery.trim()) {
        // Use ilike for case-insensitive search on title and description
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data: challengesData, error: challengesError } = await query;

      if (challengesError) throw challengesError;
      
      // Fetch company profiles separately
      const companyIds = [...new Set(challengesData?.map(c => c.company_id) || [])];
      
      if (companyIds.length === 0) {
        return [];
      }

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

  // Apply to a challenge with optimistic update
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
    // Optimistic update for instant feedback
    onMutate: async ({ challengeId, coverLetter }) => {
      await queryClient.cancelQueries({ queryKey: ["applications", user?.id] });
      
      const previousApplications = queryClient.getQueryData(["applications", user?.id]);
      
      // Optimistically add the application
      queryClient.setQueryData(["applications", user?.id], (old: Application[] = []) => [
        {
          id: `temp-${Date.now()}`,
          student_id: user?.id || "",
          challenge_id: challengeId,
          status: "pending",
          cover_letter: coverLetter || "",
          applied_at: new Date().toISOString(),
        },
        ...old,
      ]);
      
      return { previousApplications };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousApplications) {
        queryClient.setQueryData(["applications", user?.id], context.previousApplications);
      }
    },
    onSettled: () => {
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
          deadline: challengeData.deadline || null,
          required_skills: challengeData.required_skills || [],
          category: challengeData.category || "",
          status: (challengeData.status as "active" | "draft" | "closed") || "active",
          instructions: challengeData.instructions || "",
          restrictions: challengeData.restrictions || [],
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

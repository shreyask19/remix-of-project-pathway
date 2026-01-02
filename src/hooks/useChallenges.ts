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
  estimated_hours?: number;
  tech_stack?: string[];
  stipend_amount?: number | null;
  company?: {
    company_name: string;
    logo_url: string;
    avg_review_time_hours?: number | null;
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

export interface ChallengeFilters {
  searchQuery?: string;
  category?: string;
  difficulty?: string;
  techStack?: string[];
  minCredits?: number;
  maxCredits?: number;
  hasStipend?: boolean;
  companyId?: string;
}

export const useChallenges = (options: ChallengeFilters = {}) => {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();
  const { 
    searchQuery, 
    category, 
    difficulty, 
    techStack, 
    minCredits, 
    maxCredits, 
    hasStipend,
    companyId 
  } = options;

  // Fetch all active challenges with server-side filtering
  const { data: challenges, isLoading: challengesLoading } = useQuery({
    queryKey: ["challenges", searchQuery, category, difficulty, techStack, minCredits, maxCredits, hasStipend, companyId],
    queryFn: async () => {
      let query = supabase
        .from("challenges")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      // Category filter
      if (category && category !== "all") {
        query = query.eq("category", category);
      }

      // Difficulty filter
      if (difficulty && difficulty !== "all") {
        query = query.eq("difficulty", difficulty);
      }

      // Search filter
      if (searchQuery && searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Credits range filter
      if (minCredits !== undefined && minCredits > 0) {
        query = query.gte("credits", minCredits);
      }
      if (maxCredits !== undefined && maxCredits < 500) {
        query = query.lte("credits", maxCredits);
      }

      // Stipend filter
      if (hasStipend) {
        query = query.not("stipend_amount", "is", null).gt("stipend_amount", 0);
      }

      // Company filter
      if (companyId) {
        query = query.eq("company_id", companyId);
      }

      // Tech stack filter using array containment
      // Note: PostgreSQL @> operator checks if array contains all specified elements
      if (techStack && techStack.length > 0) {
        query = query.contains("tech_stack", techStack);
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
        .select("user_id, company_name, logo_url, avg_review_time_hours")
        .in("user_id", companyIds);

      const companiesMap = new Map(companiesData?.map(c => [c.user_id, c]) || []);
      
      return (challengesData || []).map(challenge => ({
        ...challenge,
        company: companiesMap.get(challenge.company_id) || null,
      })) as (Challenge & { company: { company_name: string; logo_url: string; avg_review_time_hours?: number | null } | null })[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
    onMutate: async ({ challengeId, coverLetter }) => {
      await queryClient.cancelQueries({ queryKey: ["applications", user?.id] });
      
      const previousApplications = queryClient.getQueryData(["applications", user?.id]);
      
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

// Hook to fetch available filter options (tech stacks, companies) - cached separately
export const useFilterOptions = () => {
  const { user } = useAuth();

  const { data: techStacks } = useQuery({
    queryKey: ["filterOptions", "techStacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("tech_stack")
        .eq("status", "active");

      if (error) throw error;

      // Flatten and dedupe tech stacks
      const allTechStacks = data
        ?.flatMap((c) => c.tech_stack || [])
        .filter((tech): tech is string => !!tech);
      
      return [...new Set(allTechStacks)].sort();
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: companies } = useQuery({
    queryKey: ["filterOptions", "companies"],
    queryFn: async () => {
      // Get company IDs that have active challenges
      const { data: challengeData, error: challengeError } = await supabase
        .from("challenges")
        .select("company_id")
        .eq("status", "active");

      if (challengeError) throw challengeError;

      const companyIds = [...new Set(challengeData?.map((c) => c.company_id) || [])];
      
      if (companyIds.length === 0) return [];

      const { data, error } = await supabase
        .from("company_profiles")
        .select("user_id, company_name")
        .in("user_id", companyIds);

      if (error) throw error;

      return (data || []).map((c) => ({
        id: c.user_id,
        name: c.company_name,
      }));
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    techStacks: techStacks || [],
    companies: companies || [],
  };
};

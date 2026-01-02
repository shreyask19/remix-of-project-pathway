import { useInfiniteQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Challenge } from "@/hooks/useChallenges";

const PAGE_SIZE = 12;

interface UseInfiniteChallengesOptions {
  searchQuery?: string;
  category?: string;
  difficulty?: string;
}

export const useInfiniteChallenges = (options: UseInfiniteChallengesOptions = {}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { searchQuery, category, difficulty } = options;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["infiniteChallenges", searchQuery, category, difficulty],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      let query = supabase
        .from("challenges")
        .select("*", { count: "exact" })
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .range(start, end);

      if (category && category !== "all") {
        query = query.eq("category", category);
      }

      if (difficulty && difficulty !== "all") {
        query = query.eq("difficulty", difficulty);
      }

      if (searchQuery && searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data: challengesData, error: challengesError, count } = await query;

      if (challengesError) throw challengesError;

      // Fetch company profiles
      const companyIds = [...new Set(challengesData?.map(c => c.company_id) || [])];
      
      let companiesMap = new Map();
      if (companyIds.length > 0) {
        const { data: companiesData } = await supabase
          .from("company_profiles")
          .select("user_id, company_name, logo_url")
          .in("user_id", companyIds);

        companiesMap = new Map(companiesData?.map(c => [c.user_id, c]) || []);
      }

      const challenges = (challengesData || []).map(challenge => ({
        ...challenge,
        company: companiesMap.get(challenge.company_id) || null,
      }));

      return {
        challenges,
        totalCount: count || 0,
        nextPage: challengesData && challengesData.length === PAGE_SIZE ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Flatten all pages into a single array
  const challenges = data?.pages.flatMap(page => page.challenges) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  // Apply mutation
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
    onMutate: async ({ challengeId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["applications"] });
      
      // Snapshot previous value
      const previousApplications = queryClient.getQueryData(["applications", user?.id]);
      
      // Optimistically update
      queryClient.setQueryData(["applications", user?.id], (old: any[] = []) => [
        ...old,
        { challenge_id: challengeId, status: "pending", applied_at: new Date().toISOString() },
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
      queryClient.invalidateQueries({ queryKey: ["infiniteChallenges"] });
    },
  });

  return {
    challenges,
    totalCount,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    applyToChallenge,
  };
};

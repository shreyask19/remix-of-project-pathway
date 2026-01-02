import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ChallengePerformance {
  id: string;
  name: string;
  submissions: number;
  qualified: number;
}

export const useChallengePerformance = () => {
  const { user } = useAuth();

  const { data: performance, isLoading } = useQuery({
    queryKey: ["challengePerformance", user?.id],
    queryFn: async (): Promise<ChallengePerformance[]> => {
      if (!user) return [];

      // Fetch company's challenges
      const { data: challenges } = await supabase
        .from("challenges")
        .select("id, title")
        .eq("company_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!challenges || challenges.length === 0) return [];

      const performanceData: ChallengePerformance[] = [];

      for (const challenge of challenges) {
        // Count total submissions (non-draft)
        const { count: totalSubmissions } = await supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })
          .eq("challenge_id", challenge.id)
          .neq("status", "draft");

        // Count qualified submissions (graded with 70+ or approved)
        const { data: gradedSubmissions } = await supabase
          .from("submissions")
          .select("grade, status")
          .eq("challenge_id", challenge.id)
          .in("status", ["graded", "approved"]);

        const qualified = gradedSubmissions?.filter(s => 
          s.grade && s.grade >= 70
        ).length || 0;

        performanceData.push({
          id: challenge.id,
          name: challenge.title,
          submissions: totalSubmissions || 0,
          qualified,
        });
      }

      return performanceData;
    },
    enabled: !!user,
  });

  return {
    performance: performance || [],
    isLoading,
  };
};

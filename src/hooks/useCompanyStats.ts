import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CompanyStats {
  activeChallenges: number;
  totalSubmissions: number;
  candidatesShortlisted: number;
  hiresMade: number;
  thisMonthChallenges: number;
  thisWeekSubmissions: number;
}

export const useCompanyStats = () => {
  const { user } = useAuth();

  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["companyStats", user?.id],
    queryFn: async (): Promise<CompanyStats> => {
      if (!user) {
        return {
          activeChallenges: 0,
          totalSubmissions: 0,
          candidatesShortlisted: 0,
          hiresMade: 0,
          thisMonthChallenges: 0,
          thisWeekSubmissions: 0,
        };
      }

      // Get date ranges
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString();

      // Fetch active challenges count
      const { count: activeChallenges } = await supabase
        .from("challenges")
        .select("*", { count: "exact", head: true })
        .eq("company_id", user.id)
        .eq("status", "active");

      // Fetch challenges created this month
      const { count: thisMonthChallenges } = await supabase
        .from("challenges")
        .select("*", { count: "exact", head: true })
        .eq("company_id", user.id)
        .gte("created_at", startOfMonth);

      // Fetch total submissions to company's challenges
      const { data: companyChallengess } = await supabase
        .from("challenges")
        .select("id")
        .eq("company_id", user.id);

      const challengeIds = companyChallengess?.map(c => c.id) || [];

      let totalSubmissions = 0;
      let thisWeekSubmissions = 0;

      if (challengeIds.length > 0) {
        // Total submissions
        const { count: submissionsCount } = await supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })
          .in("challenge_id", challengeIds)
          .neq("status", "draft");

        totalSubmissions = submissionsCount || 0;

        // This week's submissions
        const { count: weekSubmissions } = await supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })
          .in("challenge_id", challengeIds)
          .neq("status", "draft")
          .gte("submitted_at", startOfWeek);

        thisWeekSubmissions = weekSubmissions || 0;
      }

      // Fetch candidates shortlisted (in hiring pipeline)
      const { count: candidatesShortlisted } = await supabase
        .from("hiring_pipeline")
        .select("*", { count: "exact", head: true })
        .eq("company_id", user.id);

      // Fetch hires made (pipeline stage = 'hired')
      const { count: hiresMade } = await supabase
        .from("hiring_pipeline")
        .select("*", { count: "exact", head: true })
        .eq("company_id", user.id)
        .eq("stage", "hired");

      return {
        activeChallenges: activeChallenges || 0,
        totalSubmissions,
        candidatesShortlisted: candidatesShortlisted || 0,
        hiresMade: hiresMade || 0,
        thisMonthChallenges: thisMonthChallenges || 0,
        thisWeekSubmissions,
      };
    },
    enabled: !!user,
  });

  return {
    stats: stats || {
      activeChallenges: 0,
      totalSubmissions: 0,
      candidatesShortlisted: 0,
      hiresMade: 0,
      thisMonthChallenges: 0,
      thisWeekSubmissions: 0,
    },
    isLoading,
    refetch,
  };
};

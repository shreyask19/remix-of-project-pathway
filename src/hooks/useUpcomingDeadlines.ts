import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UpcomingDeadline {
  id: string;
  project: string;
  company: string;
  deadline: Date;
  daysLeft: number;
}

export const useUpcomingDeadlines = (limit: number = 5) => {
  const { user } = useAuth();

  const { data: deadlines, isLoading } = useQuery({
    queryKey: ["upcomingDeadlines", user?.id, limit],
    queryFn: async (): Promise<UpcomingDeadline[]> => {
      if (!user) return [];

      // Fetch approved applications with their challenge details
      const { data: applications } = await supabase
        .from("project_applications")
        .select(`
          id,
          challenge:challenges(
            id,
            title,
            deadline,
            company_id
          )
        `)
        .eq("student_id", user.id)
        .eq("status", "approved");

      if (!applications || applications.length === 0) return [];

      // Get company names
      const companyIds = applications
        .map(a => (a.challenge as { company_id: string } | null)?.company_id)
        .filter(Boolean) as string[];
      
      const { data: companies } = await supabase
        .from("company_profiles")
        .select("user_id, company_name")
        .in("user_id", companyIds);

      const companyMap = new Map(
        companies?.map(c => [c.user_id, c.company_name]) || []
      );

      const now = new Date();
      const upcomingDeadlines: UpcomingDeadline[] = [];

      applications.forEach(app => {
        const challenge = app.challenge as { 
          id: string; 
          title: string; 
          deadline: string | null; 
          company_id: string 
        } | null;
        
        if (!challenge?.deadline) return;

        const deadlineDate = new Date(challenge.deadline);
        if (deadlineDate < now) return; // Skip past deadlines

        const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        upcomingDeadlines.push({
          id: app.id,
          project: challenge.title,
          company: companyMap.get(challenge.company_id) || "Company",
          deadline: deadlineDate,
          daysLeft,
        });
      });

      // Sort by deadline and limit
      return upcomingDeadlines
        .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
        .slice(0, limit);
    },
    enabled: !!user,
  });

  return {
    deadlines: deadlines || [],
    isLoading,
  };
};

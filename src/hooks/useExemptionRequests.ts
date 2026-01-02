import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ExemptionRequest {
  id: string;
  student_id: string;
  subject: string;
  reason: string;
  credits_at_request: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at: string | null;
  teacher_id: string | null;
}

export const useExemptionRequests = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["exemptionRequests", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("exemption_requests")
        .select("*")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ExemptionRequest[];
    },
    enabled: !!user,
  });

  const createRequest = useMutation({
    mutationFn: async ({ subject, reason, creditsAtRequest }: { 
      subject: string; 
      reason: string; 
      creditsAtRequest: number;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("exemption_requests")
        .insert({
          student_id: user.id,
          subject,
          reason,
          credits_at_request: creditsAtRequest,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exemptionRequests"] });
    },
  });

  return {
    requests: requests || [],
    isLoading,
    createRequest,
    pendingCount: requests?.filter(r => r.status === "pending").length || 0,
    approvedCount: requests?.filter(r => r.status === "approved").length || 0,
  };
};

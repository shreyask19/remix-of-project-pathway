import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type PipelineStage = "shortlisted" | "interviewing" | "offer_sent" | "hired" | "rejected";

export interface PipelineCandidate {
  id: string;
  studentId: string;
  companyId: string;
  stage: PipelineStage;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  student?: {
    firstName: string;
    lastName: string;
    email: string;
    university: string | null;
    skills: string[];
    credits: number;
  };
}

const transformCandidate = (row: any): PipelineCandidate => ({
  id: row.id,
  studentId: row.student_id,
  companyId: row.company_id,
  stage: row.stage,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  student: row.profiles ? {
    firstName: row.profiles.first_name,
    lastName: row.profiles.last_name,
    email: row.profiles.email,
    university: row.student_profiles?.university_name || null,
    skills: row.student_profiles?.existing_skills || [],
    credits: row.student_profiles?.total_credits || 0,
  } : undefined,
});

export const useHiringPipeline = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: candidates, isLoading } = useQuery({
    queryKey: ["hiringPipeline", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("hiring_pipeline")
        .select(`
          *,
          profiles!hiring_pipeline_student_id_fkey (
            first_name,
            last_name,
            email
          ),
          student_profiles!hiring_pipeline_student_id_fkey (
            university_name,
            existing_skills,
            total_credits
          )
        `)
        .eq("company_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(transformCandidate);
    },
    enabled: !!user,
  });

  const updateStage = useMutation({
    mutationFn: async ({ candidateId, stage, notes }: { candidateId: string; stage: PipelineStage; notes?: string }) => {
      const updateData: any = { stage, updated_at: new Date().toISOString() };
      if (notes !== undefined) updateData.notes = notes;
      
      const { error } = await supabase
        .from("hiring_pipeline")
        .update(updateData)
        .eq("id", candidateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hiringPipeline"] });
      toast.success("Candidate stage updated");
    },
    onError: () => {
      toast.error("Failed to update candidate");
    },
  });

  const addToePipeline = useMutation({
    mutationFn: async ({ studentId, notes }: { studentId: string; notes?: string }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("hiring_pipeline")
        .insert({
          company_id: user.id,
          student_id: studentId,
          stage: "shortlisted",
          notes,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hiringPipeline"] });
      toast.success("Candidate added to pipeline");
    },
    onError: () => {
      toast.error("Failed to add candidate");
    },
  });

  // Group by stage
  const byStage = {
    shortlisted: candidates?.filter(c => c.stage === "shortlisted") || [],
    interviewing: candidates?.filter(c => c.stage === "interviewing") || [],
    offer_sent: candidates?.filter(c => c.stage === "offer_sent") || [],
    hired: candidates?.filter(c => c.stage === "hired") || [],
    rejected: candidates?.filter(c => c.stage === "rejected") || [],
  };

  const stageCounts = {
    shortlisted: byStage.shortlisted.length,
    interviewing: byStage.interviewing.length,
    offer_sent: byStage.offer_sent.length,
    hired: byStage.hired.length,
  };

  return {
    candidates,
    byStage,
    stageCounts,
    isLoading,
    updateStage,
    addToePipeline,
  };
};

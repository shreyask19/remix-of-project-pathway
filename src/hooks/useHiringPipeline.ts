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
      if (!user) throw new Error("Not authenticated");
      
      const updateData: Record<string, unknown> = { stage, updated_at: new Date().toISOString() };
      if (notes !== undefined) updateData.notes = notes;
      
      // Get candidate info first
      const { data: candidate } = await supabase
        .from("hiring_pipeline")
        .select("student_id")
        .eq("id", candidateId)
        .single();
      
      const { error } = await supabase
        .from("hiring_pipeline")
        .update(updateData)
        .eq("id", candidateId);

      if (error) throw error;

      // Log activity
      await supabase.rpc("log_activity", {
        p_user_id: user.id,
        p_action_type: `pipeline_${stage}`,
        p_entity_type: "hiring_pipeline",
        p_entity_id: candidateId,
        p_metadata: { stage, student_id: candidate?.student_id },
      });

      // Notify student about stage change
      if (candidate?.student_id) {
        const stageMessages: Record<string, string> = {
          interviewing: "You've been moved to the interview stage!",
          offer_sent: "Exciting news! A company wants to make you an offer.",
          hired: "Congratulations! You've been hired! 🎉",
          rejected: "Your application status has been updated.",
        };

        if (stageMessages[stage]) {
          await supabase.from("notifications").insert({
            user_id: candidate.student_id,
            type: stage === "hired" ? "success" : stage === "rejected" ? "info" : "info",
            title: stage === "hired" ? "You're Hired!" : "Pipeline Update",
            message: stageMessages[stage],
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hiringPipeline"] });
      toast.success("Candidate stage updated");
    },
    onError: () => {
      toast.error("Failed to update candidate");
    },
  });

  const addToPipeline = useMutation({
    mutationFn: async ({ studentId, notes, sendInvite = false, role }: { 
      studentId: string; 
      notes?: string;
      sendInvite?: boolean;
      role?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      
      // Add to pipeline
      const { data: pipelineEntry, error } = await supabase
        .from("hiring_pipeline")
        .insert({
          company_id: user.id,
          student_id: studentId,
          stage: "shortlisted",
          notes,
        })
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await supabase.rpc("log_activity", {
        p_user_id: user.id,
        p_action_type: "candidate_shortlisted",
        p_entity_type: "hiring_pipeline",
        p_entity_id: pipelineEntry.id,
        p_metadata: { student_id: studentId },
      });

      // Notify student they've been shortlisted
      await supabase.from("notifications").insert({
        user_id: studentId,
        type: "info",
        title: "You've Been Shortlisted! 🌟",
        message: "A company has added you to their hiring pipeline. Keep up the great work!",
      });

      // Optionally send interview invitation
      if (sendInvite && role) {
        await supabase.from("invitations").insert({
          company_id: user.id,
          student_id: studentId,
          role,
          type: "interview",
          message: notes,
        });

        await supabase.from("notifications").insert({
          user_id: studentId,
          type: "info",
          title: "Interview Invitation",
          message: `A company wants to interview you for the ${role} position.`,
        });
      }

      return pipelineEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hiringPipeline"] });
      queryClient.invalidateQueries({ queryKey: ["talentPool"] });
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
    addToPipeline,
  };
};

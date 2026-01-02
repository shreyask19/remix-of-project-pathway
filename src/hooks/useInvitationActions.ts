import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type InvitationType = "interview" | "offer";

interface SendInvitationParams {
  studentId: string;
  role: string;
  type?: InvitationType;
  message?: string;
}

export const useInvitationActions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Send an invitation (interview or job offer)
  const sendInvitation = useMutation({
    mutationFn: async ({ 
      studentId, 
      role, 
      type = "interview",
      message 
    }: SendInvitationParams) => {
      if (!user) throw new Error("Not authenticated");

      // Insert invitation
      const { data: invitation, error } = await supabase
        .from("invitations")
        .insert({
          company_id: user.id,
          student_id: studentId,
          role,
          type,
          message,
        })
        .select()
        .single();

      if (error) throw error;

      // Notify student
      await supabase.from("notifications").insert({
        user_id: studentId,
        type: type === "offer" ? "success" : "info",
        title: type === "offer" ? "🎉 Job Offer Received!" : "Interview Invitation",
        message: type === "offer" 
          ? `You've received a job offer for the ${role} position. Review and respond in your Hiring section.`
          : `A company wants to interview you for the ${role} position.`,
      });

      // Log activity
      await supabase.rpc("log_activity", {
        p_user_id: user.id,
        p_action_type: type === "offer" ? "offer_sent" : "interview_invited",
        p_entity_type: "invitation",
        p_entity_id: invitation.id,
        p_metadata: { student_id: studentId, role, type },
      });

      return invitation;
    },
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries({ queryKey: ["companyInvitations"] });
      queryClient.invalidateQueries({ queryKey: ["hiringPipeline"] });
      toast.success(type === "offer" ? "Job offer sent!" : "Interview invitation sent!");
    },
    onError: (error) => {
      toast.error(`Failed to send invitation: ${error.message}`);
    },
  });

  // Accept an invitation (student action)
  const acceptInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      if (!user) throw new Error("Not authenticated");

      // Get invitation details
      const { data: invitation, error: fetchError } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", invitationId)
        .single();

      if (fetchError) throw fetchError;

      // Get company name separately
      const { data: company } = await supabase
        .from("company_profiles")
        .select("company_name")
        .eq("user_id", invitation.company_id)
        .single();

      // Update invitation status
      const { error } = await supabase
        .from("invitations")
        .update({
          status: "accepted",
          responded_at: new Date().toISOString(),
        })
        .eq("id", invitationId);

      if (error) throw error;

      // If this was an offer, update pipeline to hired
      if (invitation.type === "offer") {
        await supabase
          .from("hiring_pipeline")
          .update({ stage: "hired", updated_at: new Date().toISOString() })
          .eq("company_id", invitation.company_id)
          .eq("student_id", user.id);

        // Log activity
        await supabase.rpc("log_activity", {
          p_user_id: user.id,
          p_action_type: "offer_accepted",
          p_entity_type: "invitation",
          p_entity_id: invitationId,
          p_metadata: { company_id: invitation.company_id },
        });
      } else {
        // For interview, move to interviewing stage
        const { data: existing } = await supabase
          .from("hiring_pipeline")
          .select("id")
          .eq("company_id", invitation.company_id)
          .eq("student_id", user.id)
          .single();

        if (existing) {
          await supabase
            .from("hiring_pipeline")
            .update({ stage: "interviewing", updated_at: new Date().toISOString() })
            .eq("id", existing.id);
        }

        // Log activity
        await supabase.rpc("log_activity", {
          p_user_id: user.id,
          p_action_type: "interview_accepted",
          p_entity_type: "invitation",
          p_entity_id: invitationId,
          p_metadata: { company_id: invitation.company_id },
        });
      }

      // Notify company
      await supabase.from("notifications").insert({
        user_id: invitation.company_id,
        type: "success",
        title: invitation.type === "offer" ? "Offer Accepted! 🎉" : "Interview Accepted",
        message: invitation.type === "offer"
          ? `Great news! Your job offer for ${invitation.role} has been accepted.`
          : `A candidate has accepted your interview invitation for ${invitation.role}.`,
      });

      return invitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentInvitations"] });
      queryClient.invalidateQueries({ queryKey: ["studentPipeline"] });
      toast.success("Invitation accepted!");
    },
    onError: (error) => {
      toast.error(`Failed to accept: ${error.message}`);
    },
  });

  // Decline an invitation (student action)
  const declineInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      if (!user) throw new Error("Not authenticated");

      // Get invitation details
      const { data: invitation, error: fetchError } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", invitationId)
        .single();

      if (fetchError) throw fetchError;

      // Update invitation status
      const { error } = await supabase
        .from("invitations")
        .update({
          status: "declined",
          responded_at: new Date().toISOString(),
        })
        .eq("id", invitationId);

      if (error) throw error;

      // If offer was declined, update pipeline to rejected
      if (invitation.type === "offer") {
        await supabase
          .from("hiring_pipeline")
          .update({ stage: "rejected", updated_at: new Date().toISOString() })
          .eq("company_id", invitation.company_id)
          .eq("student_id", user.id);
      }

      // Log activity
      await supabase.rpc("log_activity", {
        p_user_id: user.id,
        p_action_type: invitation.type === "offer" ? "offer_declined" : "interview_declined",
        p_entity_type: "invitation",
        p_entity_id: invitationId,
        p_metadata: { company_id: invitation.company_id },
      });

      // Notify company
      await supabase.from("notifications").insert({
        user_id: invitation.company_id,
        type: "info",
        title: invitation.type === "offer" ? "Offer Declined" : "Interview Declined",
        message: `A candidate has declined your ${invitation.type === "offer" ? "job offer" : "interview invitation"} for ${invitation.role}.`,
      });

      return invitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentInvitations"] });
      queryClient.invalidateQueries({ queryKey: ["studentPipeline"] });
      toast.info("Invitation declined");
    },
    onError: (error) => {
      toast.error(`Failed to decline: ${error.message}`);
    },
  });

  return {
    sendInvitation,
    acceptInvitation,
    declineInvitation,
  };
};

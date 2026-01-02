import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SubmissionData {
  githubUrl: string;
  videoUrl: string;
  notes: string;
}

export const useSubmissionWorkflow = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Create a draft submission when starting work
  const createDraftSubmission = useMutation({
    mutationFn: async ({
      applicationId,
      challengeId,
    }: {
      applicationId: string;
      challengeId: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Check if submission already exists
      const { data: existing } = await supabase
        .from("submissions")
        .select("id")
        .eq("application_id", applicationId)
        .single();

      if (existing) {
        return existing;
      }

      const { data, error } = await supabase
        .from("submissions")
        .insert({
          application_id: applicationId,
          challenge_id: challengeId,
          student_id: user.id,
          status: "draft",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
      queryClient.invalidateQueries({ queryKey: ["studentSubmissions"] });
    },
  });

  // Submit the final project
  const submitProject = useMutation({
    mutationFn: async ({
      submissionId,
      githubUrl,
      videoUrl,
      notes,
    }: {
      submissionId: string;
    } & SubmissionData) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("submissions")
        .update({
          files_url: githubUrl,
          video_url: videoUrl,
          notes,
          status: "submitted",
          submitted_at: new Date().toISOString(),
        })
        .eq("id", submissionId)
        .eq("student_id", user.id)
        .select(`
          *,
          challenge:challenges(id, title, company_id)
        `)
        .single();

      if (error) throw error;

      // Notify the company about the submission
      if (data.challenge?.company_id) {
        await supabase.from("notifications").insert({
          user_id: data.challenge.company_id,
          type: "info",
          title: "New Project Submission",
          message: `A student has submitted their project for "${data.challenge.title}"`,
        });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
      queryClient.invalidateQueries({ queryKey: ["studentSubmissions"] });
      toast.success("Project submitted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to submit: ${error.message}`);
    },
  });

  // Save draft (auto-save)
  const saveDraft = useMutation({
    mutationFn: async ({
      submissionId,
      githubUrl,
      videoUrl,
      notes,
    }: {
      submissionId: string;
    } & Partial<SubmissionData>) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("submissions")
        .update({
          files_url: githubUrl || null,
          video_url: videoUrl || null,
          notes: notes || null,
        })
        .eq("id", submissionId)
        .eq("student_id", user.id);

      if (error) throw error;
    },
  });

  return {
    createDraftSubmission,
    submitProject,
    saveDraft,
  };
};

// Hook for company grading with notification
export const useGradingWorkflow = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const gradeSubmission = useMutation({
    mutationFn: async ({
      submissionId,
      grade,
      feedback,
    }: {
      submissionId: string;
      grade: number;
      feedback: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Get submission with student and teacher info
      const { data: submission, error: fetchError } = await supabase
        .from("submissions")
        .select(`
          id,
          student_id,
          challenge:challenges(id, title, credits)
        `)
        .eq("id", submissionId)
        .single();

      if (fetchError) throw fetchError;

      // Update submission with grade
      const { error: updateError } = await supabase
        .from("submissions")
        .update({
          status: "graded",
          grade,
          company_feedback: feedback,
          graded_at: new Date().toISOString(),
        })
        .eq("id", submissionId);

      if (updateError) throw updateError;

      // Notify student about the grade
      await supabase.from("notifications").insert({
        user_id: submission.student_id,
        type: "success",
        title: "Project Graded!",
        message: `Your submission for "${submission.challenge?.title}" has been graded. Check your submissions for feedback.`,
      });

      // Get teachers from same institution to notify
      const { data: studentProfile } = await supabase
        .from("student_profiles")
        .select("institution_id")
        .eq("user_id", submission.student_id)
        .single();

      if (studentProfile?.institution_id) {
        // Get teachers from same institution
        const { data: teachers } = await supabase
          .from("teacher_profiles")
          .select("user_id")
          .eq("institution_id", studentProfile.institution_id);

        // Notify teachers about pending approval
        if (teachers && teachers.length > 0) {
          const notifications = teachers.map((t) => ({
            user_id: t.user_id,
            type: "info",
            title: "Grade Pending Approval",
            message: `A company has graded a submission for "${submission.challenge?.title}". Please review and approve.`,
          }));

          await supabase.from("notifications").insert(notifications);
        }
      }

      return submission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companySubmissions"] });
      toast.success("Grade submitted and notifications sent!");
    },
  });

  return { gradeSubmission };
};

// Hook for teacher approval with notifications
export const useApprovalWorkflow = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const approveGrade = useMutation({
    mutationFn: async ({
      submissionId,
      credits,
      challengeId,
    }: {
      submissionId: string;
      credits: number;
      challengeId: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Use the RPC function to atomically approve and award credits
      const { data, error } = await supabase.rpc("approve_grade_and_award_credits", {
        p_submission_id: submissionId,
        p_teacher_id: user.id,
        p_credits: credits,
        p_challenge_id: challengeId,
      });

      if (error) throw error;

      const result = data as { success: boolean; student_id?: string; credits_awarded?: number };
      
      if (result.success && result.student_id) {
        // Notify student about credits awarded
        await supabase.from("notifications").insert({
          user_id: result.student_id,
          type: "success",
          title: "Credits Awarded! 🎉",
          message: `Congratulations! You've been awarded ${result.credits_awarded} credits for your approved project.`,
        });
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherPendingGrades"] });
      queryClient.invalidateQueries({ queryKey: ["studentSubmissions"] });
      toast.success("Grade approved and credits awarded!");
    },
  });

  const disputeGrade = useMutation({
    mutationFn: async ({
      submissionId,
      reason,
    }: {
      submissionId: string;
      reason: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Get submission info
      const { data: submission } = await supabase
        .from("submissions")
        .select(`
          id,
          challenge:challenges(id, title, company_id)
        `)
        .eq("id", submissionId)
        .single();

      // Update submission status
      const { error } = await supabase
        .from("submissions")
        .update({ status: "disputed" })
        .eq("id", submissionId);

      if (error) throw error;

      // Create dispute record
      await supabase.from("grade_approvals").upsert({
        submission_id: submissionId,
        teacher_id: user.id,
        status: "disputed",
        dispute_reason: reason,
      });

      // Notify company about the dispute
      if (submission?.challenge?.company_id) {
        await supabase.from("notifications").insert({
          user_id: submission.challenge.company_id,
          type: "warning",
          title: "Grade Disputed",
          message: `A teacher has disputed the grade for "${submission.challenge.title}". Reason: ${reason}`,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherPendingGrades"] });
      toast.info("Grade disputed. Company has been notified.");
    },
  });

  return { approveGrade, disputeGrade };
};

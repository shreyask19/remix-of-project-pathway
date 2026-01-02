import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type SubmissionStatus = Database["public"]["Enums"]["submission_status"];

export interface Submission {
  id: string;
  student_id: string;
  challenge_id: string;
  application_id: string;
  status: SubmissionStatus;
  files_url: string | null;
  video_url: string | null;
  notes: string | null;
  grade: number | null;
  company_feedback: string | null;
  teacher_feedback: string | null;
  submitted_at: string | null;
  graded_at: string | null;
  approved_at: string | null;
  created_at: string;
  challenge?: {
    id: string;
    title: string;
    credits: number;
    company_id: string;
  };
  student?: {
    user_id: string;
    university_name: string | null;
  };
  studentProfile?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

// Hook for students to view their own submissions
export const useStudentSubmissions = () => {
  const { user } = useAuth();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["studentSubmissions", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("submissions")
        .select(`
          *,
          challenge:challenges(id, title, credits, company_id)
        `)
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Submission[];
    },
    enabled: !!user,
  });

  // Submission stats
  const stats = {
    total: submissions?.length || 0,
    graded: submissions?.filter(s => s.status === "graded" || s.status === "approved").length || 0,
    underReview: submissions?.filter(s => s.status === "submitted").length || 0,
    excellent: submissions?.filter(s => s.grade && s.grade >= 90).length || 0,
  };

  return { submissions, isLoading, stats };
};

// Hook for companies to view submissions to their challenges
export const useCompanySubmissions = (statusFilter?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["companySubmissions", user?.id, statusFilter],
    queryFn: async () => {
      if (!user) return [];

      // First get the company's challenges
      const { data: challenges, error: challengesError } = await supabase
        .from("challenges")
        .select("id")
        .eq("company_id", user.id);

      if (challengesError) throw challengesError;
      
      const challengeIds = challenges?.map(c => c.id) || [];
      if (challengeIds.length === 0) return [];

      let query = supabase
        .from("submissions")
        .select(`
          *,
          challenge:challenges(id, title, credits, company_id)
        `)
        .in("challenge_id", challengeIds)
        .order("created_at", { ascending: false });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter as SubmissionStatus);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch student profiles for names
      const studentIds = [...new Set(data?.map(s => s.student_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .in("id", studentIds);

      // Fetch student university info
      const { data: studentProfiles } = await supabase
        .from("student_profiles")
        .select("user_id, university_name")
        .in("user_id", studentIds);

      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
      const studentProfilesMap = new Map(studentProfiles?.map(p => [p.user_id, p]) || []);

      return (data || []).map(submission => ({
        ...submission,
        studentProfile: profilesMap.get(submission.student_id) || null,
        student: studentProfilesMap.get(submission.student_id) || null,
      })) as (Submission & { 
        studentProfile: { first_name: string; last_name: string; email: string } | null;
        student: { user_id: string; university_name: string | null } | null;
      })[];
    },
    enabled: !!user,
  });

  // Grade a submission
  const gradeSubmission = useMutation({
    mutationFn: async ({ 
      submissionId, 
      grade, 
      feedback 
    }: { 
      submissionId: string; 
      grade: number; 
      feedback: string;
    }) => {
      const { data, error } = await supabase
        .from("submissions")
        .update({
          status: "graded" as SubmissionStatus,
          grade,
          company_feedback: feedback,
          graded_at: new Date().toISOString(),
        })
        .eq("id", submissionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companySubmissions"] });
    },
  });

  // Start reviewing a submission
  const startReview = useMutation({
    mutationFn: async (submissionId: string) => {
      // Just mark it as being reviewed (status stays submitted)
      return submissionId;
    },
  });

  const stats = {
    total: submissions?.length || 0,
    new: submissions?.filter(s => s.status === "submitted").length || 0,
    reviewing: submissions?.filter(s => s.status === "submitted").length || 0,
    graded: submissions?.filter(s => s.status === "graded" || s.status === "approved").length || 0,
  };

  return { submissions, isLoading, stats, gradeSubmission, startReview };
};

// Hook for teachers to view and approve submissions
export const useTeacherSubmissions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: pendingGrades, isLoading: gradesLoading } = useQuery({
    queryKey: ["teacherPendingGrades", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("submissions")
        .select(`
          *,
          challenge:challenges(id, title, credits, company_id)
        `)
        .eq("status", "graded")
        .order("graded_at", { ascending: false });

      if (error) throw error;

      // Fetch student profiles
      const studentIds = [...new Set(data?.map(s => s.student_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .in("id", studentIds);

      // Fetch company info
      const companyIds = [...new Set(data?.map(s => s.challenge?.company_id).filter(Boolean) || [])];
      const { data: companies } = await supabase
        .from("company_profiles")
        .select("user_id, company_name")
        .in("user_id", companyIds);

      // Fetch submission files for artifacts
      const submissionIds = data?.map(s => s.id) || [];
      const { data: submissionFiles } = await supabase
        .from("submission_files")
        .select("submission_id, file_name, file_path, file_type")
        .in("submission_id", submissionIds);

      const filesMap = new Map<string, typeof submissionFiles>();
      submissionFiles?.forEach(file => {
        const existing = filesMap.get(file.submission_id) || [];
        existing.push(file);
        filesMap.set(file.submission_id, existing);
      });

      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
      const companiesMap = new Map(companies?.map(c => [c.user_id, c]) || []);

      return (data || []).map(submission => ({
        ...submission,
        studentProfile: profilesMap.get(submission.student_id) || null,
        companyProfile: submission.challenge ? companiesMap.get(submission.challenge.company_id) || null : null,
        artifactFiles: filesMap.get(submission.id) || [],
      }));
    },
    enabled: !!user,
  });

  // Approve a grade using the atomic RPC function
  const approveGrade = useMutation({
    mutationFn: async ({ 
      submissionId, 
      credits, 
      challengeId 
    }: { 
      submissionId: string; 
      credits: number;
      challengeId: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.rpc("approve_grade_and_award_credits", {
        p_submission_id: submissionId,
        p_teacher_id: user.id,
        p_credits: credits,
        p_challenge_id: challengeId,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherPendingGrades"] });
    },
  });

  // Dispute a grade
  const disputeGrade = useMutation({
    mutationFn: async ({ 
      submissionId, 
      reason 
    }: { 
      submissionId: string; 
      reason: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("submissions")
        .update({ status: "disputed" as SubmissionStatus })
        .eq("id", submissionId);

      if (error) throw error;

      // Create grade approval record with dispute
      const { error: approvalError } = await supabase
        .from("grade_approvals")
        .upsert({
          submission_id: submissionId,
          teacher_id: user.id,
          status: "disputed",
          dispute_reason: reason,
        });

      if (approvalError) throw approvalError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherPendingGrades"] });
    },
  });

  return { pendingGrades, gradesLoading, approveGrade, disputeGrade };
};

// Hook for exemption requests
export const useExemptionRequests = () => {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["exemptionRequests", user?.id, role],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from("exemption_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (role === "student") {
        query = query.eq("student_id", user.id);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch student profiles for teacher view
      if (role === "teacher" && data && data.length > 0) {
        const studentIds = [...new Set(data.map(r => r.student_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, first_name, last_name")
          .in("id", studentIds);

        const { data: studentProfiles } = await supabase
          .from("student_profiles")
          .select("user_id, total_credits")
          .in("user_id", studentIds);

        const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
        const creditsMap = new Map(studentProfiles?.map(p => [p.user_id, p.total_credits]) || []);

        return data.map(request => ({
          ...request,
          studentProfile: profilesMap.get(request.student_id) || null,
          currentCredits: creditsMap.get(request.student_id) || 0,
        }));
      }

      return data;
    },
    enabled: !!user,
  });

  const approveExemption = useMutation({
    mutationFn: async (requestId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("exemption_requests")
        .update({ 
          status: "approved", 
          teacher_id: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exemptionRequests"] });
    },
  });

  const rejectExemption = useMutation({
    mutationFn: async (requestId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("exemption_requests")
        .update({ 
          status: "rejected", 
          teacher_id: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exemptionRequests"] });
    },
  });

  const createRequest = useMutation({
    mutationFn: async ({ subject, reason, credits }: { subject: string; reason: string; credits: number }) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("exemption_requests")
        .insert({
          student_id: user.id,
          subject,
          reason,
          credits_at_request: credits,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exemptionRequests"] });
    },
  });

  return { 
    requests, 
    isLoading, 
    approveExemption, 
    rejectExemption,
    createRequest,
  };
};

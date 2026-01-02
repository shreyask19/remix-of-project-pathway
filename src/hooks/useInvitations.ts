import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Invitation {
  id: string;
  companyId: string;
  studentId: string;
  role: string;
  type: string;
  message: string | null;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  respondedAt: string | null;
  company?: {
    companyName: string;
    logoUrl: string | null;
    industry: string | null;
    headquarters: string | null;
  };
}

const transformInvitation = (inv: any): Invitation => ({
  id: inv.id,
  companyId: inv.company_id,
  studentId: inv.student_id,
  role: inv.role,
  type: inv.type,
  message: inv.message,
  status: inv.status,
  createdAt: inv.created_at,
  respondedAt: inv.responded_at,
  company: inv.company_profiles ? {
    companyName: inv.company_profiles.company_name,
    logoUrl: inv.company_profiles.logo_url,
    industry: inv.company_profiles.industry,
    headquarters: inv.company_profiles.headquarters,
  } : undefined,
});

export const useStudentInvitations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: invitations, isLoading } = useQuery({
    queryKey: ["studentInvitations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("invitations")
        .select(`
          *,
          company_profiles!invitations_company_id_fkey (
            company_name,
            logo_url,
            industry,
            headquarters
          )
        `)
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(transformInvitation);
    },
    enabled: !!user,
  });

  const respondToInvitation = useMutation({
    mutationFn: async ({ invitationId, accept }: { invitationId: string; accept: boolean }) => {
      const { error } = await supabase
        .from("invitations")
        .update({
          status: accept ? "accepted" : "declined",
          responded_at: new Date().toISOString(),
        })
        .eq("id", invitationId);

      if (error) throw error;
    },
    onSuccess: (_, { accept }) => {
      queryClient.invalidateQueries({ queryKey: ["studentInvitations"] });
      toast.success(accept ? "Invitation accepted!" : "Invitation declined");
    },
    onError: () => {
      toast.error("Failed to respond to invitation");
    },
  });

  const pendingInvitations = invitations?.filter(i => i.status === "pending") || [];
  const respondedInvitations = invitations?.filter(i => i.status !== "pending") || [];

  return {
    invitations,
    pendingInvitations,
    respondedInvitations,
    isLoading,
    respondToInvitation,
  };
};

export const useCompanyInvitations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: invitations, isLoading } = useQuery({
    queryKey: ["companyInvitations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("invitations")
        .select(`
          *,
          student_profiles!invitations_student_id_fkey (
            user_id,
            university_name,
            existing_skills,
            total_credits
          ),
          profiles!inner (
            first_name,
            last_name,
            email
          )
        `)
        .eq("company_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const sendInvitation = useMutation({
    mutationFn: async ({ 
      studentId, 
      role, 
      type = "interview",
      message 
    }: { 
      studentId: string; 
      role: string; 
      type?: string;
      message?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("invitations")
        .insert({
          company_id: user.id,
          student_id: studentId,
          role,
          type,
          message,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyInvitations"] });
      toast.success("Invitation sent!");
    },
    onError: () => {
      toast.error("Failed to send invitation");
    },
  });

  return {
    invitations,
    isLoading,
    sendInvitation,
  };
};

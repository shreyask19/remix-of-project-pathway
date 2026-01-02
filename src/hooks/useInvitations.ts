import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useEffect } from "react";

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
      
      // Fetch invitations first
      const { data: invitationsData, error: invError } = await supabase
        .from("invitations")
        .select("*")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (invError) throw invError;
      if (!invitationsData || invitationsData.length === 0) return [];
      
      // Fetch company profiles separately
      const companyIds = [...new Set(invitationsData.map(inv => inv.company_id))];
      const { data: companiesData } = await supabase
        .from("company_profiles")
        .select("user_id, company_name, logo_url, industry, headquarters")
        .in("user_id", companyIds);

      const companiesMap = new Map(companiesData?.map(c => [c.user_id, c]) || []);
      
      return invitationsData.map(inv => ({
        ...inv,
        company_profiles: companiesMap.get(inv.company_id) || null,
      })).map(transformInvitation);
    },
    enabled: !!user,
  });

  // Realtime subscription for new invitations
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("student-invitations-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "invitations",
          filter: `student_id=eq.${user.id}`,
        },
        (payload) => {
          const type = payload.new.type;
          if (type === "interview") {
            toast.info("You have a new interview invitation! 📧");
          } else if (type === "offer") {
            toast.success("You received a job offer! 🎉");
          }
          queryClient.invalidateQueries({ queryKey: ["studentInvitations"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

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

  // Realtime subscription for invitation responses
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("company-invitations-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "invitations",
          filter: `company_id=eq.${user.id}`,
        },
        (payload) => {
          const status = payload.new.status;
          if (status === "accepted") {
            toast.success("A student has accepted your invitation! 🎉");
          } else if (status === "declined") {
            toast.info("A student has declined your invitation.");
          }
          queryClient.invalidateQueries({ queryKey: ["companyInvitations"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

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

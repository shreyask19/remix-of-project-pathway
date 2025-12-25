import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CompanyProfileData {
  companyName: string;
  industry: string;
  companySize: string;
  website: string;
  headquarters: string;
  description: string;
  contactRole: string;
  hiringRoles: string[];
  requiredSkills: string[];
  logoUrl?: string;
}

export const useCompanyProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["companyProfile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const saveProfile = useMutation({
    mutationFn: async (profileData: CompanyProfileData) => {
      if (!user) throw new Error("Not authenticated");

      const dbData = {
        user_id: user.id,
        company_name: profileData.companyName,
        industry: profileData.industry,
        company_size: profileData.companySize,
        website: profileData.website,
        headquarters: profileData.headquarters,
        description: profileData.description,
        contact_role: profileData.contactRole,
        hiring_roles: profileData.hiringRoles,
        required_skills: profileData.requiredSkills,
        logo_url: profileData.logoUrl || '',
      };

      const { data, error } = await supabase
        .from("company_profiles")
        .upsert(dbData, { onConflict: "user_id" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
    },
  });

  return {
    profile,
    isLoading,
    saveProfile,
  };
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface TeacherSettings {
  id: string;
  user_id: string;
  credit_threshold: number;
  min_projects: number;
  ia_deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeacherSettingsInput {
  credit_threshold: number;
  min_projects: number;
  ia_deadline?: string | null;
}

export const useTeacherSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["teacherSettings", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("teacher_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as TeacherSettings | null;
    },
    enabled: !!user,
  });

  const saveSettings = useMutation({
    mutationFn: async (input: TeacherSettingsInput) => {
      if (!user) throw new Error("Not authenticated");

      const dbData = {
        user_id: user.id,
        credit_threshold: input.credit_threshold,
        min_projects: input.min_projects,
        ia_deadline: input.ia_deadline || null,
      };

      const { data, error } = await supabase
        .from("teacher_settings")
        .upsert(dbData, { onConflict: "user_id" })
        .select()
        .single();

      if (error) throw error;
      return data as TeacherSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherSettings"] });
    },
  });

  // Return default values if no settings exist yet
  const defaultSettings: TeacherSettingsInput = {
    credit_threshold: 500,
    min_projects: 3,
    ia_deadline: null,
  };

  return {
    settings: settings || defaultSettings,
    isLoading,
    saveSettings,
  };
};

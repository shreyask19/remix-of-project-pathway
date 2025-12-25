import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface TeacherProfileData {
  designation: string;
  institutionName: string;
  institutionType: string;
  department: string;
  employeeId: string;
  yearsOfExperience: string;
  subjectsTaught: string[];
  specializations: string[];
}

export const useTeacherProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["teacherProfile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("teacher_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const saveProfile = useMutation({
    mutationFn: async (profileData: TeacherProfileData) => {
      if (!user) throw new Error("Not authenticated");

      const dbData = {
        user_id: user.id,
        designation: profileData.designation,
        institution_name: profileData.institutionName,
        institution_type: profileData.institutionType,
        department: profileData.department,
        employee_id: profileData.employeeId,
        years_of_experience: profileData.yearsOfExperience,
        subjects_taught: profileData.subjectsTaught,
        specializations: profileData.specializations,
      };

      const { data, error } = await supabase
        .from("teacher_profiles")
        .upsert(dbData, { onConflict: "user_id" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherProfile"] });
    },
  });

  return {
    profile,
    isLoading,
    saveProfile,
  };
};

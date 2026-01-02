import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type VouchType = "punctuality" | "professionalism" | "reliability";

export interface TeacherVouch {
  id: string;
  teacher_id: string;
  student_id: string;
  vouch_type: VouchType;
  created_at: string;
}

export interface StudentBadges {
  total: number;
  punctuality: number;
  professionalism: number;
  reliability: number;
  vouches: TeacherVouch[];
}

export const useReliabilityBadge = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Award a badge to a student
  const awardBadge = useMutation({
    mutationFn: async ({ studentId, vouchType }: { studentId: string; vouchType: VouchType }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("teacher_vouches")
        .insert({
          teacher_id: user.id,
          student_id: studentId,
          vouch_type: vouchType,
        })
        .select()
        .single();

      if (error) {
        // Handle duplicate constraint
        if (error.code === "23505") {
          throw new Error("You have already awarded this badge type to this student");
        }
        throw error;
      }

      // Create notification for the student
      await supabase.from("notifications").insert({
        user_id: studentId,
        type: "badge",
        title: "🏅 New Reliability Badge!",
        message: `You received a ${vouchType} badge from your teacher. Keep up the great work!`,
      });

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["studentBadges", variables.studentId] });
      queryClient.invalidateQueries({ queryKey: ["reliableStudents"] });
      queryClient.invalidateQueries({ queryKey: ["classStudents"] });
      toast.success("Badge awarded successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to award badge");
    },
  });

  return {
    awardBadge,
  };
};

// Hook to get badges for a specific student
export const useStudentBadges = (studentId: string | undefined) => {
  const { data: badges, isLoading } = useQuery({
    queryKey: ["studentBadges", studentId],
    queryFn: async (): Promise<StudentBadges> => {
      if (!studentId) {
        return { total: 0, punctuality: 0, professionalism: 0, reliability: 0, vouches: [] };
      }

      const { data, error } = await supabase
        .from("teacher_vouches")
        .select("*")
        .eq("student_id", studentId);

      if (error) throw error;

      const vouches = (data || []) as TeacherVouch[];
      
      return {
        total: vouches.length,
        punctuality: vouches.filter(v => v.vouch_type === "punctuality").length,
        professionalism: vouches.filter(v => v.vouch_type === "professionalism").length,
        reliability: vouches.filter(v => v.vouch_type === "reliability").length,
        vouches,
      };
    },
    enabled: !!studentId,
  });

  return {
    badges: badges || { total: 0, punctuality: 0, professionalism: 0, reliability: 0, vouches: [] },
    isLoading,
  };
};

// Hook to get all students with their reliability scores (for company filtering)
export const useReliableStudents = (minVouches: number = 3) => {
  const { data, isLoading } = useQuery({
    queryKey: ["reliableStudents", minVouches],
    queryFn: async () => {
      // Get all vouches grouped by student
      const { data: vouches, error } = await supabase
        .from("teacher_vouches")
        .select("student_id");

      if (error) throw error;

      // Count vouches per student
      const vouchCounts: Record<string, number> = {};
      (vouches || []).forEach(v => {
        vouchCounts[v.student_id] = (vouchCounts[v.student_id] || 0) + 1;
      });

      // Return student IDs with >= minVouches
      const reliableStudentIds = Object.entries(vouchCounts)
        .filter(([_, count]) => count >= minVouches)
        .map(([studentId]) => studentId);

      return {
        reliableStudentIds,
        vouchCounts,
      };
    },
  });

  return {
    reliableStudentIds: data?.reliableStudentIds || [],
    vouchCounts: data?.vouchCounts || {},
    isLoading,
  };
};

// Hook for teachers to check if they've already vouched for a student
export const useTeacherVouchStatus = (studentId: string | undefined) => {
  const { user } = useAuth();

  const { data: existingVouches, isLoading } = useQuery({
    queryKey: ["teacherVouchStatus", user?.id, studentId],
    queryFn: async () => {
      if (!user || !studentId) return [];

      const { data, error } = await supabase
        .from("teacher_vouches")
        .select("vouch_type")
        .eq("teacher_id", user.id)
        .eq("student_id", studentId);

      if (error) throw error;
      return (data || []).map(v => v.vouch_type as VouchType);
    },
    enabled: !!user && !!studentId,
  });

  return {
    existingVouches: existingVouches || [],
    isLoading,
    hasVouched: (type: VouchType) => existingVouches?.includes(type) || false,
  };
};

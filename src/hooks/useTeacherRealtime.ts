import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/**
 * Hook to subscribe to realtime updates for teachers
 * Listens for new submissions from institution students
 */
export const useTeacherRealtime = () => {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user || role !== "teacher") return;

    const channel = supabase
      .channel("teacher-realtime-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "submissions",
        },
        (payload) => {
          // New submission received
          if (payload.new.status === "submitted") {
            toast.info("New project submission to review! 📄");
          }
          queryClient.invalidateQueries({ queryKey: ["teacherPendingGrades"] });
          queryClient.invalidateQueries({ queryKey: ["teacherAnalytics"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "submissions",
        },
        (payload) => {
          const newStatus = payload.new.status;
          const oldStatus = payload.old.status;
          
          // When a submission is graded by a company
          if (oldStatus === "submitted" && newStatus === "graded") {
            toast.info("A submission has been graded and needs your approval! ✅");
          }
          
          queryClient.invalidateQueries({ queryKey: ["teacherPendingGrades"] });
          queryClient.invalidateQueries({ queryKey: ["teacherAnalytics"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "exemption_requests",
        },
        () => {
          toast.info("New exam exemption request received! 📝");
          queryClient.invalidateQueries({ queryKey: ["exemptionRequests"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "credits_ledger",
        },
        () => {
          // Credits awarded - update analytics
          queryClient.invalidateQueries({ queryKey: ["teacherAnalytics"] });
          queryClient.invalidateQueries({ queryKey: ["institutionStudents"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, role, queryClient]);
};

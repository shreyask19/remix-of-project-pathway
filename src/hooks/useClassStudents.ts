import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ClassStudent {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  credits: number;
  maxCredits: number;
  activeProjects: number;
  completedProjects: number;
  avgGrade: string | null;
  iaStatus: "Completed" | "In Progress" | "Not Started";
  examExemption: "Eligible" | "Requested" | "Approved" | "Not Eligible";
}

export const useClassStudents = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["classStudents", user?.id],
    queryFn: async () => {
      if (!user) return { students: [], stats: null };

      // Get teacher's institution
      const { data: teacherProfile } = await supabase
        .from("teacher_profiles")
        .select("institution_id")
        .eq("user_id", user.id)
        .maybeSingle();

      // Get students (from same institution if teacher has one, otherwise all)
      let query = supabase
        .from("student_profiles")
        .select(`
          id,
          user_id,
          total_credits,
          institution_id,
          profiles!student_profiles_user_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .order("total_credits", { ascending: false });

      if (teacherProfile?.institution_id) {
        query = query.eq("institution_id", teacherProfile.institution_id);
      }

      const { data: students, error } = await query.limit(100);
      if (error) throw error;

      if (!students || students.length === 0) {
        return { students: [], stats: null };
      }

      const studentIds = students.map(s => s.user_id);

      // Get submissions for all students
      const { data: submissions } = await supabase
        .from("submissions")
        .select("student_id, status, grade")
        .in("student_id", studentIds);

      // Get applications for active projects
      const { data: applications } = await supabase
        .from("project_applications")
        .select("student_id, status")
        .in("student_id", studentIds);

      // Get exemption requests
      const { data: exemptions } = await supabase
        .from("exemption_requests")
        .select("student_id, status")
        .in("student_id", studentIds);

      // Process data
      const submissionsByStudent = new Map<string, any[]>();
      (submissions || []).forEach(s => {
        const arr = submissionsByStudent.get(s.student_id) || [];
        arr.push(s);
        submissionsByStudent.set(s.student_id, arr);
      });

      const applicationsByStudent = new Map<string, any[]>();
      (applications || []).forEach(a => {
        const arr = applicationsByStudent.get(a.student_id) || [];
        arr.push(a);
        applicationsByStudent.set(a.student_id, arr);
      });

      const exemptionsByStudent = new Map<string, string>();
      (exemptions || []).forEach(e => {
        exemptionsByStudent.set(e.student_id, e.status);
      });

      const CREDIT_THRESHOLD = 200;
      const maxCredits = 300;

      const classStudents: ClassStudent[] = students.map(s => {
        const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
        const subs = submissionsByStudent.get(s.user_id) || [];
        const apps = applicationsByStudent.get(s.user_id) || [];
        const exemptionStatus = exemptionsByStudent.get(s.user_id);

        const completedProjects = subs.filter(sub => 
          sub.status === "graded" || sub.status === "approved"
        ).length;
        
        const activeProjects = apps.filter(a => a.status === "approved").length - completedProjects;
        
        // Calculate average grade
        const gradedSubs = subs.filter(sub => sub.grade !== null);
        let avgGrade: string | null = null;
        if (gradedSubs.length > 0) {
          const avgScore = gradedSubs.reduce((acc, s) => acc + (s.grade || 0), 0) / gradedSubs.length;
          if (avgScore >= 90) avgGrade = "Excellent";
          else if (avgScore >= 70) avgGrade = "Satisfied";
          else if (avgScore >= 50) avgGrade = "Average";
          else avgGrade = "Dissatisfied";
        }

        // IA Status
        let iaStatus: ClassStudent["iaStatus"] = "Not Started";
        if (completedProjects > 0) iaStatus = "Completed";
        else if (activeProjects > 0 || subs.some(s => s.status === "draft" || s.status === "submitted")) {
          iaStatus = "In Progress";
        }

        // Exam exemption
        let examExemption: ClassStudent["examExemption"] = "Not Eligible";
        if (exemptionStatus === "approved") examExemption = "Approved";
        else if (exemptionStatus === "pending") examExemption = "Requested";
        else if (s.total_credits >= CREDIT_THRESHOLD) examExemption = "Eligible";

        return {
          id: s.id,
          userId: s.user_id,
          firstName: profile?.first_name || "",
          lastName: profile?.last_name || "",
          email: profile?.email || "",
          credits: s.total_credits || 0,
          maxCredits,
          activeProjects: Math.max(0, activeProjects),
          completedProjects,
          avgGrade,
          iaStatus,
          examExemption,
        };
      });

      // Calculate stats
      const totalStudents = classStudents.length;
      const projectsInProgress = classStudents.reduce((acc, s) => acc + s.activeProjects, 0);
      const assessmentsCompleted = classStudents.filter(s => s.iaStatus === "Completed").length;
      const pendingApprovals = classStudents.filter(s => s.examExemption === "Requested").length;

      const excellentCount = classStudents.filter(s => s.avgGrade === "Excellent").length;
      const satisfiedCount = classStudents.filter(s => s.avgGrade === "Satisfied").length;
      const averageCount = classStudents.filter(s => s.avgGrade === "Average").length;
      const needsImprovementCount = classStudents.filter(s => s.avgGrade === "Dissatisfied").length;

      const stats = {
        totalStudents,
        projectsInProgress,
        assessmentsCompleted,
        pendingApprovals,
        gradeDistribution: {
          excellent: totalStudents > 0 ? Math.round((excellentCount / totalStudents) * 100) : 0,
          satisfied: totalStudents > 0 ? Math.round((satisfiedCount / totalStudents) * 100) : 0,
          average: totalStudents > 0 ? Math.round((averageCount / totalStudents) * 100) : 0,
          needsImprovement: totalStudents > 0 ? Math.round((needsImprovementCount / totalStudents) * 100) : 0,
        },
      };

      return { students: classStudents, stats };
    },
    enabled: !!user,
  });

  return {
    students: data?.students || [],
    stats: data?.stats,
    isLoading,
  };
};

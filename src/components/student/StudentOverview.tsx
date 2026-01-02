import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Briefcase, 
  Star, 
  Award,
  CheckCircle,
  Clock,
  Target,
  Calendar,
  BookOpen,
  FileText,
  Send,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useStudentStats } from "@/hooks/useStudentStats";
import { useStudentActivity } from "@/hooks/useStudentActivity";
import { useUpcomingDeadlines } from "@/hooks/useUpcomingDeadlines";
import ExemptionRequest from "./ExemptionRequest";
import { Skeleton } from "@/components/ui/skeleton";

const StudentOverview = () => {
  const { profile: authProfile } = useAuth();
  const { profile: studentProfile } = useStudentProfile();
  const { stats, isLoading: statsLoading } = useStudentStats();
  const { activities, isLoading: activitiesLoading } = useStudentActivity(5);
  const { deadlines, isLoading: deadlinesLoading } = useUpcomingDeadlines(3);

  const creditsProgress = Math.min((stats.totalCredits / stats.exemptionThreshold) * 100, 100);

  const examExemptionStatus = {
    status: stats.totalCredits >= stats.exemptionThreshold ? "eligible" : "not_eligible",
    creditsNeeded: stats.exemptionThreshold,
    currentCredits: stats.totalCredits,
    message: stats.totalCredits >= stats.exemptionThreshold 
      ? "You're eligible to request exam exemption!" 
      : `${stats.exemptionThreshold - stats.totalCredits} more credits to unlock exam exemption request`,
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "applied":
        return <Send className="w-4 h-4 text-primary" />;
      case "submission":
        return <FileText className="w-4 h-4 text-primary" />;
      case "graded":
        return <Star className="w-4 h-4 text-warning" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "credits_earned":
        return <Award className="w-4 h-4 text-primary" />;
      default:
        return <BookOpen className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="glass-card bg-gradient-to-br from-primary/10 to-primary/5">
              <Skeleton className="w-10 h-10 rounded-xl mb-4" />
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))
        ) : (
          <>
            <div className="glass-card bg-gradient-to-br from-primary/20 to-primary/5 hover:-translate-y-0.5 transition-transform">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-background/80 backdrop-blur text-primary flex items-center justify-center shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {Math.round(creditsProgress)}% to Exemption
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Total Credits</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalCredits}
                <span className="text-muted-foreground font-normal">/{stats.exemptionThreshold}</span>
              </p>
              <Progress value={creditsProgress} className="h-1.5 mt-3" />
            </div>

            <div className="glass-card bg-gradient-to-br from-primary/15 to-primary/5 hover:-translate-y-0.5 transition-transform">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-background/80 backdrop-blur text-primary flex items-center justify-center shadow-sm">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${stats.projectsCompleted > 0 ? "text-success" : "text-primary"}`}>
                  {stats.projectsCompleted > 0 ? `${stats.projectsCompleted} completed` : "Start your first project"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Projects Completed</p>
              <p className="text-2xl font-bold text-foreground">{stats.projectsCompleted}</p>
            </div>

            <div className="glass-card bg-gradient-to-br from-primary/10 to-primary/5 hover:-translate-y-0.5 transition-transform">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-background/80 backdrop-blur text-primary flex items-center justify-center shadow-sm">
                  <Star className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-primary/80">
                  {stats.skillScore > 0 ? `Avg grade: ${stats.avgGrade}%` : "Complete projects to earn"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Skill Score</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.skillScore > 0 ? stats.skillScore : "—"}
              </p>
            </div>

            <div className="glass-card bg-gradient-to-br from-primary/20 to-primary/5 hover:-translate-y-0.5 transition-transform">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-background/80 backdrop-blur text-primary flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-primary">
                  {studentProfile?.current_semester ? "On Track" : "Set in profile"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Current Semester</p>
              <p className="text-2xl font-bold text-foreground">
                {studentProfile?.current_semester ? `Sem ${studentProfile.current_semester}` : "—"}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Exam Exemption Status */}
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground">Exam Exemption Status</h3>
              <p className="text-sm text-muted-foreground">Build projects, earn credits, skip exams</p>
            </div>
            <span className={`status-badge ${examExemptionStatus.status === "eligible" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
              {examExemptionStatus.status === "eligible" ? "Eligible" : "In Progress"}
            </span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress to Exemption</span>
              <span className="font-medium text-foreground">
                {examExemptionStatus.currentCredits} / {examExemptionStatus.creditsNeeded} credits
              </span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all"
                style={{ width: `${creditsProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">{examExemptionStatus.message}</p>
          </div>

          {/* Milestones */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`flex items-center gap-3 p-3 rounded-xl ${stats.hasFirstProject ? "bg-primary/5 border border-primary/20" : "bg-muted border border-border"}`}>
              {stats.hasFirstProject ? <CheckCircle className="w-5 h-5 text-primary" /> : <Clock className="w-5 h-5 text-muted-foreground" />}
              <div>
                <p className="text-xs text-muted-foreground">First Project</p>
                <p className="font-medium text-foreground text-sm">{stats.hasFirstProject ? "Completed" : "Pending"}</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-xl ${creditsProgress >= 50 ? "bg-primary/5 border border-primary/20" : "bg-muted border border-border"}`}>
              {creditsProgress >= 50 ? <CheckCircle className="w-5 h-5 text-primary" /> : <Clock className="w-5 h-5 text-muted-foreground" />}
              <div>
                <p className="text-xs text-muted-foreground">Credit Threshold</p>
                <p className="font-medium text-foreground text-sm">
                  {stats.exemptionThreshold - stats.totalCredits > 0 
                    ? `${stats.exemptionThreshold - stats.totalCredits} more needed` 
                    : "Reached!"}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-xl ${examExemptionStatus.status === "eligible" ? "bg-success/5 border border-success/20" : "bg-muted border border-border"}`}>
              <Target className={`w-5 h-5 ${examExemptionStatus.status === "eligible" ? "text-success" : "text-muted-foreground"}`} />
              <div>
                <p className="text-xs text-muted-foreground">Exam Exemption</p>
                <p className="font-medium text-foreground text-sm">{examExemptionStatus.status === "eligible" ? "Unlocked" : "Locked"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Exemption Request Component */}
          <ExemptionRequest />

          {/* Recent Activity */}
          <div className="glass-card">
            <h3 className="font-bold text-foreground mb-4">Recent Activity</h3>
            {activitiesLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">No recent activity yet</p>
                  <p className="text-xs text-muted-foreground">Browse projects to get started</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Deadlines */}
          <div className="glass-card">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Upcoming Deadlines
            </h3>
            {deadlinesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : deadlines.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming deadlines. Apply to projects to get started!</p>
            ) : (
              <div className="space-y-3">
                {deadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{deadline.project}</p>
                      <p className="text-xs text-muted-foreground">{deadline.company}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      deadline.daysLeft <= 3 ? "bg-destructive/20 text-destructive" : 
                      deadline.daysLeft <= 7 ? "bg-warning/20 text-warning" :
                      "bg-primary/10 text-primary/80"
                    }`}>
                      {deadline.daysLeft}d left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;

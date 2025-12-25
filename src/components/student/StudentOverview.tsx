import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Briefcase, 
  Star, 
  Award,
  CheckCircle,
  Clock,
  Target
} from "lucide-react";

const StudentOverview = () => {
  const stats = [
    {
      label: "Total Credits",
      value: "245",
      subValue: "/300",
      progress: 82,
      badge: "82% to Exam Exemption",
      icon: <Award className="w-5 h-5" />,
    },
    {
      label: "Projects Completed",
      value: "8",
      badge: "↑ +2 this month",
      badgeColor: "text-success",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      label: "Skill Score",
      value: "94%",
      badge: "Top 5%",
      badgeColor: "text-warning",
      icon: <Star className="w-5 h-5" />,
    },
    {
      label: "Current Semester",
      value: "Sem 5",
      badge: "On Track",
      badgeColor: "text-success",
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  const examExemptionStatus = {
    status: "eligible",
    creditsNeeded: 300,
    currentCredits: 245,
    message: "55 more credits to unlock exam exemption request",
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                {stat.icon}
              </div>
              <span className={`text-xs font-medium ${stat.badgeColor || "text-muted-foreground"}`}>
                {stat.badge}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">
              {stat.value}
              {stat.subValue && <span className="text-muted-foreground font-normal">{stat.subValue}</span>}
            </p>
            {stat.progress && (
              <Progress value={stat.progress} className="h-1.5 mt-3" />
            )}
          </div>
        ))}
      </div>

      {/* Exam Exemption Status */}
      <div className="dashboard-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Exam Exemption Status</h3>
            <p className="text-sm text-muted-foreground">Build projects, earn credits, skip exams</p>
          </div>
          <div className="ml-auto">
            <span className={`status-badge ${
              examExemptionStatus.status === "eligible" 
                ? "bg-warning/10 text-warning" 
                : examExemptionStatus.status === "approved"
                ? "bg-success/10 text-success"
                : "bg-muted text-muted-foreground"
            }`}>
              {examExemptionStatus.status === "eligible" ? "Almost Eligible" : 
               examExemptionStatus.status === "approved" ? "Approved" : "Not Eligible"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress to Exemption</span>
            <span className="font-medium text-foreground">
              {examExemptionStatus.currentCredits} / {examExemptionStatus.creditsNeeded} credits
            </span>
          </div>
          <Progress value={(examExemptionStatus.currentCredits / examExemptionStatus.creditsNeeded) * 100} className="h-3" />
          <p className="text-sm text-muted-foreground">{examExemptionStatus.message}</p>
        </div>

        {/* Milestones */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-success/5 border border-success/20">
            <CheckCircle className="w-5 h-5 text-success" />
            <div>
              <p className="text-xs text-muted-foreground">Internal Assessment</p>
              <p className="font-medium text-foreground">Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-warning/5 border border-warning/20">
            <Clock className="w-5 h-5 text-warning" />
            <div>
              <p className="text-xs text-muted-foreground">Credit Threshold</p>
              <p className="font-medium text-foreground">55 more needed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted border border-border">
            <Target className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Exam Exemption</p>
              <p className="font-medium text-foreground">Locked</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;

import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Briefcase, 
  Star, 
  Award,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Calendar,
  BookOpen
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const StudentOverview = () => {
  const { user } = useUser();
  
  const stats = [
    {
      label: "Total Credits",
      value: "245",
      subValue: "/300",
      progress: 82,
      badge: "82% to Exemption",
      icon: <Award className="w-5 h-5" />,
      gradient: "from-primary/20 to-primary/5",
    },
    {
      label: "Projects Completed",
      value: "8",
      badge: "↑ +2 this month",
      badgeColor: "text-primary",
      icon: <Briefcase className="w-5 h-5" />,
      gradient: "from-primary/15 to-primary/5",
    },
    {
      label: "Skill Score",
      value: "94%",
      badge: "Top 5%",
      badgeColor: "text-primary/80",
      icon: <Star className="w-5 h-5" />,
      gradient: "from-primary/10 to-primary/5",
    },
    {
      label: "Current Semester",
      value: user?.currentSemester ? `Sem ${user.currentSemester}` : "Sem 5",
      badge: "On Track",
      badgeColor: "text-primary",
      icon: <TrendingUp className="w-5 h-5" />,
      gradient: "from-primary/20 to-primary/5",
    },
  ];

  const examExemptionStatus = {
    status: "eligible",
    creditsNeeded: 300,
    currentCredits: 245,
    message: "55 more credits to unlock exam exemption request",
  };

  const recentActivity = [
    { icon: <CheckCircle className="w-4 h-4 text-primary" />, text: "Submitted Payment API project", time: "2 hours ago" },
    { icon: <Zap className="w-4 h-4 text-primary/70" />, text: "Earned 15 credits from Stripe challenge", time: "Yesterday" },
    { icon: <Star className="w-4 h-4 text-primary" />, text: "Received 'Excellent' grade from Revolut", time: "2 days ago" },
    { icon: <BookOpen className="w-4 h-4 text-muted-foreground" />, text: "Started new Airbnb project", time: "3 days ago" },
  ];

  const upcomingDeadlines = [
    { project: "Fintech App Redesign", company: "Revolut", daysLeft: 4 },
    { project: "API Documentation", company: "Stripe", daysLeft: 7 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`glass-card bg-gradient-to-br ${stat.gradient} hover:-translate-y-0.5 transition-transform`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-background/80 backdrop-blur text-primary flex items-center justify-center shadow-sm">
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
            <span className="status-badge bg-primary/10 text-primary">
              Almost Eligible
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
                style={{ width: `${(examExemptionStatus.currentCredits / examExemptionStatus.creditsNeeded) * 100}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">{examExemptionStatus.message}</p>
          </div>

          {/* Milestones */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <CheckCircle className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Internal Assessment</p>
                <p className="font-medium text-foreground text-sm">Completed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Credit Threshold</p>
                <p className="font-medium text-foreground text-sm">55 more needed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border">
              <Target className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Exam Exemption</p>
                <p className="font-medium text-foreground text-sm">Locked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="glass-card">
            <h3 className="font-bold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5">{activity.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="glass-card">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Upcoming Deadlines
            </h3>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{deadline.project}</p>
                    <p className="text-xs text-muted-foreground">{deadline.company}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    deadline.daysLeft <= 3 ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary/80"
                  }`}>
                    {deadline.daysLeft}d left
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;

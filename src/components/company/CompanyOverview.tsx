import { 
  Briefcase, 
  Eye, 
  Users, 
  UserCheck,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";

const CompanyOverview = () => {
  const stats = [
    {
      label: "Active Challenges",
      value: "5",
      change: "+2 this month",
      changeColor: "text-primary",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      label: "Submissions Received",
      value: "47",
      change: "+12 this week",
      changeColor: "text-primary",
      icon: <Eye className="w-5 h-5" />,
    },
    {
      label: "Candidates Shortlisted",
      value: "18",
      change: "38% conversion",
      changeColor: "text-primary",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Hires Made",
      value: "6",
      change: "This quarter",
      changeColor: "text-primary",
      icon: <UserCheck className="w-5 h-5" />,
    },
  ];

  const recentActivity = [
    {
      type: "submission",
      message: "New submission for Backend Optimization Challenge",
      student: "Elena Rodriguez",
      time: "2 hours ago",
      icon: <Eye className="w-4 h-4" />,
      iconBg: "bg-primary/10 text-primary",
    },
    {
      type: "shortlist",
      message: "David Chen shortlisted for React Dashboard role",
      student: "David Chen",
      time: "5 hours ago",
      icon: <UserCheck className="w-4 h-4" />,
      iconBg: "bg-primary/15 text-primary",
    },
    {
      type: "review",
      message: "Submission graded: Excellent",
      student: "Sarah Johnson",
      time: "1 day ago",
      icon: <CheckCircle className="w-4 h-4" />,
      iconBg: "bg-primary/10 text-primary",
    },
  ];

  const challengePerformance = [
    { name: "Backend Optimization", submissions: 12, qualified: 8 },
    { name: "React Dashboard", submissions: 18, qualified: 11 },
    { name: "API Integration", submissions: 9, qualified: 5 },
    { name: "Data Analysis", submissions: 8, qualified: 6 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className={`text-xs ${stat.changeColor} mt-1`}>{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Challenge Performance */}
        <div className="dashboard-card">
          <h3 className="font-bold text-foreground mb-4">Challenge Performance</h3>
          <div className="space-y-4">
            {challengePerformance.map((challenge) => (
              <div key={challenge.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">{challenge.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {challenge.qualified}/{challenge.submissions} qualified
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${(challenge.qualified / challenge.submissions) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
          <h3 className="font-bold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center shrink-0`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="text-sm text-primary font-medium mt-4 hover:underline">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;

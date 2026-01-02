import { 
  Briefcase, 
  Eye, 
  Users, 
  UserCheck,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useCompanyStats } from "@/hooks/useCompanyStats";
import { useCompanyActivity } from "@/hooks/useCompanyActivity";
import { useChallengePerformance } from "@/hooks/useChallengePerformance";
import { Skeleton } from "@/components/ui/skeleton";

const CompanyOverview = () => {
  const { stats, isLoading: statsLoading } = useCompanyStats();
  const { activities, isLoading: activitiesLoading } = useCompanyActivity(5);
  const { performance, isLoading: performanceLoading } = useChallengePerformance();

  const statsConfig = [
    {
      label: "Active Challenges",
      value: stats.activeChallenges,
      change: `+${stats.thisMonthChallenges} this month`,
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      label: "Submissions Received",
      value: stats.totalSubmissions,
      change: `+${stats.thisWeekSubmissions} this week`,
      icon: <Eye className="w-5 h-5" />,
    },
    {
      label: "Candidates Shortlisted",
      value: stats.candidatesShortlisted,
      change: stats.totalSubmissions > 0 
        ? `${Math.round((stats.candidatesShortlisted / stats.totalSubmissions) * 100)}% conversion`
        : "0% conversion",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Hires Made",
      value: stats.hiresMade,
      change: "This quarter",
      icon: <UserCheck className="w-5 h-5" />,
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "submission":
        return { icon: <Eye className="w-4 h-4" />, bg: "bg-primary/10 text-primary" };
      case "graded":
        return { icon: <CheckCircle className="w-4 h-4" />, bg: "bg-success/10 text-success" };
      case "shortlisted":
      case "hired":
        return { icon: <UserCheck className="w-4 h-4" />, bg: "bg-primary/15 text-primary" };
      default:
        return { icon: <Eye className="w-4 h-4" />, bg: "bg-muted text-muted-foreground" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="stat-card">
              <Skeleton className="w-10 h-10 rounded-xl mb-4" />
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))
        ) : (
          statsConfig.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-primary mt-1">{stat.change}</p>
            </div>
          ))
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Challenge Performance */}
        <div className="dashboard-card">
          <h3 className="font-bold text-foreground mb-4">Challenge Performance</h3>
          {performanceLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          ) : performance.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No active challenges yet</p>
              <p className="text-xs mt-1">Create a challenge to see performance data</p>
            </div>
          ) : (
            <div className="space-y-4">
              {performance.map((challenge) => (
                <div key={challenge.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground truncate max-w-[60%]">
                      {challenge.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {challenge.qualified}/{challenge.submissions} qualified
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ 
                        width: challenge.submissions > 0 
                          ? `${(challenge.qualified / challenge.submissions) * 100}%` 
                          : "0%" 
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
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
            <div className="text-center py-8 text-muted-foreground">
              <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
              <p className="text-xs mt-1">Activity will appear here when students submit projects</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const { icon, bg } = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.studentName} • {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {activities.length > 0 && (
            <button className="text-sm text-primary font-medium mt-4 hover:underline">
              View all activity
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;

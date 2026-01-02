import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Briefcase, 
  CheckSquare, 
  Clock,
  FileCheck,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useClassStudents } from "@/hooks/useClassStudents";

const ClassOverview = () => {
  const { stats, isLoading } = useClassStudents();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Students",
      value: stats?.totalStudents?.toString() || "0",
      change: "In your class",
      changeColor: "text-primary",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Projects In Progress",
      value: stats?.projectsInProgress?.toString() || "0",
      change: stats?.totalStudents ? `${Math.round((stats.projectsInProgress / stats.totalStudents) * 100)}% of class` : "0%",
      changeColor: "text-primary",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      label: "Assessments Completed",
      value: stats?.assessmentsCompleted?.toString() || "0",
      change: stats?.totalStudents ? `${Math.round((stats.assessmentsCompleted / stats.totalStudents) * 100)}% completion` : "0%",
      changeColor: "text-primary",
      icon: <CheckSquare className="w-5 h-5" />,
    },
    {
      label: "Pending Approvals",
      value: stats?.pendingApprovals?.toString() || "0",
      change: stats?.pendingApprovals && stats.pendingApprovals > 0 ? "Action required" : "All caught up",
      changeColor: "text-muted-foreground",
      icon: <Clock className="w-5 h-5" />,
    },
  ];

  const currentWeek = 12;
  const totalWeeks = 16;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
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

      {/* Semester Progress & Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Semester Progress</h3>
            <span className="text-sm text-muted-foreground">Week {currentWeek} of {totalWeeks}</span>
          </div>
          <Progress value={(currentWeek / totalWeeks) * 100} className="h-3 mb-4" />
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-secondary/50">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">IA Deadline</span>
              </div>
              <p className="text-lg font-bold text-foreground">Jan 15, 2025</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Exemption Requests</span>
              </div>
              <p className="text-lg font-bold text-foreground">{stats?.pendingApprovals || 0} pending</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="font-bold text-foreground mb-4">Class Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Excellent Grades</span>
                <span className="text-sm font-medium text-primary">{stats?.gradeDistribution?.excellent || 0}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${stats?.gradeDistribution?.excellent || 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Satisfied Grades</span>
                <span className="text-sm font-medium text-primary/80">{stats?.gradeDistribution?.satisfied || 0}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary/80 rounded-full" style={{ width: `${stats?.gradeDistribution?.satisfied || 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Average Grades</span>
                <span className="text-sm font-medium text-primary/60">{stats?.gradeDistribution?.average || 0}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary/60 rounded-full" style={{ width: `${stats?.gradeDistribution?.average || 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Needs Improvement</span>
                <span className="text-sm font-medium text-primary/40">{stats?.gradeDistribution?.needsImprovement || 0}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary/40 rounded-full" style={{ width: `${stats?.gradeDistribution?.needsImprovement || 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassOverview;

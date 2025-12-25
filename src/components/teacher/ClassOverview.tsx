import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Briefcase, 
  CheckSquare, 
  AlertTriangle,
  TrendingUp,
  Award,
  Clock,
  FileCheck
} from "lucide-react";

const ClassOverview = () => {
  const stats = [
    {
      label: "Total Students",
      value: "156",
      change: "+12 this semester",
      changeColor: "text-success",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Projects In Progress",
      value: "89",
      change: "57% of class",
      changeColor: "text-primary",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      label: "Assessments Completed",
      value: "124",
      change: "80% completion rate",
      changeColor: "text-success",
      icon: <CheckSquare className="w-5 h-5" />,
    },
    {
      label: "Pending Approvals",
      value: "18",
      change: "Action required",
      changeColor: "text-warning",
      icon: <Clock className="w-5 h-5" />,
    },
  ];

  const semesterProgress = {
    currentWeek: 12,
    totalWeeks: 16,
    internalAssessmentDeadline: "Jan 15, 2025",
    examExemptionRequests: 8,
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
            <span className="text-sm text-muted-foreground">Week {semesterProgress.currentWeek} of {semesterProgress.totalWeeks}</span>
          </div>
          <Progress value={(semesterProgress.currentWeek / semesterProgress.totalWeeks) * 100} className="h-3 mb-4" />
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-secondary/50">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">IA Deadline</span>
              </div>
              <p className="text-lg font-bold text-foreground">{semesterProgress.internalAssessmentDeadline}</p>
            </div>
            <div className="p-4 rounded-2xl bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-foreground">Exemption Requests</span>
              </div>
              <p className="text-lg font-bold text-foreground">{semesterProgress.examExemptionRequests} pending</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="font-bold text-foreground mb-4">Class Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Excellent Grades</span>
                <span className="text-sm font-medium text-success">42%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: "42%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Satisfied Grades</span>
                <span className="text-sm font-medium text-primary">35%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "35%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Average Grades</span>
                <span className="text-sm font-medium text-warning">18%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: "18%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Needs Improvement</span>
                <span className="text-sm font-medium text-destructive">5%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-destructive rounded-full" style={{ width: "5%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassOverview;

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Award,
  Target,
  BookOpen,
  Users
} from "lucide-react";
import { useTeacherAnalytics } from "@/hooks/useTeacherAnalytics";
import { useAtRiskStudents } from "@/hooks/useAtRiskStudents";
import { useInstitutionStudents } from "@/hooks/useInstitutionStudents";
import { Skeleton } from "@/components/ui/skeleton";

const TeacherAnalytics = () => {
  const [timeRange, setTimeRange] = useState("semester");
  const { analytics, isLoading: analyticsLoading } = useTeacherAnalytics();
  const { students: atRiskStudents, isLoading: atRiskLoading } = useAtRiskStudents(5);
  const { creditDistribution, isLoading: studentsLoading } = useInstitutionStudents();

  const isLoading = analyticsLoading || atRiskLoading || studentsLoading;

  const overviewStats = [
    {
      label: "Average Credits",
      value: analytics.averageCredits.toString(),
      change: analytics.totalStudents > 0 ? `${analytics.totalStudents} students` : "No students",
      trend: "neutral" as const,
      icon: <Award className="w-5 h-5" />,
    },
    {
      label: "Completion Rate",
      value: `${analytics.completionRate}%`,
      change: `${analytics.gradedSubmissions}/${analytics.totalSubmissions} graded`,
      trend: analytics.completionRate >= 70 ? "up" as const : "down" as const,
      icon: <Target className="w-5 h-5" />,
    },
    {
      label: "At-Risk Students",
      value: analytics.atRiskCount.toString(),
      change: analytics.atRiskCount === 0 ? "All on track" : "Need attention",
      trend: analytics.atRiskCount === 0 ? "up" as const : "down" as const,
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    {
      label: "Avg. Project Score",
      value: analytics.avgProjectScore,
      change: analytics.gradedSubmissions > 0 ? "Based on grades" : "No grades yet",
      trend: "neutral" as const,
      icon: <BookOpen className="w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Performance Analytics</h2>
        <div className="flex gap-2 p-1 bg-secondary rounded-xl">
          {["week", "month", "semester"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="glass-card">
              <Skeleton className="w-10 h-10 rounded-xl mb-3" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))
        ) : (
          overviewStats.map((stat) => (
            <div key={stat.label} className="glass-card">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  {stat.icon}
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === "up" ? "text-success" : 
                  stat.trend === "down" ? "text-warning" : 
                  "text-muted-foreground"
                }`}>
                  {stat.trend === "up" && <TrendingUp className="w-3 h-3" />}
                  {stat.trend === "down" && <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Credit Distribution */}
        <div className="glass-card">
          <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Credit Distribution
          </h3>
          {studentsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <Skeleton className="w-16 h-4" />
                  <Skeleton className="flex-1 h-8 rounded-lg" />
                  <Skeleton className="w-12 h-4" />
                </div>
              ))}
            </div>
          ) : creditDistribution.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No student data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {creditDistribution.map((item) => (
                <div key={item.range} className="flex items-center gap-4">
                  <span className="w-16 text-sm text-muted-foreground">{item.range}</span>
                  <div className="flex-1 h-8 bg-secondary rounded-lg overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-end px-2 transition-all duration-500"
                      style={{ width: `${Math.max(item.percentage * 3, item.count > 0 ? 15 : 0)}%` }}
                    >
                      {item.count > 0 && (
                        <span className="text-xs font-medium text-primary-foreground">{item.count}</span>
                      )}
                    </div>
                  </div>
                  <span className="w-12 text-sm text-muted-foreground text-right">{item.percentage}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* At-Risk Students */}
        <div className="glass-card">
          <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            At-Risk Students
          </h3>
          {atRiskLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="w-16 h-6" />
                </div>
              ))}
            </div>
          ) : atRiskStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50 text-success" />
              <p className="text-sm text-success">All students are on track!</p>
              <p className="text-xs mt-1">No students below the at-risk threshold</p>
            </div>
          ) : (
            <div className="space-y-3">
              {atRiskStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{student.issue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{student.credits} cr</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      student.urgency === "high" ? "bg-destructive/20 text-destructive" :
                      student.urgency === "medium" ? "bg-warning/20 text-warning" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {student.urgency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="glass-card">
        <h3 className="font-bold text-foreground mb-6">Institution Overview</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-xl bg-secondary/50">
            <p className="text-3xl font-bold text-primary">{analytics.totalStudents}</p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-secondary/50">
            <p className="text-3xl font-bold text-primary">{analytics.totalSubmissions}</p>
            <p className="text-sm text-muted-foreground">Total Submissions</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-secondary/50">
            <p className="text-3xl font-bold text-primary">{analytics.gradedSubmissions}</p>
            <p className="text-sm text-muted-foreground">Graded Projects</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAnalytics;

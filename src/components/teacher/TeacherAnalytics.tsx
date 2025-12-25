import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  AlertTriangle,
  Award,
  Target,
  BookOpen
} from "lucide-react";

const TeacherAnalytics = () => {
  const [timeRange, setTimeRange] = useState("semester");

  const overviewStats = [
    {
      label: "Average Credits",
      value: "187",
      change: "+12%",
      trend: "up",
      icon: <Award className="w-5 h-5" />,
    },
    {
      label: "Completion Rate",
      value: "78%",
      change: "+5%",
      trend: "up",
      icon: <Target className="w-5 h-5" />,
    },
    {
      label: "At-Risk Students",
      value: "8",
      change: "-2",
      trend: "down",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    {
      label: "Avg. Project Score",
      value: "B+",
      change: "Stable",
      trend: "neutral",
      icon: <BookOpen className="w-5 h-5" />,
    },
  ];

  const creditDistribution = [
    { range: "0-50", count: 5, percentage: 8 },
    { range: "51-100", count: 8, percentage: 13 },
    { range: "101-150", count: 12, percentage: 20 },
    { range: "151-200", count: 18, percentage: 30 },
    { range: "201-250", count: 12, percentage: 20 },
    { range: "251-300", count: 5, percentage: 8 },
  ];

  const atRiskStudents = [
    { name: "Rahul Sharma", credits: 45, issue: "Low project completion", urgency: "high" },
    { name: "Priya Patel", credits: 68, issue: "Missed deadlines", urgency: "high" },
    { name: "Amit Kumar", credits: 92, issue: "Declining grades", urgency: "medium" },
    { name: "Sneha Gupta", credits: 110, issue: "Attendance concerns", urgency: "medium" },
    { name: "Vikram Singh", credits: 125, issue: "Project quality drop", urgency: "low" },
  ];

  const subjectPerformance = [
    { subject: "Data Structures", avgScore: 85, students: 45 },
    { subject: "Web Development", avgScore: 78, students: 52 },
    { subject: "Machine Learning", avgScore: 72, students: 38 },
    { subject: "Database Systems", avgScore: 82, students: 48 },
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
        {overviewStats.map((stat) => (
          <div key={stat.label} className="glass-card">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                {stat.icon}
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${
                stat.trend === "up" ? "text-success" : 
                stat.trend === "down" ? "text-success" : 
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
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Credit Distribution */}
        <div className="glass-card">
          <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            Credit Distribution
          </h3>
          <div className="space-y-4">
            {creditDistribution.map((item) => (
              <div key={item.range} className="flex items-center gap-4">
                <span className="w-16 text-sm text-muted-foreground">{item.range}</span>
                <div className="flex-1 h-8 bg-secondary rounded-lg overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg flex items-center justify-end px-2"
                    style={{ width: `${item.percentage * 3}%` }}
                  >
                    <span className="text-xs font-medium text-white">{item.count}</span>
                  </div>
                </div>
                <span className="w-12 text-sm text-muted-foreground text-right">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* At-Risk Students */}
        <div className="glass-card">
          <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            At-Risk Students
          </h3>
          <div className="space-y-3">
            {atRiskStudents.map((student) => (
              <div key={student.name} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
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
                    student.urgency === "high" ? "bg-destructive/10 text-destructive" :
                    student.urgency === "medium" ? "bg-warning/10 text-warning" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {student.urgency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="glass-card">
        <h3 className="font-bold text-foreground mb-6">Subject Performance</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjectPerformance.map((subject) => (
            <div key={subject.subject} className="p-4 rounded-xl bg-secondary/50">
              <h4 className="font-medium text-foreground mb-2">{subject.subject}</h4>
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-bold text-emerald-500">{subject.avgScore}%</span>
                <span className="text-xs text-muted-foreground">{subject.students} students</span>
              </div>
              <Progress value={subject.avgScore} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherAnalytics;

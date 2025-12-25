import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Clock, 
  TrendingDown, 
  FileWarning,
  Bell,
  CheckCircle,
  X,
  ArrowRight
} from "lucide-react";

const AlertsSection = () => {
  const alerts = [
    {
      id: 1,
      type: "low_progress",
      severity: "warning",
      student: "Emma Wilson",
      message: "Has completed only 1 project with 45 credits. At risk of not meeting internal assessment deadline.",
      time: "2 hours ago",
      actionLabel: "Contact Student",
    },
    {
      id: 2,
      type: "missed_deadline",
      severity: "error",
      student: "James Smith",
      message: "Missed project submission deadline for 'Backend API Challenge' by 2 days.",
      time: "1 day ago",
      actionLabel: "View Details",
    },
    {
      id: 3,
      type: "exemption_request",
      severity: "info",
      student: "Marcus Reed",
      message: "Submitted exam exemption request. 320 credits earned, 10 projects completed.",
      time: "1 day ago",
      actionLabel: "Review Request",
    },
    {
      id: 4,
      type: "low_progress",
      severity: "warning",
      student: "Lila Rossi",
      message: "Project progress stalled for 2 weeks. Currently at 45% completion on 'Brand Identity' project.",
      time: "3 days ago",
      actionLabel: "Send Reminder",
    },
    {
      id: 5,
      type: "grade_ready",
      severity: "success",
      student: "David Kim",
      message: "Company grade received for 'React Component Library'. Ready for your approval.",
      time: "4 days ago",
      actionLabel: "Approve Grade",
    },
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case "warning":
        return <Clock className="w-5 h-5 text-warning" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-success" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "error":
        return "bg-destructive/10 border-destructive/20";
      case "warning":
        return "bg-warning/10 border-warning/20";
      case "success":
        return "bg-success/10 border-success/20";
      default:
        return "bg-primary/10 border-primary/20";
    }
  };

  const stats = [
    { label: "Low Progress", count: 4, icon: <TrendingDown className="w-4 h-4" />, color: "text-warning" },
    { label: "Missed Deadlines", count: 2, icon: <Clock className="w-4 h-4" />, color: "text-destructive" },
    { label: "Pending Approvals", count: 8, icon: <FileWarning className="w-4 h-4" />, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Alerts & Notifications</h2>
        <p className="text-muted-foreground">Students needing attention and pending actions</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.count}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`dashboard-card border ${getSeverityBg(alert.severity)} flex items-start gap-4`}
          >
            <div className="shrink-0 mt-1">
              {getSeverityIcon(alert.severity)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-foreground">{alert.student}</span>
                <span className="text-xs text-muted-foreground">• {alert.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{alert.message}</p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl gap-1">
                {alert.actionLabel}
                <ArrowRight className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Mark All Read */}
      <div className="flex justify-center">
        <Button variant="ghost" className="text-muted-foreground">
          Mark all as read
        </Button>
      </div>
    </div>
  );
};

export default AlertsSection;

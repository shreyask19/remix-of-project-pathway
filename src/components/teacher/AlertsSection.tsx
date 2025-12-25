import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Clock, 
  TrendingDown, 
  FileWarning,
  Bell,
  CheckCircle,
  X,
  ArrowRight,
  Mail,
  Eye,
  Check
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Alert {
  id: number;
  type: string;
  severity: "error" | "warning" | "success" | "info";
  student: string;
  studentEmail: string;
  message: string;
  time: string;
  actionLabel: string;
  dismissed: boolean;
  actionTaken: boolean;
}

const AlertsSection = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: "low_progress",
      severity: "warning",
      student: "Emma Wilson",
      studentEmail: "emma.wilson@university.edu",
      message: "Has completed only 1 project with 45 credits. At risk of not meeting internal assessment deadline.",
      time: "2 hours ago",
      actionLabel: "Contact Student",
      dismissed: false,
      actionTaken: false,
    },
    {
      id: 2,
      type: "missed_deadline",
      severity: "error",
      student: "James Smith",
      studentEmail: "james.smith@university.edu",
      message: "Missed project submission deadline for 'Backend API Challenge' by 2 days.",
      time: "1 day ago",
      actionLabel: "View Details",
      dismissed: false,
      actionTaken: false,
    },
    {
      id: 3,
      type: "exemption_request",
      severity: "info",
      student: "Marcus Reed",
      studentEmail: "marcus.reed@university.edu",
      message: "Submitted exam exemption request. 320 credits earned, 10 projects completed.",
      time: "1 day ago",
      actionLabel: "Review Request",
      dismissed: false,
      actionTaken: false,
    },
    {
      id: 4,
      type: "low_progress",
      severity: "warning",
      student: "Lila Rossi",
      studentEmail: "lila.rossi@university.edu",
      message: "Project progress stalled for 2 weeks. Currently at 45% completion on 'Brand Identity' project.",
      time: "3 days ago",
      actionLabel: "Send Reminder",
      dismissed: false,
      actionTaken: false,
    },
    {
      id: 5,
      type: "grade_ready",
      severity: "success",
      student: "David Kim",
      studentEmail: "david.kim@university.edu",
      message: "Company grade received for 'React Component Library'. Ready for your approval.",
      time: "4 days ago",
      actionLabel: "Approve Grade",
      dismissed: false,
      actionTaken: false,
    },
  ]);

  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Alert | null>(null);
  const [contactMessage, setContactMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

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

  const handleAction = async (alert: Alert) => {
    switch (alert.actionLabel) {
      case "Contact Student":
      case "Send Reminder":
        setSelectedStudent(alert);
        setContactMessage(
          alert.actionLabel === "Send Reminder" 
            ? `Hi ${alert.student.split(' ')[0]},\n\nThis is a friendly reminder about your ongoing project. Please ensure you're making progress to meet the deadline.\n\nBest regards`
            : ""
        );
        setShowContactModal(true);
        break;
        
      case "View Details":
        toast.info("Opening Details", {
          description: `Viewing details for ${alert.student}'s missed deadline`,
        });
        setAlerts(prev => prev.map(a => 
          a.id === alert.id ? { ...a, actionTaken: true } : a
        ));
        break;
        
      case "Review Request":
        toast.info("Opening Review", {
          description: `Opening exemption request from ${alert.student}`,
        });
        setAlerts(prev => prev.map(a => 
          a.id === alert.id ? { ...a, actionTaken: true } : a
        ));
        break;
        
      case "Approve Grade":
        setAlerts(prev => prev.map(a => 
          a.id === alert.id ? { ...a, actionTaken: true } : a
        ));
        toast.success("Grade Approved!", {
          description: `${alert.student}'s grade has been approved and recorded`,
        });
        break;
    }
  };

  const handleSendMessage = async () => {
    if (!selectedStudent || !contactMessage.trim()) return;
    
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAlerts(prev => prev.map(a => 
      a.id === selectedStudent.id ? { ...a, actionTaken: true } : a
    ));
    
    toast.success("Message Sent!", {
      description: `Email sent to ${selectedStudent.student}`,
    });
    
    setIsSending(false);
    setShowContactModal(false);
    setSelectedStudent(null);
    setContactMessage("");
  };

  const dismissAlert = (id: number) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, dismissed: true } : a
    ));
    toast.success("Alert dismissed");
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, dismissed: true })));
    toast.success("All alerts marked as read");
  };

  const visibleAlerts = alerts.filter(a => !a.dismissed);
  
  const stats = [
    { 
      label: "Low Progress", 
      count: alerts.filter(a => a.type === "low_progress" && !a.dismissed).length, 
      icon: <TrendingDown className="w-4 h-4" />, 
      color: "text-warning" 
    },
    { 
      label: "Missed Deadlines", 
      count: alerts.filter(a => a.type === "missed_deadline" && !a.dismissed).length, 
      icon: <Clock className="w-4 h-4" />, 
      color: "text-destructive" 
    },
    { 
      label: "Pending Actions", 
      count: alerts.filter(a => !a.actionTaken && !a.dismissed).length, 
      icon: <FileWarning className="w-4 h-4" />, 
      color: "text-primary" 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Alerts & Notifications</h2>
          <p className="text-muted-foreground">Students needing attention and pending actions</p>
        </div>
        {visibleAlerts.length > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
            <Check className="w-4 h-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-secondary flex items-center justify-center ${stat.color}`}>
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
      {visibleAlerts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">All caught up!</h3>
          <p className="text-muted-foreground">No alerts requiring your attention</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`dashboard-card border ${getSeverityBg(alert.severity)} flex items-start gap-4 ${alert.actionTaken ? "opacity-60" : ""}`}
            >
              <div className="shrink-0 mt-1">
                {getSeverityIcon(alert.severity)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground">{alert.student}</span>
                  {alert.actionTaken && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Done
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">• {alert.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl gap-1"
                  onClick={() => handleAction(alert)}
                  disabled={alert.actionTaken}
                >
                  {alert.actionLabel === "Contact Student" || alert.actionLabel === "Send Reminder" ? (
                    <Mail className="w-3 h-3" />
                  ) : alert.actionLabel === "View Details" || alert.actionLabel === "Review Request" ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <Check className="w-3 h-3" />
                  )}
                  {alert.actionLabel}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground"
                  onClick={() => dismissAlert(alert.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact Student</DialogTitle>
            <DialogDescription>
              Send a message to {selectedStudent?.student}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-foreground">To:</label>
              <p className="text-sm text-muted-foreground mt-1">{selectedStudent?.studentEmail}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Message:</label>
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-secondary/50 rounded-xl text-foreground text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Type your message here..."
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowContactModal(false)} disabled={isSending}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={isSending || !contactMessage.trim()} className="gap-2">
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlertsSection;

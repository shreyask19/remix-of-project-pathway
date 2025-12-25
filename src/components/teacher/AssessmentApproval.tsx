import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Star,
  MessageSquare,
  Clock,
  Award,
  AlertTriangle,
  Send,
  Flag
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PendingGrade {
  id: number;
  student: string;
  project: string;
  company: string;
  companyGrade: string;
  credits: number;
  feedback: string;
  submittedAt: string;
  status: "pending" | "approved" | "disputed";
}

interface ExemptionRequest {
  id: number;
  student: string;
  credits: number;
  requiredCredits: number;
  projectsCompleted: number;
  averageGrade: string;
  requestedAt: string;
  reason: string;
  warning?: string;
  status: "pending" | "approved" | "rejected";
}

const AssessmentApproval = () => {
  const [activeTab, setActiveTab] = useState<"grades" | "exemptions">("grades");
  const [disputeOpen, setDisputeOpen] = useState<number | null>(null);
  const [disputeReason, setDisputeReason] = useState("");

  const [pendingGrades, setPendingGrades] = useState<PendingGrade[]>([
    {
      id: 1,
      student: "Sarah Johnson",
      project: "Marketing Strategy Analysis",
      company: "Spotify",
      companyGrade: "Excellent",
      credits: 60,
      feedback: "Outstanding strategic thinking and customer acquisition plan. Highly impressive work that demonstrates deep understanding of market dynamics.",
      submittedAt: "2 days ago",
      status: "pending",
    },
    {
      id: 2,
      student: "Marcus Reed",
      project: "Backend Architecture Design",
      company: "Google",
      companyGrade: "Satisfied",
      credits: 85,
      feedback: "Good implementation of microservices pattern. Could improve on documentation and error handling.",
      submittedAt: "3 days ago",
      status: "pending",
    },
    {
      id: 3,
      student: "David Kim",
      project: "React Component Library",
      company: "Airbnb",
      companyGrade: "Excellent",
      credits: 70,
      feedback: "Exceptional attention to accessibility and reusability. Components are well-documented and follow best practices.",
      submittedAt: "4 days ago",
      status: "pending",
    },
  ]);

  const [exemptionRequests, setExemptionRequests] = useState<ExemptionRequest[]>([
    {
      id: 1,
      student: "Marcus Reed",
      credits: 320,
      requiredCredits: 300,
      projectsCompleted: 10,
      averageGrade: "Excellent",
      requestedAt: "1 day ago",
      reason: "Completed all required projects with high performance. Seeking exemption from final written exam.",
      status: "pending",
    },
    {
      id: 2,
      student: "Alex Chen",
      credits: 298,
      requiredCredits: 300,
      projectsCompleted: 8,
      averageGrade: "Excellent",
      requestedAt: "3 days ago",
      reason: "Near threshold with consistent excellent performance. One more project in progress.",
      warning: "2 credits below threshold",
      status: "pending",
    },
  ]);

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      "Excellent": "bg-success text-success-foreground",
      "Satisfied": "bg-primary text-primary-foreground",
      "Average": "bg-warning text-warning-foreground",
      "Dissatisfied": "bg-destructive text-destructive-foreground",
    };
    return colors[grade] || "bg-muted text-muted-foreground";
  };

  const handleApproveGrade = (id: number) => {
    setPendingGrades(prev => prev.map(g => 
      g.id === id ? { ...g, status: "approved" as const } : g
    ));
    toast.success("Grade approved and credits awarded to student");
  };

  const handleDisputeGrade = (id: number) => {
    if (!disputeReason.trim()) {
      toast.error("Please provide a reason for dispute");
      return;
    }
    setPendingGrades(prev => prev.map(g => 
      g.id === id ? { ...g, status: "disputed" as const } : g
    ));
    toast.info("Dispute submitted. Company will be notified.");
    setDisputeOpen(null);
    setDisputeReason("");
  };

  const handleApproveExemption = (id: number) => {
    setExemptionRequests(prev => prev.map(e => 
      e.id === id ? { ...e, status: "approved" as const } : e
    ));
    toast.success("Exam exemption approved");
  };

  const handleRejectExemption = (id: number) => {
    setExemptionRequests(prev => prev.map(e => 
      e.id === id ? { ...e, status: "rejected" as const } : e
    ));
    toast.info("Exemption request rejected");
  };

  const pendingGradesFiltered = pendingGrades.filter(g => g.status === "pending");
  const exemptionRequestsFiltered = exemptionRequests.filter(e => e.status === "pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Assessment Approval</h2>
        <p className="text-muted-foreground text-sm">Review company grades and exam exemption requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("grades")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === "grades"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Pending Grades ({pendingGradesFiltered.length})
        </button>
        <button
          onClick={() => setActiveTab("exemptions")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === "exemptions"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Exemption Requests ({exemptionRequestsFiltered.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "grades" ? (
        <div className="space-y-4">
          {pendingGrades.map((item) => (
            <div 
              key={item.id} 
              className={`glass-card p-5 ${
                item.status === "approved" ? "opacity-60" : 
                item.status === "disputed" ? "border-warning/30" : ""
              }`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                    {item.student.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-foreground">{item.student}</h3>
                      <span className={`status-badge ${getGradeColor(item.companyGrade)}`}>
                        <Star className="w-3 h-3 mr-1" />
                        {item.companyGrade}
                      </span>
                      {item.status === "approved" && (
                        <span className="status-badge bg-success/10 text-success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approved
                        </span>
                      )}
                      {item.status === "disputed" && (
                        <span className="status-badge bg-warning/10 text-warning">
                          <Flag className="w-3 h-3 mr-1" />
                          Disputed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.project}</p>
                    <p className="text-xs text-muted-foreground">Company: {item.company} • {item.submittedAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{item.credits}</p>
                    <p className="text-xs text-muted-foreground">credits</p>
                  </div>
                </div>

                {/* Company Feedback */}
                <div className="p-4 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Company Feedback</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.feedback}</p>
                </div>

                {/* Dispute Form */}
                {disputeOpen === item.id && (
                  <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
                    <label className="block text-sm font-medium text-foreground mb-2">Dispute Reason</label>
                    <textarea
                      rows={2}
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                      placeholder="Explain why you're disputing this grade..."
                      className="w-full px-4 py-2 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-warning/20 resize-none mb-3"
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl"
                        onClick={() => {
                          setDisputeOpen(null);
                          setDisputeReason("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        className="rounded-xl gap-2 bg-warning hover:bg-warning/90 text-warning-foreground"
                        onClick={() => handleDisputeGrade(item.id)}
                      >
                        <Send className="w-3 h-3" />
                        Submit Dispute
                      </Button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {item.status === "pending" && (
                  <div className="flex items-center gap-3 pt-2">
                    <Button variant="outline" className="rounded-xl gap-2">
                      <Eye className="w-4 h-4" />
                      View Submission
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-xl gap-2 text-warning hover:text-warning hover:border-warning"
                      onClick={() => setDisputeOpen(item.id)}
                    >
                      <Flag className="w-4 h-4" />
                      Dispute
                    </Button>
                    <Button 
                      className="rounded-xl gap-2 ml-auto"
                      onClick={() => handleApproveGrade(item.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Grade
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {pendingGradesFiltered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              All grades have been reviewed.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {exemptionRequests.map((request) => (
            <div 
              key={request.id} 
              className={`glass-card p-5 ${
                request.status === "approved" ? "opacity-60 border-success/30" : 
                request.status === "rejected" ? "opacity-60 border-destructive/30" :
                request.warning ? "border-warning/30" : ""
              }`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                    {request.student.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-foreground">{request.student}</h3>
                      {request.status === "pending" && (
                        <span className="status-badge bg-warning/10 text-warning">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending Review
                        </span>
                      )}
                      {request.status === "approved" && (
                        <span className="status-badge bg-success/10 text-success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approved
                        </span>
                      )}
                      {request.status === "rejected" && (
                        <span className="status-badge bg-destructive/10 text-destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          Rejected
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Requested {request.requestedAt}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-muted/30 text-center">
                    <p className="text-lg font-bold text-foreground">{request.credits}</p>
                    <p className="text-xs text-muted-foreground">Credits Earned</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 text-center">
                    <p className="text-lg font-bold text-foreground">{request.requiredCredits}</p>
                    <p className="text-xs text-muted-foreground">Required</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 text-center">
                    <p className="text-lg font-bold text-foreground">{request.projectsCompleted}</p>
                    <p className="text-xs text-muted-foreground">Projects</p>
                  </div>
                  <div className="p-3 rounded-xl bg-success/10 text-center">
                    <p className="text-lg font-bold text-success">{request.averageGrade}</p>
                    <p className="text-xs text-muted-foreground">Avg Grade</p>
                  </div>
                </div>

                {request.warning && request.status === "pending" && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-warning/10 border border-warning/20">
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                    <span className="text-sm text-warning">{request.warning}</span>
                  </div>
                )}

                {/* Reason */}
                <div className="p-4 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Student Statement</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{request.reason}</p>
                </div>

                {/* Actions */}
                {request.status === "pending" && (
                  <div className="flex items-center gap-3 pt-2">
                    <Button variant="outline" className="rounded-xl gap-2">
                      <Eye className="w-4 h-4" />
                      View Full Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-xl gap-2 text-destructive hover:text-destructive hover:border-destructive"
                      onClick={() => handleRejectExemption(request.id)}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button 
                      className="rounded-xl gap-2 ml-auto bg-success hover:bg-success/90"
                      onClick={() => handleApproveExemption(request.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Exemption
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {exemptionRequestsFiltered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              All exemption requests have been reviewed.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentApproval;
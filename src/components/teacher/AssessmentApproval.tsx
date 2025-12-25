import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Star,
  MessageSquare,
  Clock,
  Award,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";

const AssessmentApproval = () => {
  const [activeTab, setActiveTab] = useState<"grades" | "exemptions">("grades");

  const pendingGrades = [
    {
      id: 1,
      student: "Sarah Johnson",
      project: "Marketing Strategy Analysis",
      company: "Spotify",
      companyGrade: "Excellent",
      credits: 60,
      feedback: "Outstanding strategic thinking and customer acquisition plan. Highly impressive work that demonstrates deep understanding of market dynamics.",
      submittedAt: "2 days ago",
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
    },
  ];

  const exemptionRequests = [
    {
      id: 1,
      student: "Marcus Reed",
      credits: 320,
      requiredCredits: 300,
      projectsCompleted: 10,
      averageGrade: "Excellent",
      requestedAt: "1 day ago",
      reason: "Completed all required projects with high performance. Seeking exemption from final written exam.",
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
    },
  ];

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      "Excellent": "bg-success text-success-foreground",
      "Satisfied": "bg-primary text-primary-foreground",
      "Average": "bg-warning text-warning-foreground",
      "Dissatisfied": "bg-destructive text-destructive-foreground",
    };
    return colors[grade] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Assessment Approval</h2>
        <p className="text-muted-foreground">Review company grades and exam exemption requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("grades")}
          className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
            activeTab === "grades"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Pending Grades ({pendingGrades.length})
        </button>
        <button
          onClick={() => setActiveTab("exemptions")}
          className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
            activeTab === "exemptions"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Exemption Requests ({exemptionRequests.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "grades" ? (
        <div className="space-y-4">
          {pendingGrades.map((item) => (
            <div key={item.id} className="dashboard-card">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {item.student.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{item.student}</h3>
                        <span className={`status-badge ${getGradeColor(item.companyGrade)}`}>
                          <Star className="w-3 h-3 mr-1" />
                          {item.companyGrade}
                        </span>
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
                  <div className="p-4 rounded-2xl bg-muted/50 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Company Feedback</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.feedback}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl gap-2">
                      <Eye className="w-4 h-4" />
                      View Submission
                    </Button>
                    <Button variant="outline" className="rounded-2xl gap-2 text-destructive hover:text-destructive">
                      <XCircle className="w-4 h-4" />
                      Dispute
                    </Button>
                    <Button className="rounded-2xl gap-2 ml-auto">
                      <CheckCircle className="w-4 h-4" />
                      Approve Grade
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {exemptionRequests.map((request) => (
            <div key={request.id} className={`dashboard-card ${request.warning ? "border-warning/30" : ""}`}>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {request.student.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{request.student}</h3>
                        <span className="status-badge bg-warning/10 text-warning">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending Review
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Requested {request.requestedAt}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-muted/50 text-center">
                      <p className="text-lg font-bold text-foreground">{request.credits}</p>
                      <p className="text-xs text-muted-foreground">Credits Earned</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-muted/50 text-center">
                      <p className="text-lg font-bold text-foreground">{request.requiredCredits}</p>
                      <p className="text-xs text-muted-foreground">Required</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-muted/50 text-center">
                      <p className="text-lg font-bold text-foreground">{request.projectsCompleted}</p>
                      <p className="text-xs text-muted-foreground">Projects</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-success/10 text-center">
                      <p className="text-lg font-bold text-success">{request.averageGrade}</p>
                      <p className="text-xs text-muted-foreground">Avg Grade</p>
                    </div>
                  </div>

                  {request.warning && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-warning/10 border border-warning/20 mb-4">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <span className="text-sm text-warning">{request.warning}</span>
                    </div>
                  )}

                  {/* Reason */}
                  <div className="p-4 rounded-2xl bg-muted/50 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Student Statement</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.reason}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl gap-2">
                      <Eye className="w-4 h-4" />
                      View Full Profile
                    </Button>
                    <Button variant="outline" className="rounded-2xl gap-2 text-destructive hover:text-destructive">
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button className="rounded-2xl gap-2 ml-auto bg-success hover:bg-success/90">
                      <CheckCircle className="w-4 h-4" />
                      Approve Exemption
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentApproval;

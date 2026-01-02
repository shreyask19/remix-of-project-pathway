import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Star,
  MessageSquare,
  Award,
  AlertTriangle,
  Flag,
  CheckSquare,
  Square,
  Minus,
  Loader2,
  ExternalLink,
  Github,
  Video,
  FileText,
  Send,
  ShieldAlert
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTeacherSubmissions, useExemptionRequests } from "@/hooks/useSubmissions";
import { getGradeLabel, exemptionRequestFromDb } from "@/lib/transformers";
import AuthenticityBadge from "@/components/student/AuthenticityBadge";

const AssessmentApproval = () => {
  const [activeTab, setActiveTab] = useState<"grades" | "exemptions">("grades");
  const [disputeOpen, setDisputeOpen] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [selectedGrades, setSelectedGrades] = useState<Set<string>>(new Set());
  const [selectedExemptions, setSelectedExemptions] = useState<Set<string>>(new Set());
  const [showBulkConfirm, setShowBulkConfirm] = useState<"approve" | "reject" | null>(null);

  const { 
    pendingGrades: rawPendingGrades, 
    gradesLoading, 
    approveGrade, 
    disputeGrade 
  } = useTeacherSubmissions();

  const {
    requests: rawExemptionRequests,
    isLoading: exemptionsLoading,
    approveExemption,
    rejectExemption,
  } = useExemptionRequests();

  // Transform pending grades
  const pendingGrades = useMemo(() => {
    if (!rawPendingGrades) return [];
    return rawPendingGrades.map((sub: any) => ({
      id: sub.id,
      student: sub.studentProfile 
        ? `${sub.studentProfile.first_name} ${sub.studentProfile.last_name}`
        : "Unknown Student",
      project: sub.challenge?.title || "Project",
      company: sub.companyProfile?.company_name || "Company",
      companyGrade: getGradeLabel(sub.grade),
      credits: sub.challenge?.credits || 0,
      feedback: sub.company_feedback || "",
      submittedAt: sub.graded_at 
        ? new Date(sub.graded_at).toLocaleDateString()
        : "Recently",
      status: sub.status as "pending" | "approved" | "disputed",
      challengeId: sub.challenge?.id || "",
      // Artifacts for viewing
      githubUrl: sub.files_url || "",
      videoUrl: sub.video_url || "",
      artifactFiles: sub.artifactFiles || [],
      // Authenticity data
      authenticityScore: sub.authenticity_score,
      authenticityBreakdown: sub.authenticity_breakdown,
      flaggedForReview: sub.flagged_for_review || false,
      flagReasons: sub.flag_reasons || [],
    }));
  }, [rawPendingGrades]);

  // Transform exemption requests
  const exemptionRequests = useMemo(() => {
    if (!rawExemptionRequests) return [];
    return rawExemptionRequests.map((req: any) => exemptionRequestFromDb({
      ...req,
      studentProfile: req.studentProfile,
      currentCredits: req.currentCredits,
    })).map(req => ({
      id: req.id,
      student: req.studentProfile 
        ? `${req.studentProfile.firstName} ${req.studentProfile.lastName}`
        : "Unknown Student",
      credits: req.currentCredits || req.creditsAtRequest,
      requiredCredits: 300, // Could be configurable
      requestedAt: new Date(req.createdAt).toLocaleDateString(),
      reason: req.reason || "",
      status: req.status as "pending" | "approved" | "rejected",
      warning: req.creditsAtRequest < 300 ? `${300 - req.creditsAtRequest} credits below threshold` : undefined,
      subject: req.subject,
    }));
  }, [rawExemptionRequests]);

  // Filter for pending items
  const pendingGradesFiltered = pendingGrades.filter(g => g.status !== "approved");
  const exemptionRequestsFiltered = exemptionRequests.filter(e => e.status === "pending");

  const allGradesSelected = pendingGradesFiltered.length > 0 && 
    selectedGrades.size === pendingGradesFiltered.length;
  const someGradesSelected = selectedGrades.size > 0 && !allGradesSelected;
  
  const allExemptionsSelected = exemptionRequestsFiltered.length > 0 && 
    selectedExemptions.size === exemptionRequestsFiltered.length;
  const someExemptionsSelected = selectedExemptions.size > 0 && !allExemptionsSelected;

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      "Excellent": "bg-success text-success-foreground",
      "Satisfied": "bg-primary text-primary-foreground",
      "Average": "bg-warning text-warning-foreground",
      "Dissatisfied": "bg-destructive text-destructive-foreground",
    };
    return colors[grade] || "bg-muted text-muted-foreground";
  };

  // Toggle selection
  const toggleGradeSelection = (id: string) => {
    const newSelected = new Set(selectedGrades);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedGrades(newSelected);
  };

  const toggleAllGrades = () => {
    if (allGradesSelected) {
      setSelectedGrades(new Set());
    } else {
      setSelectedGrades(new Set(pendingGradesFiltered.map(g => g.id)));
    }
  };

  const toggleExemptionSelection = (id: string) => {
    const newSelected = new Set(selectedExemptions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedExemptions(newSelected);
  };

  const toggleAllExemptions = () => {
    if (allExemptionsSelected) {
      setSelectedExemptions(new Set());
    } else {
      setSelectedExemptions(new Set(exemptionRequestsFiltered.map(e => e.id)));
    }
  };

  // Actions
  const handleApproveGrade = async (item: typeof pendingGrades[0]) => {
    try {
      await approveGrade.mutateAsync({
        submissionId: item.id,
        credits: item.credits,
        challengeId: item.challengeId,
      });
      toast.success("Grade approved and credits awarded to student");
    } catch (error) {
      toast.error("Failed to approve grade");
    }
  };

  const handleDisputeGrade = async (id: string) => {
    if (!disputeReason.trim()) {
      toast.error("Please provide a reason for dispute");
      return;
    }
    try {
      await disputeGrade.mutateAsync({
        submissionId: id,
        reason: disputeReason,
      });
      toast.info("Dispute submitted. Company will be notified.");
      setDisputeOpen(null);
      setDisputeReason("");
    } catch (error) {
      toast.error("Failed to submit dispute");
    }
  };

  const handleApproveExemption = async (id: string) => {
    try {
      await approveExemption.mutateAsync(id);
      toast.success("Exam exemption approved");
    } catch (error) {
      toast.error("Failed to approve exemption");
    }
  };

  const handleRejectExemption = async (id: string) => {
    try {
      await rejectExemption.mutateAsync(id);
      toast.info("Exemption request rejected");
    } catch (error) {
      toast.error("Failed to reject exemption");
    }
  };

  // Bulk actions
  const handleBulkApproveGrades = async () => {
    const selectedItems = pendingGradesFiltered.filter(g => selectedGrades.has(g.id));
    for (const item of selectedItems) {
      await handleApproveGrade(item);
    }
    setSelectedGrades(new Set());
    setShowBulkConfirm(null);
  };

  const handleBulkApproveExemptions = async () => {
    for (const id of selectedExemptions) {
      await handleApproveExemption(id);
    }
    setSelectedExemptions(new Set());
    setShowBulkConfirm(null);
  };

  const handleBulkRejectExemptions = async () => {
    for (const id of selectedExemptions) {
      await handleRejectExemption(id);
    }
    setSelectedExemptions(new Set());
    setShowBulkConfirm(null);
  };

  const isLoading = gradesLoading || exemptionsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Assessment Approval</h2>
          <p className="text-muted-foreground text-sm">Review company grades and exam exemption requests</p>
        </div>
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

      {/* Bulk Action Bar for Grades */}
      {activeTab === "grades" && pendingGradesFiltered.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleAllGrades}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {allGradesSelected ? (
                <CheckSquare className="w-5 h-5 text-primary" />
              ) : someGradesSelected ? (
                <div className="relative">
                  <Square className="w-5 h-5" />
                  <Minus className="w-3 h-3 absolute top-1 left-1 text-primary" />
                </div>
              ) : (
                <Square className="w-5 h-5" />
              )}
              Select All
            </button>
            {selectedGrades.size > 0 && (
              <span className="text-sm text-primary font-medium">
                {selectedGrades.size} selected
              </span>
            )}
          </div>
          
          {selectedGrades.size > 0 && (
            <Button 
              size="sm" 
              className="rounded-xl gap-2"
              onClick={() => setShowBulkConfirm("approve")}
            >
              <CheckCircle className="w-4 h-4" />
              Approve Selected ({selectedGrades.size})
            </Button>
          )}
        </div>
      )}

      {/* Bulk Action Bar for Exemptions */}
      {activeTab === "exemptions" && exemptionRequestsFiltered.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleAllExemptions}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {allExemptionsSelected ? (
                <CheckSquare className="w-5 h-5 text-primary" />
              ) : someExemptionsSelected ? (
                <div className="relative">
                  <Square className="w-5 h-5" />
                  <Minus className="w-3 h-3 absolute top-1 left-1 text-primary" />
                </div>
              ) : (
                <Square className="w-5 h-5" />
              )}
              Select All
            </button>
            {selectedExemptions.size > 0 && (
              <span className="text-sm text-primary font-medium">
                {selectedExemptions.size} selected
              </span>
            )}
          </div>
          
          {selectedExemptions.size > 0 && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                size="sm" 
                className="rounded-xl gap-2 text-destructive hover:text-destructive hover:border-destructive"
                onClick={() => setShowBulkConfirm("reject")}
              >
                <XCircle className="w-4 h-4" />
                Reject ({selectedExemptions.size})
              </Button>
              <Button 
                size="sm" 
                className="rounded-xl gap-2 bg-success hover:bg-success/90"
                onClick={() => setShowBulkConfirm("approve")}
              >
                <CheckCircle className="w-4 h-4" />
                Approve ({selectedExemptions.size})
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Grades Content */}
      {activeTab === "grades" && (
        <div className="space-y-4">
          {pendingGradesFiltered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No pending grades to review.
            </div>
          ) : (
            pendingGradesFiltered.map((item) => (
              <div 
                key={item.id} 
                className={`glass-card p-5 transition-all ${
                  item.status === "disputed" ? "border-warning/30" : 
                  selectedGrades.has(item.id) ? "border-primary/50 bg-primary/5" : ""
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button 
                      onClick={() => toggleGradeSelection(item.id)}
                      className="mt-1 shrink-0"
                    >
                      {selectedGrades.has(item.id) ? (
                        <CheckSquare className="w-5 h-5 text-primary" />
                      ) : (
                        <Square className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                    
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
                        {item.status === "disputed" && (
                          <span className="status-badge bg-warning/10 text-warning">
                            <Flag className="w-3 h-3 mr-1" />
                            Disputed
                          </span>
                        )}
                        {item.flaggedForReview && (
                          <span className="status-badge bg-destructive/10 text-destructive">
                            <ShieldAlert className="w-3 h-3 mr-1" />
                            Review Needed
                          </span>
                        )}
                        <AuthenticityBadge 
                          score={item.authenticityScore} 
                          breakdown={item.authenticityBreakdown}
                          flagged={item.flaggedForReview}
                          flagReasons={item.flagReasons}
                          size="sm"
                        />
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
                  {item.feedback && (
                    <div className="p-4 rounded-xl bg-muted/30 ml-9">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-foreground">Company Feedback</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.feedback}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 ml-9 flex-wrap">
                    {/* View Artifacts Button */}
                    {(item.githubUrl || item.videoUrl || item.artifactFiles?.length > 0) && (
                      <div className="flex items-center gap-2">
                        {item.githubUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl gap-2"
                            onClick={() => window.open(item.githubUrl, "_blank")}
                          >
                            <Github className="w-4 h-4" />
                            View Code
                          </Button>
                        )}
                        {item.videoUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl gap-2"
                            onClick={() => window.open(item.videoUrl, "_blank")}
                          >
                            <Video className="w-4 h-4" />
                            Watch Video
                          </Button>
                        )}
                        {item.artifactFiles?.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl gap-2"
                            onClick={() => {
                              item.artifactFiles.forEach((file: any) => {
                                window.open(file.file_path, "_blank");
                              });
                            }}
                          >
                            <FileText className="w-4 h-4" />
                            Files ({item.artifactFiles.length})
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {item.status !== "disputed" && (
                      <>
                        <Button 
                          className="rounded-xl gap-2 bg-success hover:bg-success/90"
                          onClick={() => handleApproveGrade(item)}
                          disabled={approveGrade.isPending}
                        >
                          {approveGrade.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Approve & Award Credits
                        </Button>
                        <Button 
                          variant="outline"
                          className="rounded-xl gap-2 text-warning hover:text-warning"
                          onClick={() => setDisputeOpen(item.id)}
                        >
                          <Flag className="w-4 h-4" />
                          Dispute Grade
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Exemptions Content */}
      {activeTab === "exemptions" && (
        <div className="space-y-4">
          {exemptionRequestsFiltered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No pending exemption requests.
            </div>
          ) : (
            exemptionRequestsFiltered.map((item) => (
              <div 
                key={item.id} 
                className={`glass-card p-5 transition-all ${
                  selectedExemptions.has(item.id) ? "border-primary/50 bg-primary/5" : ""
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button 
                      onClick={() => toggleExemptionSelection(item.id)}
                      className="mt-1 shrink-0"
                    >
                      {selectedExemptions.has(item.id) ? (
                        <CheckSquare className="w-5 h-5 text-primary" />
                      ) : (
                        <Square className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                    
                    <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-foreground">{item.student}</h3>
                        {item.warning && (
                          <span className="status-badge bg-warning/10 text-warning">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {item.warning}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Subject: {item.subject}</p>
                      <p className="text-xs text-muted-foreground">Requested {item.requestedAt}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-success">{item.credits}</p>
                      <p className="text-xs text-muted-foreground">/ {item.requiredCredits} required</p>
                    </div>
                  </div>

                  {/* Reason */}
                  {item.reason && (
                    <div className="p-4 rounded-xl bg-muted/30 ml-9">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-foreground">Student's Reason</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.reason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 ml-9">
                    <Button 
                      className="rounded-xl gap-2 bg-success hover:bg-success/90"
                      onClick={() => handleApproveExemption(item.id)}
                      disabled={approveExemption.isPending}
                    >
                      {approveExemption.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Approve Exemption
                    </Button>
                    <Button 
                      variant="outline"
                      className="rounded-xl gap-2 text-destructive hover:text-destructive"
                      onClick={() => handleRejectExemption(item.id)}
                      disabled={rejectExemption.isPending}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Dispute Dialog */}
      <Dialog open={!!disputeOpen} onOpenChange={() => setDisputeOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispute Grade</DialogTitle>
            <DialogDescription>
              Provide a reason for disputing this grade. The company will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              rows={4}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Explain why you disagree with this grade..."
              className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisputeOpen(null)}>
              Cancel
            </Button>
            <Button 
              onClick={() => disputeOpen && handleDisputeGrade(disputeOpen)}
              disabled={disputeGrade.isPending}
              className="gap-2"
            >
              {disputeGrade.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Confirm Dialog */}
      <Dialog open={!!showBulkConfirm} onOpenChange={() => setShowBulkConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {showBulkConfirm === "approve" ? "Confirm Bulk Approval" : "Confirm Bulk Rejection"}
            </DialogTitle>
            <DialogDescription>
              {activeTab === "grades" 
                ? `You are about to approve ${selectedGrades.size} grade(s) and award credits.`
                : showBulkConfirm === "approve"
                  ? `You are about to approve ${selectedExemptions.size} exemption request(s).`
                  : `You are about to reject ${selectedExemptions.size} exemption request(s).`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkConfirm(null)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (activeTab === "grades") {
                  handleBulkApproveGrades();
                } else if (showBulkConfirm === "approve") {
                  handleBulkApproveExemptions();
                } else {
                  handleBulkRejectExemptions();
                }
              }}
              className={showBulkConfirm === "reject" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {showBulkConfirm === "approve" ? "Approve All" : "Reject All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssessmentApproval;

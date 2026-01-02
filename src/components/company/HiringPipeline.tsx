import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Mail, 
  CheckCircle,
  ArrowRight,
  FileText,
  Briefcase,
  Send,
  MessageSquare,
  X,
  Loader2
} from "lucide-react";
import { useHiringPipeline, PipelineCandidate } from "@/hooks/useHiringPipeline";

const HiringPipeline = () => {
  const { candidates, byStage, stageCounts, isLoading, updateStage } = useHiringPipeline();
  
  const [loadingAction, setLoadingAction] = useState<{ id: string; action: string } | null>(null);
  const [showContactModal, setShowContactModal] = useState<PipelineCandidate | null>(null);
  const [contactMessage, setContactMessage] = useState("");

  const stages = [
    { id: "shortlisted", label: "Shortlisted", count: stageCounts.shortlisted },
    { id: "interviewing", label: "Interviewing", count: stageCounts.interviewing },
    { id: "offer_sent", label: "Offer Sent", count: stageCounts.offer_sent },
    { id: "hired", label: "Hired", count: stageCounts.hired },
  ];

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "shortlisted": return <Users className="w-4 h-4" />;
      case "interviewing": return <Calendar className="w-4 h-4" />;
      case "offer_sent": return <FileText className="w-4 h-4" />;
      case "hired": return <CheckCircle className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getStageBadge = (stage: string) => {
    const styles: Record<string, string> = {
      shortlisted: "status-badge-primary",
      interviewing: "status-badge-warning",
      offer_sent: "status-badge-success",
      hired: "bg-primary text-primary-foreground",
    };
    const labels: Record<string, string> = {
      shortlisted: "Shortlisted",
      interviewing: "Interviewing",
      offer_sent: "Offer Sent",
      hired: "Hired",
    };
    return <span className={`status-badge ${styles[stage] || 'status-badge-primary'}`}>{labels[stage] || stage}</span>;
  };

  const handleAction = async (candidateId: string, action: string) => {
    setLoadingAction({ id: candidateId, action });
    
    try {
      const stageMap: Record<string, "shortlisted" | "interviewing" | "offer_sent" | "hired"> = {
        schedule: "interviewing",
        sendOffer: "offer_sent",
        markHired: "hired",
      };
      
      const newStage = stageMap[action];
      if (newStage) {
        await updateStage.mutateAsync({ 
          candidateId, 
          stage: newStage,
          notes: `Stage updated: ${action}` 
        });
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const handleContact = async () => {
    if (!showContactModal || !contactMessage.trim()) return;
    
    setLoadingAction({ id: showContactModal.id, action: "contact" });
    // Simulate sending message
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoadingAction(null);
    setShowContactModal(null);
    setContactMessage("");
    toast.success("Message sent successfully");
  };

  const handleFollowUp = async (candidate: PipelineCandidate) => {
    setLoadingAction({ id: candidate.id, action: "followUp" });
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoadingAction(null);
    toast.success(`Follow-up sent to ${candidate.student?.firstName || 'candidate'}`);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '??';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Hiring Pipeline</h2>
          <p className="text-muted-foreground">Track candidates through the hiring process</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card text-center animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-secondary mx-auto mb-3" />
              <div className="h-6 bg-secondary rounded w-8 mx-auto mb-2" />
              <div className="h-4 bg-secondary rounded w-16 mx-auto" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="dashboard-card animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary" />
                <div className="flex-1">
                  <div className="h-4 bg-secondary rounded w-1/3 mb-2" />
                  <div className="h-3 bg-secondary rounded w-1/4 mb-2" />
                  <div className="h-3 bg-secondary rounded w-1/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Hiring Pipeline</h2>
        <p className="text-muted-foreground">Track candidates through the hiring process</p>
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-4 gap-4">
        {stages.map((stage, idx) => (
          <div key={stage.id} className="relative">
            <div className="stat-card text-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                {getStageIcon(stage.id)}
              </div>
              <p className="text-2xl font-bold text-foreground">{stage.count}</p>
              <p className="text-sm text-muted-foreground">{stage.label}</p>
            </div>
            {idx < stages.length - 1 && (
              <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!candidates || candidates.length === 0) && (
        <div className="dashboard-card text-center py-12">
          <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Your hiring pipeline is empty</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Add candidates from the Talent Pool to start your recruitment process. 
            Track them through each stage of your hiring workflow.
          </p>
        </div>
      )}

      {/* Candidates List */}
      {candidates && candidates.length > 0 && (
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="dashboard-card">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold flex-shrink-0">
                    {getInitials(candidate.student?.firstName, candidate.student?.lastName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-foreground">
                        {candidate.student?.firstName || 'Unknown'} {candidate.student?.lastName || 'Candidate'}
                      </h3>
                      {getStageBadge(candidate.stage)}
                    </div>
                    <p className="text-sm text-muted-foreground">{candidate.student?.university || 'University not specified'}</p>
                    <p className="text-sm text-primary font-medium">{candidate.student?.email}</p>
                    
                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(candidate.student?.skills || []).slice(0, 5).map((skill) => (
                        <span key={skill} className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                          {skill}
                        </span>
                      ))}
                      {(candidate.student?.skills?.length || 0) === 0 && (
                        <span className="text-xs text-muted-foreground">No skills listed</span>
                      )}
                    </div>

                    {/* Stage-specific info */}
                    {candidate.notes && (
                      <p className="mt-2 text-sm text-muted-foreground italic">"{candidate.notes}"</p>
                    )}
                    
                    {candidate.student?.credits && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span className="text-foreground">{candidate.student.credits} credits earned</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions based on stage */}
                <div className="flex lg:flex-col items-center gap-2 lg:border-l lg:border-border lg:pl-4 flex-shrink-0">
                  {candidate.stage === "shortlisted" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-lg gap-2 flex-1 lg:w-full"
                        onClick={() => setShowContactModal(candidate)}
                      >
                        <Mail className="w-4 h-4" />
                        Contact
                      </Button>
                      <Button 
                        size="sm"
                        className="rounded-lg gap-2 flex-1 lg:w-full"
                        onClick={() => handleAction(candidate.id, "schedule")}
                        disabled={loadingAction?.id === candidate.id}
                      >
                        {loadingAction?.id === candidate.id && loadingAction.action === "schedule" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Calendar className="w-4 h-4" />
                        )}
                        Schedule
                      </Button>
                    </>
                  )}
                  {candidate.stage === "interviewing" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-lg gap-2 flex-1 lg:w-full"
                        onClick={() => setShowContactModal(candidate)}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </Button>
                      <Button 
                        size="sm"
                        className="rounded-lg gap-2 flex-1 lg:w-full"
                        onClick={() => handleAction(candidate.id, "sendOffer")}
                        disabled={loadingAction?.id === candidate.id}
                      >
                        {loadingAction?.id === candidate.id && loadingAction.action === "sendOffer" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Send Offer
                      </Button>
                    </>
                  )}
                  {candidate.stage === "offer_sent" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-lg gap-2 flex-1 lg:w-full"
                        onClick={() => handleFollowUp(candidate)}
                        disabled={loadingAction?.id === candidate.id}
                      >
                        {loadingAction?.id === candidate.id && loadingAction.action === "followUp" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                        Follow Up
                      </Button>
                      <Button 
                        size="sm"
                        className="rounded-lg gap-2 flex-1 lg:w-full"
                        onClick={() => handleAction(candidate.id, "markHired")}
                        disabled={loadingAction?.id === candidate.id}
                      >
                        {loadingAction?.id === candidate.id && loadingAction.action === "markHired" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Mark Hired
                      </Button>
                    </>
                  )}
                  {candidate.stage === "hired" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-lg gap-2 flex-1 lg:w-full"
                      onClick={() => setShowContactModal(candidate)}
                    >
                      <FileText className="w-4 h-4" />
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                Contact {showContactModal.student?.firstName || 'Candidate'}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowContactModal(null)} className="rounded-lg">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">To</label>
                <div className="input-clean flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {showContactModal.student?.email || 'No email available'}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Write your message..."
                  className="input-clean min-h-[120px] resize-none"
                  rows={4}
                />
              </div>
            </div>
            <div className="p-5 border-t border-border flex gap-3">
              <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setShowContactModal(null)}>
                Cancel
              </Button>
              <Button 
                className="flex-1 rounded-lg gap-2" 
                onClick={handleContact}
                disabled={!contactMessage.trim() || loadingAction?.action === "contact"}
              >
                {loadingAction?.action === "contact" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HiringPipeline;
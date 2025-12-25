import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Mail, 
  CheckCircle,
  Clock,
  ArrowRight,
  FileText,
  Briefcase,
  Send,
  MessageSquare,
  X,
  Loader2
} from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  email: string;
  university: string;
  role: string;
  stage: string;
  skills: string[];
  score: string;
  interviewDate?: string;
  notes?: string;
  offerSent?: string;
  offerAmount?: string;
  startDate?: string;
}

const HiringPipeline = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 1,
      name: "Elena Rodriguez",
      email: "elena.r@stanford.edu",
      university: "Stanford University",
      role: "Backend Engineer Intern",
      stage: "interviewing",
      skills: ["Python", "Django", "Redis"],
      score: "Excellent",
      interviewDate: "Dec 28, 2024",
      notes: "Strong technical skills. Schedule technical round.",
    },
    {
      id: 2,
      name: "David Chen",
      email: "david.c@mit.edu",
      university: "MIT",
      role: "Frontend Developer",
      stage: "offer",
      skills: ["React", "TypeScript", "D3.js"],
      score: "Excellent",
      offerSent: "Dec 20, 2024",
      offerAmount: "$85,000/year",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      email: "sarah.j@berkeley.edu",
      university: "UC Berkeley",
      role: "Backend Engineer Intern",
      stage: "shortlisted",
      skills: ["Python", "Django"],
      score: "Excellent",
    },
    {
      id: 4,
      name: "Marcus Reed",
      email: "marcus.r@gatech.edu",
      university: "Georgia Tech",
      role: "Full Stack Developer",
      stage: "shortlisted",
      skills: ["Node.js", "React", "PostgreSQL"],
      score: "Satisfied",
    },
    {
      id: 5,
      name: "Lila Rossi",
      email: "lila.r@cmu.edu",
      university: "Carnegie Mellon",
      role: "Data Engineer",
      stage: "hired",
      skills: ["Python", "Spark", "AWS"],
      score: "Excellent",
      startDate: "Feb 1, 2025",
    },
  ]);

  const [loadingAction, setLoadingAction] = useState<{ id: number; action: string } | null>(null);
  const [showContactModal, setShowContactModal] = useState<Candidate | null>(null);
  const [contactMessage, setContactMessage] = useState("");

  const stages = [
    { id: "shortlisted", label: "Shortlisted", count: candidates.filter(c => c.stage === "shortlisted").length },
    { id: "interviewing", label: "Interviewing", count: candidates.filter(c => c.stage === "interviewing").length },
    { id: "offer", label: "Offer Sent", count: candidates.filter(c => c.stage === "offer").length },
    { id: "hired", label: "Hired", count: candidates.filter(c => c.stage === "hired").length },
  ];

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "shortlisted": return <Users className="w-4 h-4" />;
      case "interviewing": return <Calendar className="w-4 h-4" />;
      case "offer": return <FileText className="w-4 h-4" />;
      case "hired": return <CheckCircle className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getStageBadge = (stage: string) => {
    const styles: Record<string, string> = {
      shortlisted: "status-badge-primary",
      interviewing: "status-badge-warning",
      offer: "status-badge-success",
      hired: "bg-primary text-primary-foreground",
    };
    const labels: Record<string, string> = {
      shortlisted: "Shortlisted",
      interviewing: "Interviewing",
      offer: "Offer Sent",
      hired: "Hired",
    };
    return <span className={`status-badge ${styles[stage]}`}>{labels[stage]}</span>;
  };

  const handleAction = async (candidateId: number, action: string) => {
    setLoadingAction({ id: candidateId, action });
    await new Promise(resolve => setTimeout(resolve, 1200));

    setCandidates(prev => prev.map(c => {
      if (c.id !== candidateId) return c;

      switch (action) {
        case "schedule":
          return { ...c, stage: "interviewing", interviewDate: "Jan 5, 2025" };
        case "sendOffer":
          return { ...c, stage: "offer", offerSent: new Date().toLocaleDateString(), offerAmount: "$80,000/year" };
        case "markHired":
          return { ...c, stage: "hired", startDate: "Feb 15, 2025" };
        default:
          return c;
      }
    }));

    setLoadingAction(null);

    const messages: Record<string, string> = {
      schedule: "Interview scheduled successfully",
      sendOffer: "Offer sent successfully",
      markHired: "Candidate marked as hired",
      followUp: "Follow-up email sent",
    };
    toast.success(messages[action] || "Action completed");
  };

  const handleContact = async () => {
    if (!showContactModal || !contactMessage.trim()) return;
    
    setLoadingAction({ id: showContactModal.id, action: "contact" });
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoadingAction(null);
    setShowContactModal(null);
    setContactMessage("");
    toast.success("Message sent successfully");
  };

  const handleFollowUp = async (candidate: Candidate) => {
    setLoadingAction({ id: candidate.id, action: "followUp" });
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoadingAction(null);
    toast.success(`Follow-up sent to ${candidate.name}`);
  };

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

      {/* Candidates List */}
      <div className="space-y-4">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="dashboard-card">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold flex-shrink-0">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                    {getStageBadge(candidate.stage)}
                  </div>
                  <p className="text-sm text-muted-foreground">{candidate.university}</p>
                  <p className="text-sm text-primary font-medium">{candidate.role}</p>
                  
                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {candidate.skills.map((skill) => (
                      <span key={skill} className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Stage-specific info */}
                  {candidate.interviewDate && candidate.stage === "interviewing" && (
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-foreground">Interview: {candidate.interviewDate}</span>
                    </div>
                  )}
                  {candidate.offerAmount && (
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-primary" />
                      <span className="text-foreground">Offer: {candidate.offerAmount}</span>
                      <span className="text-muted-foreground">• Sent {candidate.offerSent}</span>
                    </div>
                  )}
                  {candidate.startDate && (
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-foreground">Start Date: {candidate.startDate}</span>
                    </div>
                  )}
                  {candidate.notes && (
                    <p className="mt-2 text-sm text-muted-foreground italic">"{candidate.notes}"</p>
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
                {candidate.stage === "offer" && (
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

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Contact {showContactModal.name}</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowContactModal(null)} className="rounded-lg">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">To</label>
                <div className="input-clean flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {showContactModal.email}
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
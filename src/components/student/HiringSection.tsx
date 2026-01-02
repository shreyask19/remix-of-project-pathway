import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  DollarSign, 
  CheckCircle,
  X,
  Building2,
  ArrowRight,
  Sparkles,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useStudentInvitations } from "@/hooks/useInvitations";
import { useHiringPipeline } from "@/hooks/useHiringPipeline";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const HiringSection = () => {
  const { user } = useAuth();
  const { 
    pendingInvitations, 
    respondedInvitations, 
    isLoading, 
    respondToInvitation 
  } = useStudentInvitations();

  // Get pipeline counts for the current student
  const { data: pipelineData } = useQuery({
    queryKey: ["studentPipeline", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data } = await supabase
        .from("hiring_pipeline")
        .select("stage")
        .eq("student_id", user.id);

      const stages = {
        applied: 0,
        shortlisted: 0,
        interviewing: 0,
        offer: 0,
      };

      (data || []).forEach(row => {
        if (row.stage === "shortlisted") stages.shortlisted++;
        else if (row.stage === "interviewing") stages.interviewing++;
        else if (row.stage === "offer_sent") stages.offer++;
      });

      // Count applications
      const { count } = await supabase
        .from("project_applications")
        .select("*", { count: "exact", head: true })
        .eq("student_id", user.id);

      stages.applied = count || 0;

      return stages;
    },
    enabled: !!user,
  });

  const handleAcceptInvitation = (id: string) => {
    respondToInvitation.mutate({ invitationId: id, accept: true });
  };

  const handleDenyInvitation = (id: string) => {
    respondToInvitation.mutate({ invitationId: id, accept: false });
  };

  const pipelineStages = [
    { label: "Applied", count: pipelineData?.applied || 0, active: false },
    { label: "Shortlisted", count: pipelineData?.shortlisted || 0, active: false },
    { label: "Interview", count: pipelineData?.interviewing || 0, active: pipelineData?.interviewing ? pipelineData.interviewing > 0 : false },
    { label: "Offer", count: pipelineData?.offer || 0, active: pipelineData?.offer ? pipelineData.offer > 0 : false },
  ];

  const activeStageIndex = pipelineStages.findIndex(s => s.count > 0);
  const progressWidth = activeStageIndex >= 0 ? `${((activeStageIndex + 1) / pipelineStages.length) * 100}%` : "0%";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Get offers (invitations with type 'offer')
  const offers = pendingInvitations.filter(i => i.type === "offer");
  const interviews = pendingInvitations.filter(i => i.type !== "offer");

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <div className="glass-card">
        <h3 className="font-bold text-foreground mb-6">Your Hiring Pipeline</h3>
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
          <div className="absolute top-6 left-0 h-0.5 bg-primary transition-all" style={{ width: progressWidth }} />
          
          {pipelineStages.map((stage, idx) => (
            <div key={stage.label} className="flex-1 relative z-10">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all ${
                  stage.count > 0 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {stage.count}
                </div>
                <p className={`text-sm mt-3 ${stage.count > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {stage.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invitations */}
      {interviews.length > 0 && (
        <div>
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Pending Invitations ({interviews.length})
          </h3>
          <div className="space-y-4">
            {interviews.map((invitation) => (
              <div key={invitation.id} className="glass-card">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center text-xl font-bold">
                      {invitation.company?.companyName?.[0] || "C"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-bold text-foreground">{invitation.role}</h4>
                        <span className="status-badge bg-warning/10 text-warning">
                          {invitation.type === "interview" ? "Interview Invitation" : invitation.type}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{invitation.company?.companyName}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                        {invitation.company?.headquarters && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {invitation.company.headquarters}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/50">
                    <Button 
                      variant="outline" 
                      className="rounded-xl gap-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDenyInvitation(invitation.id)}
                      disabled={respondToInvitation.isPending}
                    >
                      <X className="w-4 h-4" />
                      Deny
                    </Button>
                    <Button 
                      className="rounded-xl gap-2 bg-success hover:bg-success/90"
                      onClick={() => handleAcceptInvitation(invitation.id)}
                      disabled={respondToInvitation.isPending}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job Offers */}
      {offers.length > 0 && (
        <div>
          <h3 className="font-bold text-foreground mb-4">Job Offers</h3>
          <div className="space-y-4">
            {offers.map((offer) => (
              <div key={offer.id} className="glass-card border-success/30 bg-success/5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center text-xl font-bold">
                      {offer.company?.companyName?.[0] || "C"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-bold text-foreground">{offer.role}</h4>
                        <span className="status-badge bg-success/10 text-success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Offer Received
                        </span>
                      </div>
                      <p className="text-muted-foreground">{offer.company?.companyName}</p>
                      {offer.company?.headquarters && (
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {offer.company.headquarters}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/50">
                    <Button 
                      variant="outline" 
                      className="rounded-xl"
                      onClick={() => handleDenyInvitation(offer.id)}
                      disabled={respondToInvitation.isPending}
                    >
                      Decline
                    </Button>
                    <Button 
                      className="rounded-xl bg-success hover:bg-success/90"
                      onClick={() => handleAcceptInvitation(offer.id)}
                      disabled={respondToInvitation.isPending}
                    >
                      Accept Offer
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Responded Invitations */}
      {respondedInvitations.length > 0 && (
        <div>
          <h3 className="font-bold text-foreground mb-4 text-muted-foreground">Responded</h3>
          <div className="space-y-3">
            {respondedInvitations.map((invitation) => (
              <div key={invitation.id} className="glass-card-subtle opacity-60">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center font-bold">
                    {invitation.company?.companyName?.[0] || "C"}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{invitation.role}</h4>
                    <p className="text-sm text-muted-foreground">{invitation.company?.companyName}</p>
                  </div>
                  <span className={`status-badge ${
                    invitation.status === "accepted" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                  }`}>
                    {invitation.status === "accepted" ? "Accepted" : "Declined"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pendingInvitations.length === 0 && offers.length === 0 && (
        <div className="glass-card border-dashed border-2 border-border bg-muted/30">
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Build More Projects to Get Noticed</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Companies review your project submissions and reach out directly for interviews. Keep building!
            </p>
            <Button variant="outline" className="rounded-2xl gap-2">
              Browse Projects <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HiringSection;

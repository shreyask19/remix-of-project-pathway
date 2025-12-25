import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  DollarSign, 
  CheckCircle,
  X,
  Building2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface Invitation {
  id: number;
  company: string;
  companyLogo: string;
  role: string;
  type: string;
  location: string;
  salary: string;
  receivedAt: string;
  deadline?: string;
  status: "pending" | "accepted" | "rejected" | "shortlisted";
}

interface Offer {
  id: number;
  company: string;
  companyLogo: string;
  role: string;
  location: string;
  salary: string;
  startDate: string;
  status: "pending" | "accepted" | "rejected";
}

const HiringSection = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: 1,
      company: "Stripe",
      companyLogo: "S",
      role: "Backend Engineering Intern",
      type: "Interview Invitation",
      location: "Remote",
      salary: "$40/hr",
      receivedAt: "2 days ago",
      deadline: "Respond by Dec 28",
      status: "pending",
    },
    {
      id: 2,
      company: "Airbnb",
      companyLogo: "A",
      role: "Frontend Developer",
      type: "Shortlisted",
      location: "San Francisco, CA",
      salary: "$45/hr",
      receivedAt: "1 week ago",
      status: "shortlisted",
    },
    {
      id: 3,
      company: "Notion",
      companyLogo: "N",
      role: "Full Stack Developer",
      type: "Interview Invitation",
      location: "Remote",
      salary: "$50/hr",
      receivedAt: "3 days ago",
      status: "pending",
    },
  ]);

  const [offers, setOffers] = useState<Offer[]>([
    {
      id: 1,
      company: "Revolut",
      companyLogo: "R",
      role: "Product Design Intern",
      location: "London, UK (Remote OK)",
      salary: "£35,000/year",
      startDate: "Feb 2025",
      status: "pending",
    },
  ]);

  const handleAcceptInvitation = (id: number) => {
    setInvitations(prev => 
      prev.map(inv => inv.id === id ? { ...inv, status: "accepted" as const } : inv)
    );
    toast.success("Invitation accepted! The company will contact you shortly.");
  };

  const handleDenyInvitation = (id: number) => {
    setInvitations(prev => 
      prev.map(inv => inv.id === id ? { ...inv, status: "rejected" as const } : inv)
    );
    toast.info("Invitation declined.");
  };

  const handleAcceptOffer = (id: number) => {
    setOffers(prev => 
      prev.map(offer => offer.id === id ? { ...offer, status: "accepted" as const } : offer)
    );
    toast.success("Congratulations! You've accepted the offer.");
  };

  const handleDenyOffer = (id: number) => {
    setOffers(prev => 
      prev.map(offer => offer.id === id ? { ...offer, status: "rejected" as const } : offer)
    );
    toast.info("Offer declined.");
  };

  const pipelineStages = [
    { label: "Applied", count: 5, active: false },
    { label: "Shortlisted", count: 3, active: false },
    { label: "Interview", count: 2, active: true },
    { label: "Offer", count: 1, active: false },
  ];

  const pendingInvitations = invitations.filter(i => i.status === "pending" || i.status === "shortlisted");
  const respondedInvitations = invitations.filter(i => i.status === "accepted" || i.status === "rejected");

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <div className="glass-card">
        <h3 className="font-bold text-foreground mb-6">Your Hiring Pipeline</h3>
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
          <div className="absolute top-6 left-0 h-0.5 bg-primary" style={{ width: "50%" }} />
          
          {pipelineStages.map((stage) => (
            <div key={stage.label} className="flex-1 relative z-10">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all ${
                  stage.active 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {stage.count}
                </div>
                <p className={`text-sm mt-3 ${stage.active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {stage.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <div>
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Pending Invitations ({pendingInvitations.length})
          </h3>
          <div className="space-y-4">
            {pendingInvitations.map((invitation) => (
              <div key={invitation.id} className="glass-card">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center text-xl font-bold">
                      {invitation.companyLogo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-bold text-foreground">{invitation.role}</h4>
                        <span className={`status-badge ${
                          invitation.status === "pending" 
                            ? "bg-warning/10 text-warning" 
                            : "bg-primary/10 text-primary"
                        }`}>
                          {invitation.type}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{invitation.company}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {invitation.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          {invitation.salary}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/50">
                    {invitation.deadline && (
                      <p className="text-sm text-destructive font-medium">{invitation.deadline}</p>
                    )}
                    <Button 
                      variant="outline" 
                      className="rounded-xl gap-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDenyInvitation(invitation.id)}
                    >
                      <X className="w-4 h-4" />
                      Deny
                    </Button>
                    <Button 
                      className="rounded-xl gap-2 bg-success hover:bg-success/90"
                      onClick={() => handleAcceptInvitation(invitation.id)}
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
      {offers.filter(o => o.status === "pending").length > 0 && (
        <div>
          <h3 className="font-bold text-foreground mb-4">Job Offers</h3>
          <div className="space-y-4">
            {offers.filter(o => o.status === "pending").map((offer) => (
              <div key={offer.id} className="glass-card border-success/30 bg-success/5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center text-xl font-bold">
                      {offer.companyLogo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-bold text-foreground">{offer.role}</h4>
                        <span className="status-badge bg-success/10 text-success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Offer Received
                        </span>
                      </div>
                      <p className="text-muted-foreground">{offer.company}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {offer.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          {offer.salary}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Start: {offer.startDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/50">
                    <Button 
                      variant="outline" 
                      className="rounded-xl"
                      onClick={() => handleDenyOffer(offer.id)}
                    >
                      Decline
                    </Button>
                    <Button 
                      className="rounded-xl bg-success hover:bg-success/90"
                      onClick={() => handleAcceptOffer(offer.id)}
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
                    {invitation.companyLogo}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{invitation.role}</h4>
                    <p className="text-sm text-muted-foreground">{invitation.company}</p>
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
      {pendingInvitations.length === 0 && offers.filter(o => o.status === "pending").length === 0 && (
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

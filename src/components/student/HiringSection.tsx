import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  DollarSign, 
  CheckCircle,
  Clock,
  ArrowRight,
  Building2,
  Video,
  Mail
} from "lucide-react";

const HiringSection = () => {
  const invitations = [
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
  ];

  const offers = [
    {
      id: 1,
      company: "Revolut",
      companyLogo: "R",
      role: "Product Design Intern",
      type: "Offer",
      location: "London, UK (Remote OK)",
      salary: "£35,000/year",
      startDate: "Feb 2025",
      status: "offer_received",
    },
  ];

  const pipelineStages = [
    { label: "Applied", count: 5, active: false },
    { label: "Shortlisted", count: 3, active: false },
    { label: "Interview", count: 2, active: true },
    { label: "Offer", count: 1, active: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Hiring & Interviews</h2>
        <p className="text-muted-foreground">Track your interview invitations and job offers</p>
      </div>

      {/* Pipeline Overview */}
      <div className="dashboard-card">
        <h3 className="font-bold text-foreground mb-4">Your Hiring Pipeline</h3>
        <div className="flex items-center justify-between">
          {pipelineStages.map((stage, idx) => (
            <div key={stage.label} className="flex-1 relative">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold ${
                  stage.active 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {stage.count}
                </div>
                <p className={`text-sm mt-2 ${stage.active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {stage.label}
                </p>
              </div>
              {idx < pipelineStages.length - 1 && (
                <div className="absolute top-6 left-1/2 w-full h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interview Invitations */}
      <div>
        <h3 className="font-bold text-foreground mb-4">Interview Invitations</h3>
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div key={invitation.id} className="dashboard-card">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center text-xl font-bold">
                    {invitation.companyLogo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
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
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {invitation.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {invitation.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {invitation.receivedAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {invitation.deadline && (
                    <p className="text-sm text-destructive">{invitation.deadline}</p>
                  )}
                  <Button variant="outline" className="rounded-2xl gap-2">
                    <Video className="w-4 h-4" />
                    Schedule
                  </Button>
                  <Button className="rounded-2xl">Accept</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Job Offers */}
      <div>
        <h3 className="font-bold text-foreground mb-4">Job Offers</h3>
        <div className="space-y-4">
          {offers.map((offer) => (
            <div key={offer.id} className="dashboard-card border-success/30 bg-success/5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center text-xl font-bold">
                    {offer.companyLogo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-foreground">{offer.role}</h4>
                      <span className="status-badge bg-success/10 text-success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Offer Received
                      </span>
                    </div>
                    <p className="text-muted-foreground">{offer.company}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {offer.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {offer.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Start: {offer.startDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" className="rounded-2xl">View Details</Button>
                  <Button className="rounded-2xl bg-success hover:bg-success/90">Accept Offer</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State for more opportunities */}
      <div className="dashboard-card border-dashed border-2 border-border bg-muted/30">
        <div className="text-center py-6">
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
    </div>
  );
};

export default HiringSection;

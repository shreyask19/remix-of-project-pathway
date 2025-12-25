import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Mail, 
  Video,
  CheckCircle,
  Clock,
  ArrowRight,
  FileText,
  Briefcase
} from "lucide-react";

const HiringPipeline = () => {
  const stages = [
    { id: "shortlisted", label: "Shortlisted", count: 18, color: "bg-primary" },
    { id: "interviewing", label: "Interviewing", count: 6, color: "bg-warning" },
    { id: "offer", label: "Offer Sent", count: 3, color: "bg-success" },
    { id: "hired", label: "Hired", count: 2, color: "bg-success" },
  ];

  const candidates = [
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
  ];

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "shortlisted":
        return <Users className="w-4 h-4" />;
      case "interviewing":
        return <Video className="w-4 h-4" />;
      case "offer":
        return <FileText className="w-4 h-4" />;
      case "hired":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case "shortlisted":
        return <span className="status-badge bg-primary/10 text-primary">Shortlisted</span>;
      case "interviewing":
        return <span className="status-badge bg-warning/10 text-warning">Interviewing</span>;
      case "offer":
        return <span className="status-badge bg-success/10 text-success">Offer Sent</span>;
      case "hired":
        return <span className="status-badge bg-success text-success-foreground">Hired</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Hiring Pipeline</h2>
        <p className="text-muted-foreground">Track candidates through the hiring process</p>
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-4 gap-4">
        {stages.map((stage, idx) => (
          <div key={stage.id} className="relative">
            <div className="stat-card text-center">
              <div className={`w-10 h-10 rounded-2xl ${stage.color} text-primary-foreground flex items-center justify-center mx-auto mb-3`}>
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
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-foreground">{candidate.name}</h3>
                    {getStageBadge(candidate.stage)}
                  </div>
                  <p className="text-sm text-muted-foreground">{candidate.university}</p>
                  <p className="text-sm text-primary font-medium">{candidate.role}</p>
                  
                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {candidate.skills.map((skill) => (
                      <span key={skill} className="text-xs px-2 py-1 rounded-xl bg-secondary text-muted-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Stage-specific info */}
                  {candidate.interviewDate && (
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-warning" />
                      <span className="text-foreground">Interview: {candidate.interviewDate}</span>
                    </div>
                  )}
                  {candidate.offerAmount && (
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-success" />
                      <span className="text-foreground">Offer: {candidate.offerAmount}</span>
                      <span className="text-muted-foreground">• Sent {candidate.offerSent}</span>
                    </div>
                  )}
                  {candidate.startDate && (
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-foreground">Start Date: {candidate.startDate}</span>
                    </div>
                  )}
                  {candidate.notes && (
                    <p className="mt-2 text-sm text-muted-foreground italic">"{candidate.notes}"</p>
                  )}
                </div>
              </div>

              {/* Actions based on stage */}
              <div className="flex lg:flex-col items-center gap-2 lg:border-l lg:border-border lg:pl-4">
                {candidate.stage === "shortlisted" && (
                  <>
                    <Button variant="outline" className="rounded-xl gap-2 flex-1 lg:w-full">
                      <Mail className="w-4 h-4" />
                      Contact
                    </Button>
                    <Button className="rounded-xl gap-2 flex-1 lg:w-full">
                      <Video className="w-4 h-4" />
                      Schedule Interview
                    </Button>
                  </>
                )}
                {candidate.stage === "interviewing" && (
                  <>
                    <Button variant="outline" className="rounded-xl gap-2 flex-1 lg:w-full">
                      <Clock className="w-4 h-4" />
                      Reschedule
                    </Button>
                    <Button className="rounded-xl gap-2 flex-1 lg:w-full bg-success hover:bg-success/90">
                      <FileText className="w-4 h-4" />
                      Send Offer
                    </Button>
                  </>
                )}
                {candidate.stage === "offer" && (
                  <>
                    <Button variant="outline" className="rounded-xl gap-2 flex-1 lg:w-full">
                      <Mail className="w-4 h-4" />
                      Follow Up
                    </Button>
                    <Button className="rounded-xl gap-2 flex-1 lg:w-full bg-success hover:bg-success/90">
                      <CheckCircle className="w-4 h-4" />
                      Mark Accepted
                    </Button>
                  </>
                )}
                {candidate.stage === "hired" && (
                  <Button variant="outline" className="rounded-xl gap-2 flex-1 lg:w-full">
                    <FileText className="w-4 h-4" />
                    View Details
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HiringPipeline;

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Github, 
  Video, 
  FileText, 
  CheckCircle, 
  Clock, 
  Star,
  MessageSquare,
  ExternalLink
} from "lucide-react";

const SubmissionFlow = () => {
  const submissions = [
    {
      id: 1,
      project: "Fintech App Redesign",
      company: "Revolut",
      submittedAt: "2 days ago",
      status: "graded",
      grade: "Excellent",
      credits: 75,
      feedback: "Outstanding work! The user flow is intuitive and the visual design is polished. Great attention to detail on the trust signals.",
      files: ["Design_Final.fig", "Prototype_Link.pdf"],
      videoUrl: "explanation.mp4",
    },
    {
      id: 2,
      project: "API Integration Module",
      company: "Stripe",
      submittedAt: "5 days ago",
      status: "under_review",
      credits: 90,
      files: ["github.com/alex/stripe-module"],
      videoUrl: "demo.mp4",
    },
    {
      id: 3,
      project: "Dashboard Components",
      company: "Airbnb",
      submittedAt: "1 week ago",
      status: "submitted",
      credits: 70,
      files: ["components.zip", "storybook-link.md"],
      videoUrl: "walkthrough.mp4",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "graded":
        return <span className="status-badge bg-success/10 text-success">Graded</span>;
      case "under_review":
        return <span className="status-badge bg-warning/10 text-warning">Under Review</span>;
      case "submitted":
        return <span className="status-badge bg-primary/10 text-primary">Submitted</span>;
      default:
        return <span className="status-badge bg-muted text-muted-foreground">Draft</span>;
    }
  };

  const getGradeBadge = (grade: string) => {
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Submissions</h2>
          <p className="text-muted-foreground">Track your project submissions and company feedback</p>
        </div>
      </div>

      {/* Submission Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground">Total Submissions</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-success/10 text-success flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">8</p>
              <p className="text-xs text-muted-foreground">Graded</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-warning/10 text-warning flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-xs text-muted-foreground">Under Review</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">6</p>
              <p className="text-xs text-muted-foreground">Excellent Grades</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div key={submission.id} className="dashboard-card">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-foreground text-background flex items-center justify-center font-bold">
                    {submission.company[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{submission.project}</h3>
                    <p className="text-sm text-muted-foreground">{submission.company}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    {getStatusBadge(submission.status)}
                    {submission.grade && (
                      <span className={`status-badge ${getGradeBadge(submission.grade)}`}>
                        {submission.grade}
                      </span>
                    )}
                  </div>
                </div>

                {/* Files */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {submission.files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary text-sm">
                      {file.includes("github") ? (
                        <Github className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      <span className="text-muted-foreground">{file}</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </div>
                  ))}
                  {submission.videoUrl && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary text-sm">
                      <Video className="w-4 h-4" />
                      <span className="text-muted-foreground">Video Explanation</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Feedback */}
                {submission.feedback && (
                  <div className="p-4 rounded-2xl bg-success/5 border border-success/20">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium text-foreground">Company Feedback</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{submission.feedback}</p>
                  </div>
                )}
              </div>

              <div className="lg:w-48 flex flex-col gap-2">
                <div className="text-right mb-2">
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium text-foreground">{submission.submittedAt}</p>
                </div>
                {submission.credits && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Credits Earned</p>
                    <p className="text-xl font-bold text-primary">{submission.credits}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload New Submission */}
      <div className="dashboard-card border-dashed border-2 border-border bg-muted/30">
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-foreground mb-2">Submit a New Project</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload your project files, GitHub link, and video explanation
          </p>
          <Button className="rounded-2xl gap-2">
            <Upload className="w-4 h-4" />
            Start Submission
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionFlow;

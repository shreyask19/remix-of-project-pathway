import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Github, 
  Video, 
  FileText, 
  CheckCircle, 
  Clock, 
  Star,
  MessageSquare,
  ExternalLink,
  Loader2
} from "lucide-react";
import { useMemo } from "react";
import { useStudentSubmissions } from "@/hooks/useSubmissions";
import { submissionFromDb, getGradeLabel } from "@/lib/transformers";

const SubmissionFlow = () => {
  const { submissions: rawSubmissions, isLoading, stats } = useStudentSubmissions();

  // Transform DB data to UI format
  const submissions = useMemo(() => {
    if (!rawSubmissions) return [];
    return rawSubmissions.map(sub => submissionFromDb(sub));
  }, [rawSubmissions]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "graded":
      case "approved":
        return <span className="status-badge bg-success/10 text-success">Graded</span>;
      case "submitted":
        return <span className="status-badge bg-warning/10 text-warning">Under Review</span>;
      case "draft":
        return <span className="status-badge bg-muted text-muted-foreground">Draft</span>;
      default:
        return <span className="status-badge bg-primary/10 text-primary">Submitted</span>;
    }
  };

  const getGradeBadgeColor = (grade: string) => {
    const colors: Record<string, string> = {
      "Excellent": "bg-success text-success-foreground",
      "Satisfied": "bg-primary text-primary-foreground",
      "Average": "bg-warning text-warning-foreground",
      "Dissatisfied": "bg-destructive text-destructive-foreground",
    };
    return colors[grade] || "bg-muted text-muted-foreground";
  };

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
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
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
              <p className="text-2xl font-bold text-foreground">{stats.graded}</p>
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
              <p className="text-2xl font-bold text-foreground">{stats.underReview}</p>
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
              <p className="text-2xl font-bold text-foreground">{stats.excellent}</p>
              <p className="text-xs text-muted-foreground">Excellent Grades</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {submissions.length === 0 && (
        <div className="dashboard-card border-dashed border-2 border-border bg-muted/30">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-foreground mb-2">No Submissions Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Apply to a project and submit your work to see it here
            </p>
          </div>
        </div>
      )}

      {/* Submissions List */}
      <div className="space-y-4">
        {submissions.map((submission) => {
          const gradeLabel = getGradeLabel(submission.grade);
          
          return (
            <div key={submission.id} className="dashboard-card">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-foreground text-background flex items-center justify-center font-bold">
                      {submission.challenge?.title?.[0] || "P"}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">
                        {submission.challenge?.title || "Project"}
                      </h3>
                      <p className="text-sm text-muted-foreground">Challenge</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      {getStatusBadge(submission.status)}
                      {submission.grade !== null && (
                        <span className={`status-badge ${getGradeBadgeColor(gradeLabel)}`}>
                          {gradeLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Files */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {submission.filesUrl && (
                      <a 
                        href={submission.filesUrl.startsWith("http") ? submission.filesUrl : `https://${submission.filesUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary text-sm hover:bg-secondary/80"
                      >
                        <Github className="w-4 h-4" />
                        <span className="text-muted-foreground">View Code</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </a>
                    )}
                    {submission.videoUrl && (
                      <a
                        href={submission.videoUrl.startsWith("http") ? submission.videoUrl : `https://${submission.videoUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary text-sm hover:bg-secondary/80"
                      >
                        <Video className="w-4 h-4" />
                        <span className="text-muted-foreground">Video Explanation</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </a>
                    )}
                  </div>

                  {/* Feedback */}
                  {submission.companyFeedback && (
                    <div className="p-4 rounded-2xl bg-success/5 border border-success/20">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium text-foreground">Company Feedback</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{submission.companyFeedback}</p>
                    </div>
                  )}
                </div>

                <div className="lg:w-48 flex flex-col gap-2">
                  <div className="text-right mb-2">
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="font-medium text-foreground">
                      {submission.submittedAt 
                        ? new Date(submission.submittedAt).toLocaleDateString()
                        : "Not submitted"}
                    </p>
                  </div>
                  {submission.challenge?.credits && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Potential Credits</p>
                      <p className="text-xl font-bold text-primary">{submission.challenge.credits}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload New Submission CTA */}
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

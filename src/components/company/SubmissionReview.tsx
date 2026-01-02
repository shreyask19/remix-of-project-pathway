import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Eye, 
  Github, 
  Video, 
  Star,
  CheckCircle,
  MessageSquare,
  ExternalLink,
  Send,
  Loader2
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useCompanySubmissions } from "@/hooks/useSubmissions";
import { useGradingWorkflow } from "@/hooks/useSubmissionWorkflow";
import { submissionFromDb, getGradeLabel, getLabelToGrade, type Submission } from "@/lib/transformers";
import AuthenticityIndicators from "@/components/student/AuthenticityIndicators";

const SubmissionReview = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { 
    submissions: rawSubmissions, 
    isLoading, 
    stats,
    startReview 
  } = useCompanySubmissions(activeFilter !== "all" ? activeFilter : undefined);

  const { gradeSubmission } = useGradingWorkflow();

  // Transform DB data to UI format
  const submissions = useMemo(() => {
    if (!rawSubmissions) return [];
    return rawSubmissions.map(sub => submissionFromDb({
      ...sub,
      studentProfile: sub.studentProfile ? {
        first_name: sub.studentProfile.first_name,
        last_name: sub.studentProfile.last_name,
        email: sub.studentProfile.email,
      } : null,
      student: sub.student ? {
        user_id: sub.student.user_id,
        university_name: sub.student.university_name,
      } : null,
    }));
  }, [rawSubmissions]);

  // Filter by search query
  const filteredSubmissions = useMemo(() => {
    if (!searchQuery.trim()) return submissions;
    const query = searchQuery.toLowerCase();
    return submissions.filter(s => 
      s.studentProfile?.firstName?.toLowerCase().includes(query) ||
      s.studentProfile?.lastName?.toLowerCase().includes(query) ||
      s.challenge?.title?.toLowerCase().includes(query)
    );
  }, [submissions, searchQuery]);

  const filters = [
    { id: "all", label: "All", count: stats.total },
    { id: "submitted", label: "New", count: stats.new },
    { id: "graded", label: "Graded", count: stats.graded },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <span className="status-badge bg-primary/10 text-primary">New</span>;
      case "graded":
        return <span className="status-badge bg-success/10 text-success">Graded</span>;
      case "approved":
        return <span className="status-badge bg-success/10 text-success">Approved</span>;
      default:
        return null;
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

  const handleStartReview = async (id: string) => {
    await startReview.mutateAsync(id);
    setSelectedSubmission(id);
    toast.info("Started reviewing submission");
  };

  const handleSubmitGrade = async (id: string) => {
    if (!selectedGrade) {
      toast.error("Please select a grade");
      return;
    }
    if (!feedbackText.trim()) {
      toast.error("Please provide feedback");
      return;
    }

    try {
      await gradeSubmission.mutateAsync({
        submissionId: id,
        grade: getLabelToGrade(selectedGrade),
        feedback: feedbackText,
      });
      
      toast.success("Grade submitted successfully");
      setSelectedSubmission(null);
      setSelectedGrade("");
      setFeedbackText("");
    } catch (error) {
      toast.error("Failed to submit grade");
    }
  };

  const handleViewProject = (url: string | null) => {
    if (url) {
      const fullUrl = url.startsWith("http") ? url : `https://${url}`;
      window.open(fullUrl, '_blank');
      toast.info("Opening project in new tab");
    }
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Submission Review</h2>
          <p className="text-muted-foreground text-sm">Review and grade student project submissions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search submissions..."
              className="pl-10 pr-4 py-2.5 bg-secondary rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
          <Button variant="outline" className="gap-2 rounded-xl">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
              activeFilter === filter.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {filter.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeFilter === filter.id ? "bg-primary-foreground/20" : "bg-muted"
            }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No submissions found matching your criteria.
        </div>
      )}

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => {
          const studentName = submission.studentProfile 
            ? `${submission.studentProfile.firstName} ${submission.studentProfile.lastName}`
            : "Unknown Student";
          const gradeLabel = getGradeLabel(submission.grade);
          
          return (
            <div 
              key={submission.id} 
              className={`glass-card p-5 transition-all ${
                selectedSubmission === submission.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                    {studentName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-foreground">{studentName}</h3>
                      {getStatusBadge(submission.status)}
                      {submission.grade !== null && (
                        <span className={`status-badge ${getGradeBadgeColor(gradeLabel)}`}>
                          <Star className="w-3 h-3 mr-1" />
                          {gradeLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {submission.student?.universityName || "University not specified"}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {submission.challenge?.title || "Challenge"} • Submitted {
                        submission.submittedAt 
                          ? new Date(submission.submittedAt).toLocaleDateString()
                          : "recently"
                      }
                    </p>

                    {/* Files */}
                    <div className="flex flex-wrap gap-2">
                      {submission.filesUrl && (
                        <button
                          onClick={() => handleViewProject(submission.filesUrl)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm hover:bg-muted/80 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          <span className="text-muted-foreground">View Code</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </button>
                      )}
                      {submission.videoUrl && (
                        <button
                          onClick={() => handleViewProject(submission.videoUrl)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm hover:bg-muted/80 transition-colors"
                        >
                          <Video className="w-4 h-4" />
                          <span className="text-muted-foreground">Video Explanation</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </button>
                      )}
                    </div>

                    {/* Feedback if graded */}
                    {submission.companyFeedback && (
                      <div className="mt-3 p-3 rounded-xl bg-success/5 border border-success/20">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-4 h-4 text-success" />
                          <span className="text-xs font-medium text-foreground">Your Feedback</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{submission.companyFeedback}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col items-center gap-2 lg:border-l lg:border-border lg:pl-4">
                  <Button 
                    variant="outline" 
                    className="rounded-xl gap-2 flex-1 lg:w-full"
                    onClick={() => handleViewProject(submission.filesUrl)}
                  >
                    <Eye className="w-4 h-4" />
                    View Project
                  </Button>
                  {submission.status === "submitted" && (
                    <Button 
                      className="rounded-xl gap-2 flex-1 lg:w-full"
                      onClick={() => handleStartReview(submission.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Start Review
                    </Button>
                  )}
                </div>
              </div>

              {/* Grading Panel */}
              {selectedSubmission === submission.id && submission.status === "submitted" && (
                <div className="mt-4 pt-4 border-t border-border space-y-4">
                  <h4 className="font-medium text-foreground">Grade this submission</h4>
                  
                  {/* Authenticity Indicators */}
                  <AuthenticityIndicators 
                    submissionId={submission.id}
                    githubUrl={submission.filesUrl} 
                    videoUrl={submission.videoUrl}
                    submittedAt={submission.submittedAt}
                    authenticityScore={submission.authenticityScore}
                    authenticityBreakdown={submission.authenticityBreakdown}
                    flagged={submission.flaggedForReview}
                    flagReasons={submission.flagReasons}
                  />

                  {/* Grade Selection */}
                  <div className="grid md:grid-cols-4 gap-3">
                    {["Excellent", "Satisfied", "Average", "Dissatisfied"].map((grade) => (
                      <button
                        key={grade}
                        onClick={() => setSelectedGrade(grade)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          selectedGrade === grade 
                            ? "border-primary bg-primary/10" 
                            : "border-border hover:border-primary/50"
                        } ${
                          grade === "Excellent" ? "hover:bg-success/10" :
                          grade === "Satisfied" ? "hover:bg-primary/10" :
                          grade === "Average" ? "hover:bg-warning/10" :
                          "hover:bg-destructive/10"
                        }`}
                      >
                        <p className="font-medium text-foreground">{grade}</p>
                      </button>
                    ))}
                  </div>
                  
                  {/* Feedback */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Feedback *</label>
                    <textarea
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Provide constructive feedback for the student..."
                      className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      className="rounded-xl" 
                      onClick={() => {
                        setSelectedSubmission(null);
                        setSelectedGrade("");
                        setFeedbackText("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="rounded-xl gap-2"
                      onClick={() => handleSubmitGrade(submission.id)}
                      disabled={gradeSubmission.isPending}
                    >
                      {gradeSubmission.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Submit Grade
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubmissionReview;

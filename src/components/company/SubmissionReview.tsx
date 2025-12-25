import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Eye, 
  Github, 
  Video, 
  FileText,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import { useState } from "react";

const SubmissionReview = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);

  const filters = [
    { id: "all", label: "All", count: 47 },
    { id: "new", label: "New", count: 8 },
    { id: "reviewing", label: "Under Review", count: 12 },
    { id: "graded", label: "Graded", count: 27 },
  ];

  const submissions = [
    {
      id: 1,
      student: "Elena Rodriguez",
      email: "elena.r@stanford.edu",
      university: "Stanford University",
      challenge: "Backend Optimization Challenge",
      submittedAt: "2 hours ago",
      status: "new",
      files: ["github.com/elena/django-optimization"],
      hasVideo: true,
      skills: ["Python", "Django", "Redis"],
      score: null,
    },
    {
      id: 2,
      student: "David Chen",
      email: "david.c@mit.edu",
      university: "MIT",
      challenge: "React Dashboard Component",
      submittedAt: "5 hours ago",
      status: "reviewing",
      files: ["github.com/davidc/react-dashboard"],
      hasVideo: true,
      skills: ["React", "TypeScript", "D3.js"],
      score: null,
    },
    {
      id: 3,
      student: "Sarah Johnson",
      email: "sarah.j@berkeley.edu",
      university: "UC Berkeley",
      challenge: "Backend Optimization Challenge",
      submittedAt: "1 day ago",
      status: "graded",
      files: ["github.com/sarahj/backend-opt"],
      hasVideo: true,
      skills: ["Python", "Django"],
      score: "Excellent",
      feedback: "Outstanding implementation of caching strategies. Reduced API response time by 85%.",
    },
    {
      id: 4,
      student: "James Wilson",
      email: "james.w@gatech.edu",
      university: "Georgia Tech",
      challenge: "React Dashboard Component",
      submittedAt: "2 days ago",
      status: "graded",
      files: ["github.com/jamesw/charts-lib"],
      hasVideo: false,
      skills: ["React", "JavaScript"],
      score: "Satisfied",
      feedback: "Good component architecture. Could improve on accessibility.",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="status-badge bg-primary/10 text-primary">New</span>;
      case "reviewing":
        return <span className="status-badge bg-warning/10 text-warning">Under Review</span>;
      case "graded":
        return <span className="status-badge bg-success/10 text-success">Graded</span>;
      default:
        return null;
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

  const filteredSubmissions = activeFilter === "all" 
    ? submissions 
    : submissions.filter(s => s.status === activeFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Submission Review</h2>
          <p className="text-muted-foreground">Review and grade student project submissions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search submissions..."
              className="pl-10 pr-4 py-2 bg-secondary rounded-2xl text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
          <Button variant="outline" className="gap-2 rounded-2xl">
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
            className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
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

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <div 
            key={submission.id} 
            className={`dashboard-card transition-all ${
              selectedSubmission === submission.id ? "ring-2 ring-primary" : ""
            }`}
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                  {submission.student.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-foreground">{submission.student}</h3>
                    {getStatusBadge(submission.status)}
                    {submission.score && (
                      <span className={`status-badge ${getGradeBadge(submission.score)}`}>
                        <Star className="w-3 h-3 mr-1" />
                        {submission.score}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{submission.university}</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {submission.challenge} • Submitted {submission.submittedAt}
                  </p>
                  
                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {submission.skills.map((skill) => (
                      <span key={skill} className="text-xs px-2 py-1 rounded-xl bg-secondary text-muted-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Files */}
                  <div className="flex flex-wrap gap-2">
                    {submission.files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted text-sm">
                        <Github className="w-4 h-4" />
                        <span className="text-muted-foreground">{file}</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </div>
                    ))}
                    {submission.hasVideo && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted text-sm">
                        <Video className="w-4 h-4" />
                        <span className="text-muted-foreground">Video Explanation</span>
                      </div>
                    )}
                  </div>

                  {/* Feedback if graded */}
                  {submission.feedback && (
                    <div className="mt-3 p-3 rounded-xl bg-success/5 border border-success/20">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-success" />
                        <span className="text-xs font-medium text-foreground">Your Feedback</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{submission.feedback}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col items-center gap-2 lg:border-l lg:border-border lg:pl-4">
                <Button variant="outline" className="rounded-xl gap-2 flex-1 lg:w-full">
                  <Eye className="w-4 h-4" />
                  View Code
                </Button>
                {submission.status !== "graded" && (
                  <>
                    <Button 
                      className="rounded-xl gap-2 flex-1 lg:w-full bg-success hover:bg-success/90"
                      onClick={() => setSelectedSubmission(submission.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Grade
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Grading Panel */}
            {selectedSubmission === submission.id && submission.status !== "graded" && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="font-medium text-foreground mb-3">Grade this submission</h4>
                <div className="grid md:grid-cols-4 gap-3 mb-4">
                  {["Excellent", "Satisfied", "Average", "Dissatisfied"].map((grade) => (
                    <button
                      key={grade}
                      className={`p-3 rounded-xl border-2 border-border hover:border-primary text-center transition-colors ${
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
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Feedback</label>
                  <textarea
                    rows={3}
                    placeholder="Provide constructive feedback for the student..."
                    className="w-full px-4 py-2 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="rounded-xl" onClick={() => setSelectedSubmission(null)}>
                    Cancel
                  </Button>
                  <Button className="rounded-xl">Submit Grade</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionReview;

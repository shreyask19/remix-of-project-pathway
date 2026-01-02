import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Circle, Upload, Briefcase } from "lucide-react";
import { useActiveProjects } from "@/hooks/useActiveProjects";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import SubmissionModal from "./SubmissionModal";

const ActiveProject = () => {
  const { activeProject, isLoading } = useActiveProjects();
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  if (isLoading) {
    return (
      <div className="dashboard-card flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!activeProject) {
    return (
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Active Project</h2>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-foreground mb-2">No Active Projects</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Apply to a challenge from the Project Marketplace to get started
          </p>
          <Button className="rounded-2xl">Browse Projects</Button>
        </div>
      </div>
    );
  }

  const deadlineText = activeProject.deadline
    ? formatDistanceToNow(new Date(activeProject.deadline), { addSuffix: true })
    : "No deadline";

  const milestones = [
    { title: "Project Applied", completed: true },
    { title: "Work Started", completed: activeProject.progress >= 30, current: activeProject.progress >= 10 && activeProject.progress < 30 },
    { title: "Submitted", completed: activeProject.progress >= 70, current: activeProject.progress >= 30 && activeProject.progress < 70 },
    { title: "Graded", completed: activeProject.progress === 100, current: activeProject.progress >= 70 && activeProject.progress < 100 },
  ];

  const canSubmit = activeProject.submissionStatus !== "submitted" && 
                   activeProject.submissionStatus !== "graded" && 
                   activeProject.submissionStatus !== "approved";

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">Active Project</h2>
        <button className="text-sm text-primary font-medium hover:underline">View all projects</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 aspect-video flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-8 h-8" />
              </div>
              <p className="text-lg font-bold text-foreground">{activeProject.title}</p>
              <p className="text-sm text-muted-foreground">{activeProject.company}</p>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
              {activeProject.company[0]}
            </div>
            <span className="text-sm text-muted-foreground">{activeProject.company}</span>
            <span className="ml-auto status-badge bg-destructive/10 text-destructive">
              <Clock className="w-3 h-3 mr-1" />
              {deadlineText}
            </span>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">{activeProject.title}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{activeProject.description}</p>

          <div className="flex items-center gap-4 mb-4">
            <span className={`status-badge ${
              activeProject.difficulty === "Easy" ? "bg-success/10 text-success" :
              activeProject.difficulty === "Medium" ? "bg-warning/10 text-warning" :
              "bg-destructive/10 text-destructive"
            }`}>
              {activeProject.difficulty}
            </span>
            <span className="text-sm font-medium text-primary">{activeProject.credits} Credits</span>
            {activeProject.submissionStatus && (
              <span className={`text-xs px-2 py-1 rounded-lg ${
                activeProject.submissionStatus === "draft" ? "bg-muted text-muted-foreground" :
                activeProject.submissionStatus === "submitted" ? "bg-primary/10 text-primary" :
                activeProject.submissionStatus === "graded" ? "bg-warning/10 text-warning" :
                "bg-success/10 text-success"
              }`}>
                {activeProject.submissionStatus === "draft" ? "Draft in Progress" :
                 activeProject.submissionStatus === "submitted" ? "Under Review" :
                 activeProject.submissionStatus === "graded" ? "Pending Approval" :
                 "Approved"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-primary font-medium">{activeProject.progress}%</span>
          </div>
          <Progress value={activeProject.progress} className="h-2 mb-4" />

          {/* Milestones */}
          <div className="space-y-2 mb-6">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {milestone.completed ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : milestone.current ? (
                  <Circle className="w-4 h-4 text-primary fill-primary/20" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={`text-sm ${
                  milestone.completed ? "text-muted-foreground line-through" :
                  milestone.current ? "text-foreground font-medium" :
                  "text-muted-foreground"
                }`}>
                  {milestone.title}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button className="rounded-2xl flex-1" variant="outline">Resume Work</Button>
            {canSubmit && (
              <Button 
                className="rounded-2xl gap-2 flex-1"
                onClick={() => setShowSubmissionModal(true)}
              >
                <Upload className="w-4 h-4" />
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      <SubmissionModal 
        open={showSubmissionModal} 
        onOpenChange={setShowSubmissionModal} 
      />
    </div>
  );
};

export default ActiveProject;

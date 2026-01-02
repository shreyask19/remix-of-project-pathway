import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle, Briefcase } from "lucide-react";
import { useActiveProjects, ActiveProject } from "@/hooks/useActiveProjects";
import { useSubmissionWorkflow } from "@/hooks/useSubmissionWorkflow";
import SubmissionUpload from "./SubmissionUpload";

interface SubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubmissionModal = ({ open, onOpenChange }: SubmissionModalProps) => {
  const { projects, isLoading: loadingProjects } = useActiveProjects();
  const { createDraftSubmission, submitProject } = useSubmissionWorkflow();
  
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "upload">("select");

  // Get eligible projects (approved but not yet graded)
  const eligibleProjects = useMemo(() => {
    return projects.filter(
      (p) => p.status === "approved" && p.submissionStatus !== "graded" && p.submissionStatus !== "approved"
    );
  }, [projects]);

  const selectedProject = useMemo(() => {
    return eligibleProjects.find((p) => p.applicationId === selectedProjectId);
  }, [eligibleProjects, selectedProjectId]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedProjectId("");
      setSubmissionId(null);
      setStep("select");
    }
  }, [open]);

  const handleStartSubmission = async () => {
    if (!selectedProject) return;

    try {
      const result = await createDraftSubmission.mutateAsync({
        applicationId: selectedProject.applicationId,
        challengeId: selectedProject.challengeId,
      });
      setSubmissionId(result.id);
      setStep("upload");
    } catch (error) {
      console.error("Failed to create draft:", error);
    }
  };

  const handleSubmit = async (data: {
    githubUrl: string;
    videoUrl: string;
    notes: string;
  }) => {
    if (!submissionId) return;

    try {
      await submitProject.mutateAsync({
        submissionId,
        githubUrl: data.githubUrl,
        videoUrl: data.videoUrl,
        notes: data.notes,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  const handleCancel = () => {
    if (step === "upload") {
      setStep("select");
      setSubmissionId(null);
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "select" ? "Start Project Submission" : "Submit Your Project"}
          </DialogTitle>
        </DialogHeader>

        {loadingProjects ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : step === "select" ? (
          <div className="space-y-6">
            {eligibleProjects.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium text-foreground mb-2">No Active Projects</h3>
                <p className="text-sm text-muted-foreground">
                  Apply to a challenge first to start submitting work.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Select Project to Submit
                  </label>
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a project..." />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleProjects.map((project) => (
                        <SelectItem key={project.applicationId} value={project.applicationId}>
                          <div className="flex items-center gap-2">
                            <span>{project.title}</span>
                            <span className="text-muted-foreground">• {project.company}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProject && (
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                        {selectedProject.title[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground">{selectedProject.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{selectedProject.company}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-xs px-2 py-1 rounded-lg ${
                            selectedProject.difficulty === "Easy" ? "bg-success/10 text-success" :
                            selectedProject.difficulty === "Medium" ? "bg-warning/10 text-warning" :
                            "bg-destructive/10 text-destructive"
                          }`}>
                            {selectedProject.difficulty}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary">
                            {selectedProject.credits} Credits
                          </span>
                          {selectedProject.submissionStatus === "draft" && (
                            <span className="text-xs px-2 py-1 rounded-lg bg-muted text-muted-foreground">
                              Draft in progress
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="rounded-xl gap-2 ml-auto"
                    disabled={!selectedProjectId || createDraftSubmission.isPending}
                    onClick={handleStartSubmission}
                  >
                    {createDraftSubmission.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    {selectedProject?.submissionStatus === "draft" ? "Continue Draft" : "Start Submission"}
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          submissionId && selectedProject && (
            <SubmissionUpload
              submissionId={submissionId}
              challengeId={selectedProject.challengeId}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={submitProject.isPending}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionModal;

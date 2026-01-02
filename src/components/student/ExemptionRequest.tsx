import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Award, Loader2, CheckCircle, Clock, XCircle } from "lucide-react";
import { useExemptionRequests } from "@/hooks/useExemptionRequests";
import { useStudentStats } from "@/hooks/useStudentStats";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { toast } from "sonner";

const ExemptionRequest = () => {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [reason, setReason] = useState("");
  
  const { stats } = useStudentStats();
  const { profile } = useStudentProfile();
  const { requests, createRequest, pendingCount, approvedCount } = useExemptionRequests();

  const isEligible = stats.totalCredits >= stats.exemptionThreshold;
  const subjects = profile?.current_subjects || [];

  const handleSubmit = async () => {
    if (!subject) {
      toast.error("Please select a subject");
      return;
    }

    // Check if already requested for this subject
    const alreadyRequested = requests.some(
      r => r.subject === subject && r.status !== "rejected"
    );
    if (alreadyRequested) {
      toast.error("You already have a pending or approved request for this subject");
      return;
    }

    try {
      await createRequest.mutateAsync({
        subject,
        reason,
        creditsAtRequest: stats.totalCredits,
      });
      toast.success("Exemption request submitted successfully!");
      setOpen(false);
      setSubject("");
      setReason("");
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success/10 text-success";
      case "rejected":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-warning/10 text-warning";
    }
  };

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Exam Exemption</h3>
            <p className="text-xs text-muted-foreground">
              {isEligible ? "You're eligible!" : `${stats.exemptionThreshold - stats.totalCredits} credits needed`}
            </p>
          </div>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              className="rounded-xl" 
              disabled={!isEligible}
              variant={isEligible ? "default" : "outline"}
            >
              {isEligible ? "Request Exemption" : "Not Eligible Yet"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Request Exam Exemption</DialogTitle>
              <DialogDescription>
                Select a subject to request exemption based on your project credits.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subject *
                </label>
                {subjects.length > 0 ? (
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter subject name"
                    className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why you're requesting this exemption..."
                  className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <div className="p-3 bg-primary/5 rounded-xl">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Your Credits</span>
                  <span className="font-medium text-primary">{stats.totalCredits}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Threshold</span>
                  <span className="font-medium text-foreground">{stats.exemptionThreshold}</span>
                </div>
              </div>

              <Button 
                className="w-full rounded-xl" 
                onClick={handleSubmit}
                disabled={createRequest.isPending}
              >
                {createRequest.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing Requests */}
      {requests.length > 0 && (
        <div className="space-y-2 mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Your Requests</p>
          {requests.slice(0, 3).map((request) => (
            <div 
              key={request.id} 
              className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(request.status)}
                <span className="text-sm text-foreground">{request.subject}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(request.status)}`}>
                {request.status}
              </span>
            </div>
          ))}
          {pendingCount > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {pendingCount} pending review
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExemptionRequest;

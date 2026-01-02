import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShieldCheck, Clock, Briefcase, Loader2, CheckCircle } from "lucide-react";
import { useReliabilityBadge, useTeacherVouchStatus, type VouchType } from "@/hooks/useReliabilityBadge";

interface AwardBadgeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  studentName: string;
}

const badgeTypes: { type: VouchType; icon: typeof Clock; label: string; description: string }[] = [
  {
    type: "punctuality",
    icon: Clock,
    label: "Punctuality",
    description: "Consistently submits work on time",
  },
  {
    type: "professionalism",
    icon: Briefcase,
    label: "Professionalism",
    description: "Demonstrates professional conduct",
  },
  {
    type: "reliability",
    icon: ShieldCheck,
    label: "Reliability",
    description: "Dependable and trustworthy",
  },
];

const AwardBadgeModal = ({ open, onOpenChange, studentId, studentName }: AwardBadgeModalProps) => {
  const [selectedType, setSelectedType] = useState<VouchType | null>(null);
  const { awardBadge } = useReliabilityBadge();
  const { existingVouches, isLoading: statusLoading, hasVouched } = useTeacherVouchStatus(studentId);

  const handleAward = async () => {
    if (!selectedType) return;

    try {
      await awardBadge.mutateAsync({ studentId, vouchType: selectedType });
      setSelectedType(null);
      onOpenChange(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const allBadgesAwarded = existingVouches.length === 3;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Award Reliability Badge</DialogTitle>
          <DialogDescription>
            Recognize <span className="font-medium text-foreground">{studentName}</span> for their exceptional performance
          </DialogDescription>
        </DialogHeader>

        {statusLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : allBadgesAwarded ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
            <p className="font-medium text-foreground">All badges awarded!</p>
            <p className="text-sm text-muted-foreground mt-1">
              You've already awarded all badge types to this student.
            </p>
          </div>
        ) : (
          <div className="space-y-3 py-4">
            {badgeTypes.map(({ type, icon: Icon, label, description }) => {
              const alreadyAwarded = hasVouched(type);
              const isSelected = selectedType === type;

              return (
                <button
                  key={type}
                  onClick={() => !alreadyAwarded && setSelectedType(type)}
                  disabled={alreadyAwarded}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    alreadyAwarded
                      ? "border-success/30 bg-success/5 cursor-not-allowed"
                      : isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      alreadyAwarded ? "bg-success/10 text-success" :
                      isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium ${
                          alreadyAwarded ? "text-success" : "text-foreground"
                        }`}>
                          {label}
                        </p>
                        {alreadyAwarded && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                            Awarded
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    {isSelected && !alreadyAwarded && (
                      <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {!allBadgesAwarded && (
            <Button 
              onClick={handleAward} 
              disabled={!selectedType || awardBadge.isPending}
              className="gap-2"
            >
              {awardBadge.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Awarding...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Award Badge
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AwardBadgeModal;

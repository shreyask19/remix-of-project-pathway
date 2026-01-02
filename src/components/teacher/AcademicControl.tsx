import { Button } from "@/components/ui/button";
import { 
  Award, 
  Target, 
  Calendar,
  BookOpen,
  Save,
  Info,
  Loader2,
  CheckCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTeacherSettings } from "@/hooks/useTeacherSettings";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { Skeleton } from "@/components/ui/skeleton";

const AcademicControl = () => {
  const { settings, isLoading, saveSettings } = useTeacherSettings();
  const { profile } = useTeacherProfile();
  
  const [creditThreshold, setCreditThreshold] = useState(300);
  const [minProjects, setMinProjects] = useState(5);
  const [iaDeadline, setIADeadline] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Sync local state with fetched settings
  useEffect(() => {
    if (settings) {
      setCreditThreshold(settings.credit_threshold || 300);
      setMinProjects(settings.min_projects || 5);
      setIADeadline(settings.ia_deadline ? settings.ia_deadline.split("T")[0] : "");
    }
  }, [settings]);

  // Track changes
  useEffect(() => {
    const originalThreshold = settings?.credit_threshold || 300;
    const originalMinProjects = settings?.min_projects || 5;
    const originalDeadline = settings?.ia_deadline ? settings.ia_deadline.split("T")[0] : "";
    
    setHasChanges(
      creditThreshold !== originalThreshold ||
      minProjects !== originalMinProjects ||
      iaDeadline !== originalDeadline
    );
  }, [creditThreshold, minProjects, iaDeadline, settings]);

  const handleSave = async () => {
    try {
      await saveSettings.mutateAsync({
        credit_threshold: creditThreshold,
        min_projects: minProjects,
        ia_deadline: iaDeadline || null,
      });
      toast.success("Settings saved successfully");
      setHasChanges(false);
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const gradeWeights = [
    { grade: "Excellent", weight: 100, color: "bg-success" },
    { grade: "Satisfied", weight: 80, color: "bg-primary" },
    { grade: "Average", weight: 60, color: "bg-warning" },
    { grade: "Dissatisfied", weight: 40, color: "bg-destructive" },
  ];

  // Get subjects from teacher profile
  const subjects = profile?.subjects_taught?.map((subject, idx) => ({
    name: subject,
    code: `SUB${idx + 1}`,
    credits: 3,
    enrolled: "—",
  })) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="dashboard-card">
              <Skeleton className="h-40 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Academic Control</h2>
          <p className="text-muted-foreground">Configure assessment rules and credit thresholds</p>
        </div>
        {hasChanges && (
          <span className="text-xs text-warning bg-warning/10 px-2 py-1 rounded-full">
            Unsaved changes
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Credit Thresholds */}
        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Credit Thresholds</h3>
              <p className="text-sm text-muted-foreground">Set requirements for exam exemption</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Exam Exemption Threshold
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="50"
                  value={creditThreshold}
                  onChange={(e) => setCreditThreshold(Number(e.target.value))}
                  className="flex-1 h-2 bg-secondary rounded-full appearance-none cursor-pointer"
                />
                <span className="w-20 text-center font-bold text-foreground bg-secondary px-3 py-2 rounded-xl">
                  {creditThreshold}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Students need {creditThreshold} credits to request exam exemption
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Minimum Projects Required
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="1"
                  value={minProjects}
                  onChange={(e) => setMinProjects(Number(e.target.value))}
                  className="flex-1 h-2 bg-secondary rounded-full appearance-none cursor-pointer"
                />
                <span className="w-20 text-center font-bold text-foreground bg-secondary px-3 py-2 rounded-xl">
                  {minProjects}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Students must complete at least {minProjects} projects
              </p>
            </div>
          </div>
        </div>

        {/* Assessment Deadlines */}
        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Assessment Deadlines</h3>
              <p className="text-sm text-muted-foreground">Configure important dates</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Internal Assessment Deadline
              </label>
              <input
                type="date"
                value={iaDeadline}
                onChange={(e) => setIADeadline(e.target.value)}
                className="w-full px-4 py-2 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="p-4 rounded-2xl bg-muted/50 flex items-start gap-3">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium">Automatic Grade Sync</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Company grades are automatically synced to student records. You only need to approve them.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grade Weights */}
        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Grade to Marks Mapping</h3>
              <p className="text-sm text-muted-foreground">How company grades translate to marks</p>
            </div>
          </div>

          <div className="space-y-3">
            {gradeWeights.map((item) => (
              <div key={item.grade} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="flex-1 text-sm text-foreground">{item.grade}</span>
                <span className="font-bold text-foreground">{item.weight}%</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-success/10 border border-success/20">
            <p className="text-xs text-success flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Compliance ready for university assessment guidelines
            </p>
          </div>
        </div>

        {/* Subject Overview */}
        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Your Subjects</h3>
              <p className="text-sm text-muted-foreground">Courses you're managing</p>
            </div>
          </div>

          {subjects.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No subjects configured</p>
              <p className="text-xs mt-1">Add subjects in your profile settings</p>
            </div>
          ) : (
            <div className="space-y-3">
              {subjects.map((subject, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-muted/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{subject.name}</p>
                    <p className="text-xs text-muted-foreground">{subject.code} • {subject.credits} credits</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          className="rounded-2xl gap-2" 
          onClick={handleSave}
          disabled={!hasChanges || saveSettings.isPending}
        >
          {saveSettings.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saveSettings.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default AcademicControl;

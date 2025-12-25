import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Award, 
  Target, 
  Calendar,
  Shield,
  BookOpen,
  Save,
  Info
} from "lucide-react";
import { useState } from "react";

const AcademicControl = () => {
  const [creditThreshold, setCreditThreshold] = useState(300);
  const [minProjects, setMinProjects] = useState(5);
  const [iaDeadline, setIADeadline] = useState("2025-01-15");

  const gradeWeights = [
    { grade: "Excellent", weight: 100, color: "bg-success" },
    { grade: "Satisfied", weight: 80, color: "bg-primary" },
    { grade: "Average", weight: 60, color: "bg-warning" },
    { grade: "Dissatisfied", weight: 40, color: "bg-destructive" },
  ];

  const subjects = [
    { name: "Data Structures & Algorithms", code: "CS301", credits: 4, enrolled: 45 },
    { name: "Web Development", code: "CS302", credits: 3, enrolled: 52 },
    { name: "Database Management", code: "CS303", credits: 3, enrolled: 48 },
    { name: "Machine Learning", code: "CS401", credits: 4, enrolled: 38 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Academic Control</h2>
        <p className="text-muted-foreground">Configure assessment rules and credit thresholds</p>
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
            <p className="text-xs text-success">
              ✓ Compliance ready for university assessment guidelines
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

          <div className="space-y-3">
            {subjects.map((subject) => (
              <div key={subject.code} className="flex items-center justify-between p-3 rounded-2xl bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{subject.name}</p>
                  <p className="text-xs text-muted-foreground">{subject.code} • {subject.credits} credits</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{subject.enrolled}</p>
                  <p className="text-xs text-muted-foreground">students</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="rounded-2xl gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default AcademicControl;

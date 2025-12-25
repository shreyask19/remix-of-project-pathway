import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Circle, Upload } from "lucide-react";
import fintechMockup from "@/assets/fintech-app-mockup.png";

const ActiveProject = () => {
  const project = {
    company: "Revolut",
    title: "Fintech App Redesign",
    difficulty: "Medium",
    credits: 75,
    deadline: "4 days left",
    progress: 65,
    description: "Redesign the user onboarding flow to increase conversion by 15%. Focus on simplification and trust signals.",
    milestones: [
      { title: "Research & Analysis", completed: true },
      { title: "Wireframes", completed: true },
      { title: "High-fidelity Mockups", completed: false, current: true },
      { title: "Prototype & Testing", completed: false },
    ],
  };

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">Active Project</h2>
        <button className="text-sm text-primary font-medium hover:underline">View all projects</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2">
          <div className="rounded-2xl overflow-hidden bg-foreground aspect-video flex items-center justify-center">
            <img src={fintechMockup} alt={project.title} className="h-full object-contain" />
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
              {project.company[0]}
            </div>
            <span className="text-sm text-muted-foreground">{project.company}</span>
            <span className="ml-auto status-badge bg-destructive/10 text-destructive">
              <Clock className="w-3 h-3 mr-1" />
              {project.deadline}
            </span>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">{project.title}</h3>
          <p className="text-muted-foreground text-sm mb-4">{project.description}</p>

          <div className="flex items-center gap-4 mb-4">
            <span className={`status-badge ${
              project.difficulty === "Easy" ? "bg-success/10 text-success" :
              project.difficulty === "Medium" ? "bg-warning/10 text-warning" :
              "bg-destructive/10 text-destructive"
            }`}>
              {project.difficulty}
            </span>
            <span className="text-sm font-medium text-primary">{project.credits} Credits</span>
          </div>

          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-primary font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2 mb-4" />

          {/* Milestones */}
          <div className="space-y-2 mb-6">
            {project.milestones.map((milestone, idx) => (
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
            <Button className="rounded-2xl flex-1">Resume Work</Button>
            <Button variant="outline" className="rounded-2xl gap-2">
              <Upload className="w-4 h-4" />
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveProject;

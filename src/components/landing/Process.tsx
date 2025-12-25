import { UserPlus, Search, Code, Award, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import dashboardMockup from "@/assets/dashboard-mockup.png";

const steps = [
  {
    number: "1",
    title: "Join Platform",
    description: "Create your profile and import your academic history. AI analyzes your skills and interests.",
    icon: UserPlus,
    color: "bg-primary/10 text-primary",
  },
  {
    number: "2",
    title: "Choose a Live Project",
    description: "Browse real backlog issues from companies like Spotify, Airbnb, and Linear. Filter by difficulty, stack, and industry.",
    icon: Search,
    color: "bg-muted text-foreground",
  },
  {
    number: "3",
    title: "Submit Work",
    description: "Push your code or design to our repo. Our automated heuristic engine runs 400+ checks on quality, security, and style before human review.",
    icon: Code,
    color: "bg-primary text-primary-foreground",
    featured: true,
  },
  {
    number: "4",
    title: "Earn Credits",
    description: "Receive verified credits accepted by 100+ universities instead of traditional letter grades.",
    icon: Award,
    color: "bg-muted text-foreground",
  },
  {
    number: "5",
    title: "Get Hired",
    description: "Companies see your actual work. 40% of Heuristic students get offers before graduation.",
    icon: Briefcase,
    color: "bg-primary/10 text-primary",
  },
];

const Process = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            The Heuristic Process
          </h2>
          <p className="text-muted-foreground max-w-xl">
            A streamlined path from learning to earning. We've removed the busy work to focus on what matters.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <div className="dashboard-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <UserPlus className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-primary">1.</span>
                <h3 className="font-semibold text-foreground">Join Platform</h3>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </div>
              <p className="text-sm text-muted-foreground">{steps[0].description}</p>
            </div>

            <div className="dashboard-card bg-primary text-primary-foreground">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                  <Code className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </div>
              <span className="text-sm opacity-80">3.</span>
              <h3 className="font-semibold mb-2">Submit Work</h3>
              <p className="text-sm opacity-80 mb-4">
                Push your code or design to our repo. Our automated heuristic engine runs 400+ checks on quality, security, and style before human review.
              </p>
              <Button variant="secondary" size="sm" className="rounded-lg">
                View Grading Criteria
              </Button>
            </div>
          </div>

          {/* Middle column */}
          <div className="space-y-6">
            <div className="dashboard-card">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                <Search className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-sm font-medium text-primary">2.</span>
              <h3 className="font-semibold text-foreground mb-2">Choose a Live Project</h3>
              <p className="text-sm text-muted-foreground mb-4">{steps[1].description}</p>
              <div className="rounded-lg overflow-hidden border border-border">
                <img src={dashboardMockup} alt="Project selection interface" className="w-full" />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="dashboard-card">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                  <Award className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-xs font-medium text-primary">4.</span>
                <h3 className="text-sm font-semibold text-foreground mb-1">Earn Credits</h3>
                <p className="text-xs text-muted-foreground">{steps[3].description}</p>
              </div>

              <div className="dashboard-card">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-primary">5.</span>
                <h3 className="text-sm font-semibold text-foreground mb-1">Get Hired</h3>
                <p className="text-xs text-muted-foreground">{steps[4].description}</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border">
              <img src={dashboardMockup} alt="Credits and hiring dashboard" className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;

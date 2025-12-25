import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Code, 
  Palette, 
  BarChart3, 
  Database,
  Clock,
  CheckCircle,
  X,
  SortAsc,
  Plus
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Project {
  id: number;
  company: string;
  companyLogo: string;
  title: string;
  description: string;
  credits: number;
  difficulty: "Easy" | "Medium" | "Hard";
  skills: string[];
  deadline: string;
  category: string;
  icon: React.ReactNode;
  applied?: boolean;
}

const ProjectMarketplace = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "design", label: "Design" },
    { id: "data", label: "Data Science" },
    { id: "mobile", label: "Mobile" },
    { id: "devops", label: "DevOps" },
  ];

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      company: "Spotify",
      companyLogo: "S",
      title: "Market Analysis Dashboard",
      description: "Analyze Gen-Z listening habits in Southeast Asia and propose a new feature recommendation engine.",
      credits: 60,
      difficulty: "Medium",
      skills: ["Python", "Data Analysis", "SQL"],
      deadline: "15 days",
      category: "data",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 2,
      company: "Tesla",
      companyLogo: "T",
      title: "EV Charging UX Redesign",
      description: "Redesign the mobile app charging station finder with improved UX and real-time availability.",
      credits: 85,
      difficulty: "Hard",
      skills: ["Figma", "UX Research", "Prototyping"],
      deadline: "20 days",
      category: "design",
      icon: <Palette className="w-5 h-5" />,
    },
    {
      id: 3,
      company: "Stripe",
      companyLogo: "S",
      title: "Payment API Integration",
      description: "Build a robust payment processing module with webhook handling and error recovery.",
      credits: 90,
      difficulty: "Hard",
      skills: ["Node.js", "REST API", "PostgreSQL"],
      deadline: "25 days",
      category: "backend",
      icon: <Database className="w-5 h-5" />,
    },
    {
      id: 4,
      company: "Airbnb",
      companyLogo: "A",
      title: "React Component Library",
      description: "Create a reusable component library for booking flow with accessibility in mind.",
      credits: 70,
      difficulty: "Medium",
      skills: ["React", "TypeScript", "Storybook"],
      deadline: "18 days",
      category: "frontend",
      icon: <Code className="w-5 h-5" />,
    },
    {
      id: 5,
      company: "Netflix",
      companyLogo: "N",
      title: "Content Recommendation Algorithm",
      description: "Develop a machine learning model to improve content recommendations for new users.",
      credits: 100,
      difficulty: "Hard",
      skills: ["Python", "ML", "TensorFlow"],
      deadline: "30 days",
      category: "data",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 6,
      company: "Google",
      companyLogo: "G",
      title: "Landing Page Optimization",
      description: "Design and implement A/B testing framework for marketing landing pages.",
      credits: 50,
      difficulty: "Easy",
      skills: ["HTML", "CSS", "JavaScript"],
      deadline: "10 days",
      category: "frontend",
      icon: <Code className="w-5 h-5" />,
    },
    {
      id: 7,
      company: "Amazon",
      companyLogo: "A",
      title: "Inventory Management System",
      description: "Build a real-time inventory tracking system with predictive restocking alerts.",
      credits: 80,
      difficulty: "Hard",
      skills: ["Python", "AWS", "DynamoDB"],
      deadline: "22 days",
      category: "backend",
      icon: <Database className="w-5 h-5" />,
    },
    {
      id: 8,
      company: "Meta",
      companyLogo: "M",
      title: "Social Feed Algorithm",
      description: "Optimize content ranking algorithm for better user engagement and relevance.",
      credits: 95,
      difficulty: "Hard",
      skills: ["Python", "ML", "Graph DB"],
      deadline: "28 days",
      category: "data",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 9,
      company: "Uber",
      companyLogo: "U",
      title: "Driver App Redesign",
      description: "Redesign the driver-side app for better navigation and earnings visibility.",
      credits: 75,
      difficulty: "Medium",
      skills: ["Figma", "Mobile UX", "Prototyping"],
      deadline: "16 days",
      category: "design",
      icon: <Palette className="w-5 h-5" />,
    },
    {
      id: 10,
      company: "Microsoft",
      companyLogo: "M",
      title: "VS Code Extension",
      description: "Create a productivity extension for Visual Studio Code with AI assistance.",
      credits: 65,
      difficulty: "Medium",
      skills: ["TypeScript", "Node.js", "VS Code API"],
      deadline: "21 days",
      category: "frontend",
      icon: <Code className="w-5 h-5" />,
    },
  ]);

  // Filter and search logic
  const filteredProjects = projects
    .filter(p => activeFilter === "all" || p.category === activeFilter)
    .filter(p => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(query) ||
        p.company.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.skills.some(s => s.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "credits-high":
          return b.credits - a.credits;
        case "credits-low":
          return a.credits - b.credits;
        case "difficulty":
          const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
          return diffOrder[a.difficulty] - diffOrder[b.difficulty];
        default:
          return parseInt(a.deadline) - parseInt(b.deadline);
      }
    });

  const handleApply = async () => {
    if (!selectedProject) return;
    
    setIsApplying(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProjects(prev => prev.map(p => 
      p.id === selectedProject.id ? { ...p, applied: true } : p
    ));
    
    setIsApplying(false);
    setShowApplyModal(false);
    setSelectedProject(null);
    
    toast.success("Application Submitted!", {
      description: `You've applied to ${selectedProject.title} at ${selectedProject.company}`,
    });
  };

  const openApplyModal = (project: Project) => {
    if (project.applied) {
      toast.info("Already Applied", {
        description: "You've already applied to this project",
      });
      return;
    }
    setSelectedProject(project);
    setShowApplyModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Project Marketplace</h2>
          <p className="text-muted-foreground">Browse real-world projects from top companies</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects, skills, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-secondary rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20 w-72"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 rounded-xl">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="credits-high">Credits (High)</SelectItem>
              <SelectItem value="credits-low">Credits (Low)</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className={`dashboard-card group hover:border-primary/30 transition-all ${project.applied ? "border-success/30 bg-success/5" : ""}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center font-bold">
                    {project.companyLogo}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{project.company}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        project.difficulty === "Easy" ? "bg-success/10 text-success" :
                        project.difficulty === "Medium" ? "bg-warning/10 text-warning" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {project.difficulty}
                      </span>
                      {project.applied && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Applied
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  {project.icon}
                </div>
              </div>

              <h3 className="font-bold text-foreground mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.skills.map((skill) => (
                  <span key={skill} className="status-badge status-badge-muted text-xs">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-primary">{project.credits} Credits</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {project.deadline}
                  </span>
                </div>
                <Button 
                  variant={project.applied ? "outline" : "ghost"}
                  size="sm"
                  className={`gap-1 ${project.applied ? "text-success" : "text-muted-foreground hover:text-primary"}`}
                  onClick={() => openApplyModal(project)}
                  disabled={project.applied}
                >
                  {project.applied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Applied
                    </>
                  ) : (
                    <>
                      Apply <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for Project</DialogTitle>
            <DialogDescription>
              Confirm your application for this project
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center font-bold text-lg">
                  {selectedProject.companyLogo}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{selectedProject.title}</h4>
                  <p className="text-sm text-muted-foreground">{selectedProject.company}</p>
                </div>
              </div>
              
              <div className="space-y-3 p-4 bg-secondary/50 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Credits</span>
                  <span className="font-medium text-primary">{selectedProject.credits}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Difficulty</span>
                  <span className={`font-medium ${
                    selectedProject.difficulty === "Easy" ? "text-success" :
                    selectedProject.difficulty === "Medium" ? "text-warning" :
                    "text-destructive"
                  }`}>{selectedProject.difficulty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deadline</span>
                  <span className="font-medium">{selectedProject.deadline}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                By applying, you commit to completing this project within the deadline. 
                Your profile will be shared with {selectedProject.company}.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowApplyModal(false)} disabled={isApplying}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={isApplying} className="gap-2">
              {isApplying ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Confirm Application
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectMarketplace;

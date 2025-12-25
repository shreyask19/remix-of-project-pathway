import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Code, 
  Palette, 
  BarChart3, 
  Database,
  Briefcase,
  Clock
} from "lucide-react";
import { useState } from "react";

const ProjectMarketplace = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "design", label: "Design" },
    { id: "data", label: "Data Science" },
  ];

  const projects = [
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
  ];

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

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
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 bg-secondary rounded-2xl text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
          <Button variant="outline" className="gap-2 rounded-2xl">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <div key={project.id} className="dashboard-card group hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-foreground text-background flex items-center justify-center font-bold">
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
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
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
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary group-hover:text-primary transition-colors">
                Apply <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectMarketplace;

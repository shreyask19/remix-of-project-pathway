import { Button } from "@/components/ui/button";
import { 
  Award, 
  ExternalLink, 
  Github, 
  Globe, 
  Share2, 
  Download,
  Code,
  Palette,
  Database,
  BarChart3,
  Star
} from "lucide-react";

const Portfolio = () => {
  const profile = {
    name: "Alex Chen",
    title: "Full Stack Developer",
    university: "Stanford University",
    totalCredits: 245,
    projectsCompleted: 8,
    skillScore: 94,
    topSkills: ["React", "Node.js", "Python", "Figma", "PostgreSQL"],
  };

  const projects = [
    {
      id: 1,
      title: "Fintech App Redesign",
      company: "Revolut",
      credits: 75,
      grade: "Excellent",
      skills: ["Figma", "UX Research"],
      icon: <Palette className="w-5 h-5" />,
      completedAt: "Dec 2024",
    },
    {
      id: 2,
      title: "Payment API Integration",
      company: "Stripe",
      credits: 90,
      grade: "Excellent",
      skills: ["Node.js", "REST API"],
      icon: <Database className="w-5 h-5" />,
      completedAt: "Nov 2024",
    },
    {
      id: 3,
      title: "React Component Library",
      company: "Airbnb",
      credits: 70,
      grade: "Satisfied",
      skills: ["React", "TypeScript"],
      icon: <Code className="w-5 h-5" />,
      completedAt: "Oct 2024",
    },
    {
      id: 4,
      title: "Data Analytics Dashboard",
      company: "Spotify",
      credits: 60,
      grade: "Excellent",
      skills: ["Python", "SQL"],
      icon: <BarChart3 className="w-5 h-5" />,
      completedAt: "Sep 2024",
    },
  ];

  const skillsByCategory = [
    { category: "Frontend", skills: ["React", "TypeScript", "Tailwind CSS"], level: 92 },
    { category: "Backend", skills: ["Node.js", "Python", "PostgreSQL"], level: 88 },
    { category: "Design", skills: ["Figma", "UX Research", "Prototyping"], level: 85 },
    { category: "Data", skills: ["SQL", "Python", "Data Analysis"], level: 78 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Portfolio</h2>
          <p className="text-muted-foreground">Showcase your work to potential employers</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <Button className="rounded-2xl gap-2">
            <Share2 className="w-4 h-4" />
            Share Portfolio
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="dashboard-card">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
              AC
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{profile.name}</h3>
              <p className="text-muted-foreground">{profile.title}</p>
              <p className="text-sm text-muted-foreground">{profile.university}</p>
              <div className="flex items-center gap-4 mt-3">
                <Button variant="outline" size="sm" className="rounded-xl gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl gap-2">
                  <Globe className="w-4 h-4" />
                  Website
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:ml-auto grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">{profile.totalCredits}</p>
              <p className="text-sm text-muted-foreground">Total Credits</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{profile.projectsCompleted}</p>
              <p className="text-sm text-muted-foreground">Projects</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-success">{profile.skillScore}%</p>
              <p className="text-sm text-muted-foreground">Skill Score</p>
            </div>
          </div>
        </div>

        {/* Top Skills */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm font-medium text-muted-foreground mb-3">Top Skills</p>
          <div className="flex flex-wrap gap-2">
            {profile.topSkills.map((skill) => (
              <span key={skill} className="px-4 py-2 rounded-2xl bg-primary/10 text-primary text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Breakdown */}
      <div className="dashboard-card">
        <h3 className="font-bold text-foreground mb-4">Skills Breakdown</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {skillsByCategory.map((category) => (
            <div key={category.category}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{category.category}</span>
                <span className="text-sm text-primary font-medium">{category.level}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${category.level}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {category.skills.map((skill) => (
                  <span key={skill} className="text-xs text-muted-foreground">
                    {skill}
                    {category.skills.indexOf(skill) < category.skills.length - 1 && " • "}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Projects */}
      <div>
        <h3 className="font-bold text-foreground mb-4">Completed Projects</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="dashboard-card group hover:border-primary/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  {project.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-foreground">{project.title}</h4>
                      <p className="text-sm text-muted-foreground">{project.company}</p>
                    </div>
                    <span className={`status-badge ${
                      project.grade === "Excellent" 
                        ? "bg-success/10 text-success" 
                        : "bg-primary/10 text-primary"
                    }`}>
                      <Star className="w-3 h-3 mr-1" />
                      {project.grade}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map((skill) => (
                        <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-primary">{project.credits} credits</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{project.completedAt}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4 rounded-xl gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                View Project <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Badge */}
      <div className="dashboard-card bg-primary/5 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">Verified Portfolio</h3>
            <p className="text-sm text-muted-foreground">
              All projects are company-graded and verified by Heuristic. Share with confidence.
            </p>
          </div>
          <Button variant="outline" className="rounded-2xl gap-2">
            <ExternalLink className="w-4 h-4" />
            View Public Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

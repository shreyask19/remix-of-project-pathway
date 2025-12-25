import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  Star, 
  Mail, 
  ExternalLink,
  Award,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { useState } from "react";

const TalentPool = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSkillFilter, setActiveSkillFilter] = useState<string | null>(null);

  const skillFilters = ["All", "Python", "React", "Node.js", "TypeScript", "Data Science", "Machine Learning"];

  const talents = [
    {
      id: 1,
      name: "Elena Rodriguez",
      university: "Stanford University",
      major: "Computer Science",
      graduationYear: 2025,
      credits: 420,
      projectsCompleted: 12,
      avgGrade: "Excellent",
      skillScore: 98,
      skills: ["Python", "Django", "Redis", "PostgreSQL", "AWS"],
      topProject: "Backend API Optimization for High-Traffic Systems",
      available: true,
    },
    {
      id: 2,
      name: "David Chen",
      university: "MIT",
      major: "Software Engineering",
      graduationYear: 2025,
      credits: 385,
      projectsCompleted: 10,
      avgGrade: "Excellent",
      skillScore: 95,
      skills: ["React", "TypeScript", "Node.js", "D3.js"],
      topProject: "Real-time Data Visualization Dashboard",
      available: true,
    },
    {
      id: 3,
      name: "Sarah Johnson",
      university: "UC Berkeley",
      major: "Data Science",
      graduationYear: 2024,
      credits: 350,
      projectsCompleted: 9,
      avgGrade: "Excellent",
      skillScore: 92,
      skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
      topProject: "Predictive Analytics for E-commerce",
      available: false,
    },
    {
      id: 4,
      name: "Marcus Reed",
      university: "Georgia Tech",
      major: "Computer Engineering",
      graduationYear: 2025,
      credits: 320,
      projectsCompleted: 8,
      avgGrade: "Satisfied",
      skillScore: 88,
      skills: ["Node.js", "React", "PostgreSQL", "Docker"],
      topProject: "Microservices Architecture for FinTech App",
      available: true,
    },
    {
      id: 5,
      name: "Lila Rossi",
      university: "Carnegie Mellon",
      major: "Machine Learning",
      graduationYear: 2025,
      credits: 410,
      projectsCompleted: 11,
      avgGrade: "Excellent",
      skillScore: 96,
      skills: ["Python", "PyTorch", "Spark", "AWS", "Data Science"],
      topProject: "NLP-based Sentiment Analysis System",
      available: true,
    },
    {
      id: 6,
      name: "James Wilson",
      university: "Cornell University",
      major: "Information Science",
      graduationYear: 2024,
      credits: 290,
      projectsCompleted: 7,
      avgGrade: "Satisfied",
      skillScore: 84,
      skills: ["JavaScript", "React", "Node.js"],
      topProject: "Full-stack E-commerce Platform",
      available: true,
    },
  ];

  const filteredTalents = talents.filter(talent => {
    const matchesSearch = talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         talent.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         talent.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSkill = !activeSkillFilter || activeSkillFilter === "All" || 
                        talent.skills.some(s => s.toLowerCase() === activeSkillFilter.toLowerCase());
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Talent Pool</h2>
          <p className="text-muted-foreground">Discover high-performing students based on their project work</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, university, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-secondary rounded-2xl text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20 w-80"
            />
          </div>
        </div>
      </div>

      {/* Skill Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {skillFilters.map((skill) => (
          <button
            key={skill}
            onClick={() => setActiveSkillFilter(skill === "All" ? null : skill)}
            className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-colors ${
              (skill === "All" && !activeSkillFilter) || activeSkillFilter === skill
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Talent Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTalents.map((talent) => (
          <div key={talent.id} className="dashboard-card group hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {talent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{talent.name}</h3>
                  <p className="text-sm text-muted-foreground">{talent.university}</p>
                </div>
              </div>
              {talent.available ? (
                <span className="status-badge bg-success/10 text-success">Available</span>
              ) : (
                <span className="status-badge bg-muted text-muted-foreground">Hired</span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 rounded-xl bg-muted/50">
                <p className="text-lg font-bold text-primary">{talent.skillScore}%</p>
                <p className="text-xs text-muted-foreground">Skill Score</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-muted/50">
                <p className="text-lg font-bold text-foreground">{talent.credits}</p>
                <p className="text-xs text-muted-foreground">Credits</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-muted/50">
                <p className="text-lg font-bold text-foreground">{talent.projectsCompleted}</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {talent.skills.slice(0, 4).map((skill) => (
                <span key={skill} className="text-xs px-2 py-1 rounded-xl bg-primary/10 text-primary">
                  {skill}
                </span>
              ))}
              {talent.skills.length > 4 && (
                <span className="text-xs px-2 py-1 rounded-xl bg-secondary text-muted-foreground">
                  +{talent.skills.length - 4}
                </span>
              )}
            </div>

            {/* Top Project */}
            <div className="p-3 rounded-xl bg-muted/50 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-warning" />
                <span className="text-xs font-medium text-foreground">Top Project</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{talent.topProject}</p>
            </div>

            {/* Info */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                {talent.major}
              </span>
              <span>Class of {talent.graduationYear}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-xl gap-2">
                <ExternalLink className="w-4 h-4" />
                Profile
              </Button>
              {talent.available && (
                <Button className="flex-1 rounded-xl gap-2">
                  <Mail className="w-4 h-4" />
                  Contact
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTalents.length === 0 && (
        <div className="dashboard-card text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-foreground mb-2">No talents found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default TalentPool;

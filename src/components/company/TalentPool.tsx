import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Search, 
  Mail, 
  ExternalLink,
  Award,
  GraduationCap,
  Briefcase,
  Star,
  ChevronDown,
  X,
  FileText,
  Code,
  Check
} from "lucide-react";

interface Talent {
  id: number;
  name: string;
  email: string;
  university: string;
  major: string;
  graduationYear: number;
  credits: number;
  projectsCompleted: number;
  avgGrade: string;
  skillScore: number;
  skills: string[];
  topProject: string;
  available: boolean;
  bio?: string;
  projects?: { title: string; company: string; grade: string }[];
}

const TalentPool = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSkillFilter, setActiveSkillFilter] = useState<string | null>(null);
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [contactingId, setContactingId] = useState<number | null>(null);
  const [contactedIds, setContactedIds] = useState<Set<number>>(new Set());

  const skillFilters = ["All", "Python", "React", "Node.js", "TypeScript", "Data Science", "Machine Learning"];

  const talents: Talent[] = [
    {
      id: 1,
      name: "Elena Rodriguez",
      email: "elena.r@stanford.edu",
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
      bio: "Passionate about building scalable systems and optimizing performance. Looking for opportunities in backend development.",
      projects: [
        { title: "Backend API Optimization", company: "TechCorp", grade: "Excellent" },
        { title: "Database Migration Tool", company: "DataFlow", grade: "Excellent" },
      ]
    },
    {
      id: 2,
      name: "David Chen",
      email: "david.c@mit.edu",
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
      bio: "Frontend specialist with a focus on data visualization and interactive interfaces.",
      projects: [
        { title: "Data Visualization Dashboard", company: "Analytics Pro", grade: "Excellent" },
        { title: "Component Library", company: "DesignSys", grade: "Satisfied" },
      ]
    },
    {
      id: 3,
      name: "Sarah Johnson",
      email: "sarah.j@berkeley.edu",
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
      email: "marcus.r@gatech.edu",
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
      email: "lila.r@cmu.edu",
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
      email: "james.w@cornell.edu",
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

  const handleContact = async (talent: Talent) => {
    setContactingId(talent.id);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setContactingId(null);
    setContactedIds(prev => new Set([...prev, talent.id]));
    toast.success(`Message sent to ${talent.name}`, {
      description: `We've notified ${talent.name} about your interest`
    });
  };

  const handleViewProfile = (talent: Talent) => {
    setSelectedTalent(talent);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Talent Pool</h2>
          <p className="text-muted-foreground">Discover high-performing students based on their project work</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, university, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-clean pl-10 w-80"
          />
        </div>
      </div>

      {/* Skill Filters */}
      <div className="flex gap-2 flex-wrap">
        {skillFilters.map((skill) => (
          <button
            key={skill}
            onClick={() => setActiveSkillFilter(skill === "All" ? null : skill)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTalents.map((talent) => (
          <div key={talent.id} className="dashboard-card hover:border-primary/20">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold">
                  {talent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{talent.name}</h3>
                  <p className="text-sm text-muted-foreground">{talent.university}</p>
                </div>
              </div>
              {talent.available ? (
                <span className="status-badge status-badge-success">Available</span>
              ) : (
                <span className="status-badge status-badge-muted">Hired</span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center py-2 rounded-lg bg-secondary">
                <p className="text-lg font-bold text-primary">{talent.skillScore}%</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
              <div className="text-center py-2 rounded-lg bg-secondary">
                <p className="text-lg font-bold text-foreground">{talent.credits}</p>
                <p className="text-xs text-muted-foreground">Credits</p>
              </div>
              <div className="text-center py-2 rounded-lg bg-secondary">
                <p className="text-lg font-bold text-foreground">{talent.projectsCompleted}</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {talent.skills.slice(0, 4).map((skill) => (
                <span key={skill} className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                  {skill}
                </span>
              ))}
              {talent.skills.length > 4 && (
                <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                  +{talent.skills.length - 4}
                </span>
              )}
            </div>

            {/* Top Project */}
            <div className="p-3 rounded-lg bg-secondary/50 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Top Project</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{talent.topProject}</p>
            </div>

            {/* Info */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                {talent.major}
              </span>
              <span>Class of {talent.graduationYear}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 rounded-lg gap-2"
                onClick={() => handleViewProfile(talent)}
              >
                <ExternalLink className="w-4 h-4" />
                Profile
              </Button>
              {talent.available && (
                <Button 
                  className="flex-1 rounded-lg gap-2"
                  onClick={() => handleContact(talent)}
                  disabled={contactingId === talent.id || contactedIds.has(talent.id)}
                >
                  {contactingId === talent.id ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : contactedIds.has(talent.id) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                  {contactedIds.has(talent.id) ? "Contacted" : "Contact"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTalents.length === 0 && (
        <div className="dashboard-card text-center py-12">
          <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">No talents found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Profile Modal */}
      {selectedTalent && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Student Profile</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedTalent(null)} className="rounded-lg">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Modal Content */}
            <div className="p-5 space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                  {selectedTalent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl font-semibold text-foreground">{selectedTalent.name}</h4>
                    {selectedTalent.available ? (
                      <span className="status-badge status-badge-success">Available</span>
                    ) : (
                      <span className="status-badge status-badge-muted">Hired</span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{selectedTalent.university}</p>
                  <p className="text-sm text-muted-foreground">{selectedTalent.major} • Class of {selectedTalent.graduationYear}</p>
                </div>
              </div>

              {/* Bio */}
              {selectedTalent.bio && (
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-2">About</h5>
                  <p className="text-muted-foreground">{selectedTalent.bio}</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                <div className="stat-card text-center">
                  <p className="text-2xl font-bold text-primary">{selectedTalent.skillScore}%</p>
                  <p className="text-xs text-muted-foreground">Skill Score</p>
                </div>
                <div className="stat-card text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedTalent.credits}</p>
                  <p className="text-xs text-muted-foreground">Credits</p>
                </div>
                <div className="stat-card text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedTalent.projectsCompleted}</p>
                  <p className="text-xs text-muted-foreground">Projects</p>
                </div>
                <div className="stat-card text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedTalent.avgGrade}</p>
                  <p className="text-xs text-muted-foreground">Avg Grade</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h5 className="text-sm font-medium text-foreground mb-3">Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedTalent.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              {selectedTalent.projects && (
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-3">Recent Projects</h5>
                  <div className="space-y-3">
                    {selectedTalent.projects.map((project, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <Code className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{project.title}</p>
                            <p className="text-sm text-muted-foreground">{project.company}</p>
                          </div>
                        </div>
                        <span className={`status-badge ${project.grade === 'Excellent' ? 'status-badge-success' : 'status-badge-primary'}`}>
                          <Star className="w-3 h-3 mr-1" />
                          {project.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-card border-t border-border p-5 flex gap-3">
              <Button variant="outline" className="flex-1 rounded-lg gap-2">
                <FileText className="w-4 h-4" />
                Download Resume
              </Button>
              {selectedTalent.available && (
                <Button 
                  className="flex-1 rounded-lg gap-2"
                  onClick={() => {
                    handleContact(selectedTalent);
                    setSelectedTalent(null);
                  }}
                  disabled={contactedIds.has(selectedTalent.id)}
                >
                  <Mail className="w-4 h-4" />
                  {contactedIds.has(selectedTalent.id) ? "Already Contacted" : "Contact Student"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentPool;
import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  ExternalLink, 
  Github, 
  Share2, 
  Download,
  Code,
  Palette,
  Database,
  BarChart3,
  Star,
  CheckCircle,
  Camera,
  Linkedin,
  FolderOpen
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useStudentSubmissions } from "@/hooks/useSubmissions";
import { useStudentBadges } from "@/hooks/useReliabilityBadge";
import ReliabilityBadge from "@/components/shared/ReliabilityBadge";
import { generatePortfolioPDF, downloadPDF, ProjectData, SkillCategory } from "@/lib/pdfGenerator";
import { Progress } from "@/components/ui/progress";

const Portfolio = () => {
  const { profile: authProfile, user } = useAuth();
  const { profile: studentProfile, credits } = useStudentProfile();
  const { submissions, isLoading: submissionsLoading } = useStudentSubmissions();
  const { badges } = useStudentBadges(user?.id);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive completed projects from real submissions (only graded/approved)
  const completedProjects = useMemo((): ProjectData[] => {
    if (!submissions) return [];
    return submissions
      .filter(s => s.status === "graded" || s.status === "approved")
      .map(s => ({
        id: s.id,
        title: s.challenge?.title || "Untitled Project",
        company: "Company",
        companyLogoUrl: undefined, // Will be populated when company data is available
        credits: s.challenge?.credits || 0,
        grade: s.grade && s.grade >= 90 ? "Excellent" : s.grade && s.grade >= 70 ? "Satisfied" : "Needs Improvement",
        skills: [],
        completedAt: s.graded_at ? new Date(s.graded_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "",
        description: s.notes || "",
      }));
  }, [submissions]);

  // Derive skills breakdown from student profile
  const skillsByCategory = useMemo(() => {
    const skills = studentProfile?.existing_skills || [];
    const categories: Record<string, string[]> = {
      Frontend: [],
      Backend: [],
      Design: [],
      Data: [],
    };
    
    const categoryMap: Record<string, string> = {
      "React": "Frontend", "TypeScript": "Frontend", "JavaScript": "Frontend", 
      "Vue.js": "Frontend", "Angular": "Frontend", "HTML": "Frontend", 
      "CSS": "Frontend", "Tailwind CSS": "Frontend", "Next.js": "Frontend",
      "Node.js": "Backend", "Python": "Backend", "Java": "Backend",
      "Django": "Backend", "Flask": "Backend", "Express": "Backend",
      "PostgreSQL": "Backend", "MongoDB": "Backend", "SQL": "Backend",
      "AWS": "Backend", "Docker": "Backend", "Kubernetes": "Backend",
      "Figma": "Design", "UX Research": "Design", "UI Design": "Design",
      "Prototyping": "Design", "Adobe XD": "Design", "Sketch": "Design",
      "Data Analysis": "Data", "Machine Learning": "Data", "TensorFlow": "Data",
      "PyTorch": "Data", "Pandas": "Data", "NumPy": "Data", "R": "Data",
      "Data Science": "Data", "NLP": "Data", "Deep Learning": "Data",
    };
    
    skills.forEach(skill => {
      const category = categoryMap[skill] || "Backend";
      if (categories[category]) {
        categories[category].push(skill);
      }
    });
    
    return Object.entries(categories)
      .filter(([_, skills]) => skills.length > 0)
      .map(([category, skills]) => ({
        category,
        skills,
        level: Math.min(100, 50 + skills.length * 10 + completedProjects.length * 5),
      }));
  }, [studentProfile?.existing_skills, completedProjects.length]);

  const profile = {
    name: authProfile ? `${authProfile.firstName} ${authProfile.lastName}` : "Student",
    title: "Full Stack Developer",
    university: studentProfile?.university_name || "University",
    email: authProfile?.email || "student@university.edu",
    totalCredits: credits || 0,
    projectsCompleted: completedProjects.length,
    skillScore: Math.min(100, 50 + completedProjects.length * 10 + (studentProfile?.existing_skills?.length || 0) * 2),
    topSkills: studentProfile?.existing_skills?.slice(0, 5) || [],
  };

  function getProjectIcon(category?: string) {
    switch (category?.toLowerCase()) {
      case "frontend": return <Code className="w-5 h-5" />;
      case "backend": return <Database className="w-5 h-5" />;
      case "design": return <Palette className="w-5 h-5" />;
      case "data":
      case "ml": return <BarChart3 className="w-5 h-5" />;
      default: return <Code className="w-5 h-5" />;
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large", { description: "Please select an image under 5MB" });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast.success("Profile photo updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      const studentData = {
        name: profile.name,
        title: profile.title,
        university: profile.university,
        email: profile.email,
        totalCredits: profile.totalCredits,
        projectsCompleted: profile.projectsCompleted,
        skillScore: profile.skillScore,
        topSkills: profile.topSkills,
        proEligible: studentProfile?.pro_badge_earned || false,
        reliabilityVouches: badges?.total || 0,
        publicProfileUrl: studentProfile?.public_profile_slug 
          ? `https://heuristic.app/portfolio/${studentProfile.public_profile_slug}`
          : undefined,
      };

      const skillCategories: SkillCategory[] = skillsByCategory;

      const pdfBlob = await generatePortfolioPDF(
        studentData,
        completedProjects,
        skillCategories,
        (progress) => setExportProgress(progress)
      );
      
      downloadPDF(pdfBlob, `${profile.name.replace(/\s+/g, '_')}_Portfolio.pdf`);
      
      toast.success("Portfolio PDF exported!", {
        description: "Professional resume with verification credentials",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error("Export failed", {
        description: "Please try again",
      });
    }
    
    setIsExporting(false);
    setExportProgress(0);
  };

  const handleSharePortfolio = async () => {
    setIsSharing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const shareUrl = `https://heuristic.app/portfolio/${authProfile?.firstName?.toLowerCase() || 'student'}-${Date.now().toString(36)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name}'s Portfolio`,
          text: 'Check out my verified project portfolio on Heuristic',
          url: shareUrl,
        });
        toast.success("Portfolio shared!");
      } catch (err) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Portfolio link copied to clipboard!");
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Portfolio link copied!", {
        description: shareUrl,
      });
    }
    setIsSharing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Portfolio</h2>
          <p className="text-muted-foreground">Showcase your work to potential employers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isExporting && (
              <div className="w-24">
                <Progress value={exportProgress} className="h-2" />
              </div>
            )}
            <Button 
              variant="outline" 
              className="rounded-xl gap-2"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  {exportProgress}%
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export PDF
                </>
              )}
            </Button>
          </div>
          <Button 
            className="rounded-xl gap-2"
            onClick={handleSharePortfolio}
            disabled={isSharing}
          >
            {isSharing ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share Portfolio
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="glass-card">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex items-start gap-4">
            {/* Profile Photo */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile.name.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-foreground">{profile.name}</h3>
                <ReliabilityBadge badges={badges} variant="small" />
              </div>
              <p className="text-muted-foreground">{profile.title}</p>
              <p className="text-sm text-muted-foreground">{profile.university}</p>
              <div className="flex items-center gap-2 mt-3">
                {studentProfile?.github_url ? (
                  <Button variant="outline" size="sm" className="rounded-xl gap-2" asChild>
                    <a href={studentProfile.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="rounded-xl gap-2" disabled>
                    <Github className="w-4 h-4" />
                    GitHub
                  </Button>
                )}
                {studentProfile?.linkedin_url ? (
                  <Button variant="outline" size="sm" className="rounded-xl gap-2" asChild>
                    <a href={studentProfile.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="rounded-xl gap-2" disabled>
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:ml-auto grid grid-cols-3 gap-6 text-center">
            <div className="glass-card-subtle px-6 py-4">
              <p className="text-3xl font-bold text-primary">{profile.totalCredits}</p>
              <p className="text-sm text-muted-foreground">Total Credits</p>
            </div>
            <div className="glass-card-subtle px-6 py-4">
              <p className="text-3xl font-bold text-foreground">{profile.projectsCompleted}</p>
              <p className="text-sm text-muted-foreground">Projects</p>
            </div>
            <div className="glass-card-subtle px-6 py-4">
              <p className="text-3xl font-bold text-success">{profile.skillScore}%</p>
              <p className="text-sm text-muted-foreground">Skill Score</p>
            </div>
          </div>
        </div>

        {/* Top Skills */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <p className="text-sm font-medium text-muted-foreground mb-3">Top Skills</p>
          <div className="flex flex-wrap gap-2">
            {profile.topSkills.length > 0 ? (
              profile.topSkills.map((skill) => (
                <span key={skill} className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No skills added yet. Complete your profile to showcase your skills.</p>
            )}
          </div>
        </div>
      </div>

      {/* Skills Breakdown */}
      {skillsByCategory.length > 0 && (
        <div className="glass-card">
          <h3 className="font-bold text-foreground mb-6">Skills Breakdown</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {skillsByCategory.map((category) => (
              <div key={category.category} className="glass-card-subtle">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-foreground">{category.category}</span>
                  <span className="text-sm text-primary font-bold">{category.level}%</span>
                </div>
                <div className="h-2.5 bg-secondary rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                    style={{ width: `${category.level}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {category.skills.map((skill, i) => (
                    <span key={skill} className="text-xs text-muted-foreground">
                      {skill}{i < category.skills.length - 1 && " • "}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Projects */}
      <div>
        <h3 className="font-bold text-foreground mb-4">Completed Projects</h3>
        
        {submissionsLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="glass-card animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary" />
                  <div className="flex-1">
                    <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                    <div className="h-3 bg-secondary rounded w-1/2 mb-4" />
                    <div className="h-3 bg-secondary rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : completedProjects.length === 0 ? (
          <div className="glass-card text-center py-12">
            <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-7 h-7 text-muted-foreground" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">No completed projects yet</h4>
            <p className="text-muted-foreground max-w-md mx-auto">
              Browse the Marketplace to start working on projects and build your portfolio. 
              Completed projects will appear here.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {completedProjects.map((project) => (
              <div key={project.id} className="glass-card group hover:border-primary/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Code className="w-5 h-5" />
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
                    {project.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-1">{project.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex flex-wrap gap-1">
                        {project.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-primary">{project.credits} credits</span>
                    </div>
                    {project.completedAt && (
                      <p className="text-xs text-muted-foreground mt-2">{project.completedAt}</p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4 rounded-xl gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Project <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verification Badge */}
      <div className="glass-card bg-primary/5 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-foreground">Verified Portfolio</h4>
            <p className="text-sm text-muted-foreground">
              All projects are verified by companies and approved by teachers. 
              Credits are earned through real work.
            </p>
          </div>
          <Button variant="outline" className="rounded-xl gap-2">
            <ExternalLink className="w-4 h-4" />
            View Public Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
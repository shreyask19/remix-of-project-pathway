import { useState, useRef } from "react";
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
  Star,
  CheckCircle,
  Camera,
  Linkedin
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import jsPDF from "jspdf";

const Portfolio = () => {
  const { user, updateUser } = useUser();
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = {
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : "Student",
    title: "Full Stack Developer",
    university: user?.universityName || "University",
    email: user?.email || "student@university.edu",
    totalCredits: 245,
    projectsCompleted: 8,
    skillScore: 94,
    topSkills: user?.existingSkills?.slice(0, 5) || ["React", "Node.js", "Python", "Figma", "PostgreSQL"],
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
      description: "Redesigned mobile banking experience with focus on Gen-Z users"
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
      description: "Built robust payment processing with webhook handling"
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
      description: "Created accessible component library for booking flows"
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
      description: "Analyzed listening patterns for SEA market insights"
    },
  ];

  const skillsByCategory = [
    { category: "Frontend", skills: ["React", "TypeScript", "Tailwind CSS"], level: 92 },
    { category: "Backend", skills: ["Node.js", "Python", "PostgreSQL"], level: 88 },
    { category: "Design", skills: ["Figma", "UX Research", "Prototyping"], level: 85 },
    { category: "Data", skills: ["SQL", "Python", "Data Analysis"], level: 78 },
  ];

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
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Header
      pdf.setFillColor(30, 64, 175); // Primary blue
      pdf.rect(0, 0, pageWidth, 50, 'F');
      
      // Name and title
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(profile.name, 20, 25);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(profile.title, 20, 35);
      pdf.text(profile.university, 20, 42);
      
      // Stats section
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Summary', 20, 65);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      const stats = [
        `Total Credits Earned: ${profile.totalCredits}`,
        `Projects Completed: ${profile.projectsCompleted}`,
        `Skill Score: ${profile.skillScore}%`,
      ];
      
      stats.forEach((stat, i) => {
        pdf.text(stat, 20, 75 + (i * 7));
      });
      
      // Skills section
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Top Skills', 20, 105);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(profile.topSkills.join('  •  '), 20, 115);
      
      // Skills breakdown
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Skills Breakdown', 20, 130);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      skillsByCategory.forEach((cat, i) => {
        const yPos = 140 + (i * 12);
        pdf.text(`${cat.category}: ${cat.level}%`, 20, yPos);
        pdf.text(cat.skills.join(', '), 70, yPos);
      });
      
      // Projects section
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Completed Projects', 20, 195);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      
      projects.forEach((project, i) => {
        const yPos = 205 + (i * 20);
        
        if (yPos > 270) {
          pdf.addPage();
        }
        
        const adjustedY = yPos > 270 ? 20 + (i - 3) * 20 : yPos;
        
        pdf.setFont('helvetica', 'bold');
        pdf.text(project.title, 20, adjustedY);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${project.company} | ${project.credits} Credits | ${project.grade}`, 20, adjustedY + 5);
        pdf.text(`Skills: ${project.skills.join(', ')} | ${project.completedAt}`, 20, adjustedY + 10);
      });
      
      // Footer
      const lastPageHeight = pdf.internal.pageSize.getHeight();
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Generated by Heuristic | Verified Portfolio', pageWidth / 2, lastPageHeight - 10, { align: 'center' });
      pdf.text(new Date().toLocaleDateString(), pageWidth / 2, lastPageHeight - 5, { align: 'center' });
      
      // Save the PDF
      pdf.save(`${profile.name.replace(' ', '_')}_Portfolio.pdf`);
      
      toast.success("Portfolio PDF exported!", {
        description: "Check your downloads folder",
      });
    } catch (error) {
      toast.error("Export failed", {
        description: "Please try again",
      });
    }
    
    setIsExporting(false);
  };

  const handleSharePortfolio = async () => {
    setIsSharing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const shareUrl = `https://heuristic.app/portfolio/${user?.firstName?.toLowerCase() || 'student'}-${Date.now().toString(36)}`;
    
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
          <Button 
            variant="outline" 
            className="rounded-xl gap-2"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export PDF
              </>
            )}
          </Button>
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
              <h3 className="text-xl font-bold text-foreground">{profile.name}</h3>
              <p className="text-muted-foreground">{profile.title}</p>
              <p className="text-sm text-muted-foreground">{profile.university}</p>
              <div className="flex items-center gap-2 mt-3">
                {user?.githubUrl ? (
                  <Button variant="outline" size="sm" className="rounded-xl gap-2" asChild>
                    <a href={user.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="rounded-xl gap-2">
                    <Github className="w-4 h-4" />
                    GitHub
                  </Button>
                )}
                {user?.linkedinUrl ? (
                  <Button variant="outline" size="sm" className="rounded-xl gap-2" asChild>
                    <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="rounded-xl gap-2">
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
            {profile.topSkills.map((skill) => (
              <span key={skill} className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Breakdown */}
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

      {/* Completed Projects */}
      <div>
        <h3 className="font-bold text-foreground mb-4">Completed Projects</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="glass-card group hover:border-primary/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
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
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-1">{project.description}</p>
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
      <div className="glass-card bg-primary/5 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground">Verified Portfolio</h3>
              <CheckCircle className="w-4 h-4 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">
              All projects are company-graded and verified by Heuristic. Share with confidence.
            </p>
          </div>
          <Button variant="outline" className="rounded-xl gap-2" onClick={handleSharePortfolio}>
            <ExternalLink className="w-4 h-4" />
            View Public Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

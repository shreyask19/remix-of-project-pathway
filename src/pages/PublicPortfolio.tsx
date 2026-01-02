import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Award,
  Github,
  Linkedin,
  ExternalLink,
  CheckCircle,
  Copy,
  Share2,
  Code,
  Palette,
  Database,
  BarChart3,
  Star,
  Briefcase,
  GraduationCap,
  Shield,
  QrCode,
  Twitter,
  Download,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import HeuristicLogo from "@/components/HeuristicLogo";

interface PublicStudentData {
  firstName: string;
  lastName: string;
  universityName: string | null;
  universityProgram: string | null;
  existingSkills: string[];
  totalCredits: number;
  industryReadinessScore: number;
  proBadgeEarned: boolean;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
}

interface CompletedProject {
  id: string;
  title: string;
  grade: number | null;
  credits: number;
  difficulty: string;
  category: string | null;
  gradedAt: string | null;
}

const PublicPortfolio = () => {
  const { slug } = useParams<{ slug: string }>();
  const publicUrl = `${window.location.origin}/portfolio/${slug}`;

  // Fetch public student data
  const { data: studentData, isLoading, error } = useQuery({
    queryKey: ["publicPortfolio", slug],
    queryFn: async (): Promise<{ student: PublicStudentData; projects: CompletedProject[] } | null> => {
      if (!slug) return null;

      // Fetch student profile by slug
      const { data: studentProfile, error: studentError } = await supabase
        .from("student_profiles")
        .select(`
          user_id,
          university_name,
          university_program,
          existing_skills,
          total_credits,
          industry_readiness_score,
          pro_badge_earned,
          github_url,
          linkedin_url,
          portfolio_url
        `)
        .eq("public_profile_slug", slug)
        .maybeSingle();

      if (studentError) throw studentError;
      if (!studentProfile) return null;

      // Fetch profile name
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", studentProfile.user_id)
        .maybeSingle();

      // Fetch completed submissions
      const { data: submissions } = await supabase
        .from("submissions")
        .select(`
          id,
          grade,
          graded_at,
          challenge:challenges(
            id,
            title,
            credits,
            difficulty,
            category
          )
        `)
        .eq("student_id", studentProfile.user_id)
        .in("status", ["graded", "approved"])
        .order("graded_at", { ascending: false });

      const projects: CompletedProject[] = (submissions || [])
        .filter(s => s.challenge)
        .map(s => ({
          id: s.id,
          title: s.challenge?.title || "Untitled",
          grade: s.grade,
          credits: s.challenge?.credits || 0,
          difficulty: s.challenge?.difficulty || "Medium",
          category: s.challenge?.category || null,
          gradedAt: s.graded_at,
        }));

      return {
        student: {
          firstName: profile?.first_name || "Student",
          lastName: profile?.last_name || "",
          universityName: studentProfile.university_name,
          universityProgram: studentProfile.university_program,
          existingSkills: studentProfile.existing_skills || [],
          totalCredits: studentProfile.total_credits,
          industryReadinessScore: studentProfile.industry_readiness_score,
          proBadgeEarned: studentProfile.pro_badge_earned,
          githubUrl: studentProfile.github_url,
          linkedinUrl: studentProfile.linkedin_url,
          portfolioUrl: studentProfile.portfolio_url,
        },
        projects,
      };
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(publicUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleLinkedInShare = () => {
    const text = encodeURIComponent(
      `Check out my verified portfolio on Heuristic! 🚀\n\nI've completed ${studentData?.projects.length || 0} real-world projects and earned ${studentData?.student.totalCredits || 0} credits.\n\n#Heuristic #Portfolio #CareerReady`
    );
    const url = encodeURIComponent(publicUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(
      `Check out my verified project portfolio on @HeuristicLabs! 🚀\n\n${studentData?.projects.length || 0} projects completed | ${studentData?.student.totalCredits || 0} credits earned\n\n${publicUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const getGradeLabel = (grade: number | null): string => {
    if (grade === null) return "Pending";
    if (grade >= 90) return "Excellent";
    if (grade >= 75) return "Satisfied";
    if (grade >= 50) return "Average";
    return "Needs Improvement";
  };

  const getGradeColor = (grade: number | null): string => {
    if (grade === null) return "text-muted-foreground";
    if (grade >= 90) return "text-success";
    if (grade >= 75) return "text-primary";
    if (grade >= 50) return "text-warning";
    return "text-destructive";
  };

  const getCategoryIcon = (category: string | null) => {
    switch (category?.toLowerCase()) {
      case "frontend": return <Code className="w-5 h-5" />;
      case "backend": return <Database className="w-5 h-5" />;
      case "design": return <Palette className="w-5 h-5" />;
      case "data": return <BarChart3 className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 70) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Portfolio Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This portfolio doesn't exist or the link may be incorrect.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const { student, projects } = studentData;
  const fullName = `${student.firstName} ${student.lastName}`.trim();

  return (
    <>
      <Helmet>
        <title>{fullName}'s Portfolio | Heuristic</title>
        <meta name="description" content={`${fullName}'s verified project portfolio. ${projects.length} projects completed, ${student.totalCredits} credits earned.`} />
        <meta property="og:title" content={`${fullName}'s Portfolio | Heuristic`} />
        <meta property="og:description" content={`View ${fullName}'s verified project portfolio on Heuristic. ${projects.length} real-world projects completed.`} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={publicUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${fullName}'s Portfolio | Heuristic`} />
        <meta name="twitter:description" content={`${fullName} has completed ${projects.length} verified projects on Heuristic.`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <HeuristicLogo size="sm" />
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopyLink} className="gap-2">
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy Link</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLinkedInShare} className="gap-2">
                <Linkedin className="w-4 h-4" />
                <span className="hidden sm:inline">LinkedIn</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleTwitterShare} className="gap-2">
                <Twitter className="w-4 h-4" />
                <span className="hidden sm:inline">Twitter</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar & Basic Info */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-foreground">{fullName}</h1>
                    {student.proBadgeEarned && (
                      <span className="px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        PRO
                      </span>
                    )}
                  </div>
                  {student.universityProgram && (
                    <p className="text-muted-foreground">{student.universityProgram}</p>
                  )}
                  {student.universityName && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <GraduationCap className="w-4 h-4" />
                      {student.universityName}
                    </p>
                  )}
                  
                  {/* Social Links */}
                  <div className="flex items-center gap-2 mt-3">
                    {student.githubUrl && (
                      <Button variant="outline" size="sm" asChild className="rounded-lg">
                        <a href={student.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {student.linkedinUrl && (
                      <Button variant="outline" size="sm" asChild className="rounded-lg">
                        <a href={student.linkedinUrl} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {student.portfolioUrl && (
                      <Button variant="outline" size="sm" asChild className="rounded-lg">
                        <a href={student.portfolioUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="md:ml-auto grid grid-cols-3 gap-4 text-center">
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-primary">{student.totalCredits}</p>
                  <p className="text-xs text-muted-foreground">Credits</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                  <p className="text-xs text-muted-foreground">Projects</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className={`text-2xl font-bold ${getScoreColor(student.industryReadinessScore)}`}>
                    {student.industryReadinessScore}
                  </p>
                  <p className="text-xs text-muted-foreground">Readiness</p>
                </div>
              </div>
            </div>

            {/* Verified Badge */}
            <div className="mt-6 pt-6 border-t border-border flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                <Shield className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Verified by Heuristic</span>
              </div>
              <p className="text-xs text-muted-foreground">
                All projects and grades are verified and tamper-proof
              </p>
            </div>
          </motion.div>

          {/* Skills */}
          {student.existingSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 mb-8"
            >
              <h2 className="text-lg font-bold text-foreground mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {student.existingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-bold text-foreground mb-4">Completed Projects</h2>
            
            {projects.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No completed projects yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        {getCategoryIcon(project.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{project.title}</h3>
                          <span className={`text-sm font-medium ${getGradeColor(project.grade)}`}>
                            {getGradeLabel(project.grade)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            project.difficulty === "Easy" ? "bg-success/10 text-success" :
                            project.difficulty === "Medium" ? "bg-warning/10 text-warning" :
                            "bg-destructive/10 text-destructive"
                          }`}>
                            {project.difficulty}
                          </span>
                          <span className="text-primary font-medium">{project.credits} credits</span>
                          {project.gradedAt && (
                            <span>
                              {new Date(project.gradedAt).toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-16 py-8">
          <div className="container mx-auto px-4 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <HeuristicLogo size="sm" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Build real projects. Earn verified credentials. Get hired.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default PublicPortfolio;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import HeuristicLogo from "@/components/HeuristicLogo";
import { GraduationCap, BookOpen, Building2, Loader2, ArrowLeft, CheckCircle, Sparkles, ArrowRight } from "lucide-react";

type AppRole = "student" | "teacher" | "company";

interface RoleOption {
  id: AppRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
}

const roles: RoleOption[] = [
  {
    id: "student",
    title: "Student",
    description: "Build real projects, earn credits, skip exams, and get hired by top companies",
    icon: <GraduationCap className="w-8 h-8" />,
    benefits: [
      "Work on real company projects",
      "Earn credits toward exam exemption",
      "Build a verified portfolio",
      "Get hired before graduation",
    ],
  },
  {
    id: "teacher",
    title: "Teacher / Faculty",
    description: "Monitor student progress, approve assessments, and manage academic controls",
    icon: <BookOpen className="w-8 h-8" />,
    benefits: [
      "Track student performance in real-time",
      "Approve/reject exam exemptions",
      "View analytics and insights",
      "Manage academic policies",
    ],
  },
  {
    id: "company",
    title: "Company / Employer",
    description: "Post projects, evaluate talent, and hire the best students directly",
    icon: <Building2 className="w-8 h-8" />,
    benefits: [
      "Post real project challenges",
      "Evaluate student submissions",
      "Build a hiring pipeline",
      "Hire verified, skilled talent",
    ],
  },
];

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, role, isOnboarded, setRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Already has a role - redirect appropriately
    if (role) {
      if (!isOnboarded) {
        const onboardingRoutes = {
          student: "/student/onboarding",
          teacher: "/teacher/onboarding",
          company: "/company/onboarding",
        };
        navigate(onboardingRoutes[role]);
      } else {
        const dashboardRoutes = {
          student: "/student",
          teacher: "/teacher",
          company: "/company",
        };
        navigate(dashboardRoutes[role]);
      }
    }
  }, [user, role, isOnboarded, navigate]);

  const handleContinue = async () => {
    if (!selectedRole) return;

    setIsSubmitting(true);

    try {
      const { error } = await setRole(selectedRole);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to set your role. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Navigate to onboarding
      const onboardingRoutes = {
        student: "/student/onboarding",
        teacher: "/teacher/onboarding",
        company: "/company/onboarding",
      };
      navigate(onboardingRoutes[selectedRole]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <HeuristicLogo size="lg" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Welcome to Heuristic</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-4">
            How will you use Heuristic?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your role to get started with a personalized onboarding experience
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {roles.map((roleOption, index) => (
            <motion.button
              key={roleOption.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => setSelectedRole(roleOption.id)}
              className={`relative p-8 rounded-2xl text-left transition-all duration-300 group ${
                selectedRole === roleOption.id
                  ? "bg-primary/5 border-2 border-primary/30 scale-[1.02] shadow-xl"
                  : "bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
              }`}
            >
              {/* Selected indicator */}
              {selectedRole === roleOption.id && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                selectedRole === roleOption.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
              }`}>
                {roleOption.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-2">{roleOption.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">{roleOption.description}</p>

              {/* Benefits */}
              <ul className="space-y-2">
                {roleOption.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      selectedRole === roleOption.id ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.button>
          ))}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedRole || isSubmitting}
            className="h-14 px-10 text-lg font-semibold rounded-xl gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <button 
              onClick={() => navigate("/auth")}
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;

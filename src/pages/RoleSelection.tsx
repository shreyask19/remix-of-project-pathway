import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Building2, 
  BookOpen, 
  ArrowRight,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import HeuristicLogo from "@/components/HeuristicLogo";

const RoleSelection = () => {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | "company" | null>(null);

  const roles = [
    {
      id: "student" as const,
      title: "Student",
      description: "Build real projects, earn credits, skip exams, and get hired by top companies",
      icon: <GraduationCap className="w-8 h-8" />,
      benefits: [
        "Work on real company projects",
        "Earn credits toward exam exemption",
        "Build a verified portfolio",
        "Get hired before graduation"
      ],
    },
    {
      id: "teacher" as const,
      title: "Teacher / Faculty",
      description: "Monitor student progress, approve assessments, and manage academic controls",
      icon: <BookOpen className="w-8 h-8" />,
      benefits: [
        "Track student performance in real-time",
        "Approve/reject exam exemptions",
        "View analytics and insights",
        "Manage academic policies"
      ],
    },
    {
      id: "company" as const,
      title: "Company / Employer",
      description: "Post projects, evaluate talent, and hire the best students directly",
      icon: <Building2 className="w-8 h-8" />,
      benefits: [
        "Post real project challenges",
        "Evaluate student submissions",
        "Build a hiring pipeline",
        "Hire verified, skilled talent"
      ],
    }
  ];

  const handleContinue = () => {
    if (selectedRole) {
      updateUser({ role: selectedRole });
      navigate(`/${selectedRole}/onboarding`);
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
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
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
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {roles.map((role, index) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`relative p-8 rounded-2xl text-left transition-all duration-300 animate-fade-in-up group ${
                selectedRole === role.id
                  ? "bg-primary/5 border-2 border-primary/30 scale-[1.02] shadow-xl"
                  : "bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Selected indicator */}
              {selectedRole === role.id && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="w-6 h-6 text-primary animate-scale-in" />
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                selectedRole === role.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
              }`}>
                {role.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-2">{role.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">{role.description}</p>

              {/* Benefits */}
              <ul className="space-y-2">
                {role.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      selectedRole === role.id ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center animate-fade-in-up animation-delay-400">
          <Button
            size="lg"
            disabled={!selectedRole}
            onClick={handleContinue}
            className="h-14 px-10 text-lg font-semibold rounded-xl gap-2 transition-all disabled:opacity-50"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <button className="text-primary font-medium hover:underline">
              Sign in
            </button>
          </p>
        </div>

        {/* Portal Links */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground mb-4">
            Quick access to portals
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/student")}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <GraduationCap className="w-4 h-4" />
              Student Portal
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/teacher")}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <BookOpen className="w-4 h-4" />
              Teacher Portal
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/company")}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <Building2 className="w-4 h-4" />
              Company Portal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
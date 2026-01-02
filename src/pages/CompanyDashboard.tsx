import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import HeuristicLogo from "@/components/HeuristicLogo";
import NotificationDropdown from "@/components/NotificationDropdown";
import CompanyOverview from "@/components/company/CompanyOverview";
import ProjectCreation from "@/components/company/ProjectCreation";
import SubmissionReview from "@/components/company/SubmissionReview";
import HiringPipeline from "@/components/company/HiringPipeline";
import TalentPool from "@/components/company/TalentPool";
import CompanyProfile from "@/components/company/CompanyProfile";
import { useCompanySubmissions } from "@/hooks/useSubmissions";
import { useCompanyActivity } from "@/hooks/useCompanyActivity";
import {
  LayoutDashboard,
  Briefcase,
  Eye,
  GitBranch,
  Users,
  Settings,
  Building2,
  Plus,
  LogOut
} from "lucide-react";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const { stats } = useCompanySubmissions();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Enable realtime updates - this hook subscribes to submission/pipeline/invitation changes
  useCompanyActivity();

  const companyName = profile?.firstName || "Company";
  const userInitials = profile?.firstName && profile?.lastName 
    ? `${profile.firstName[0]}${profile.lastName[0]}`
    : "CO";

  const sidebarSections = [
    {
      items: [
        { label: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, id: "overview" },
        { label: "Challenges", icon: <Briefcase className="w-5 h-5" />, id: "challenges" },
        { label: "Submissions", icon: <Eye className="w-5 h-5" />, id: "submissions", badge: stats.new },
        { label: "Pipeline", icon: <GitBranch className="w-5 h-5" />, id: "pipeline" },
        { label: "Talent Pool", icon: <Users className="w-5 h-5" />, id: "talent" },
      ],
    },
    {
      items: [
        { label: "Company Profile", icon: <Building2 className="w-5 h-5" />, id: "profile" },
        { label: "Settings", icon: <Settings className="w-5 h-5" />, id: "settings" },
      ],
    },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "challenges":
        return <ProjectCreation />;
      case "submissions":
        return <SubmissionReview />;
      case "pipeline":
        return <HiringPipeline />;
      case "talent":
        return <TalentPool />;
      case "profile":
        return <CompanyProfile />;
      default:
        return <CompanyOverview />;
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "challenges":
        return "Project Challenges";
      case "submissions":
        return "Submission Review";
      case "pipeline":
        return "Hiring Pipeline";
      case "talent":
        return "Talent Pool";
      case "profile":
        return "Company Profile";
      default:
        return `Welcome, ${companyName}`;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
        <div className="p-5 border-b border-border">
          <button onClick={() => navigate("/")} className="block">
            <HeuristicLogo size="md" />
          </button>
          <p className="text-xs text-muted-foreground mt-1 ml-[52px]">Company Portal</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {sidebarSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full sidebar-nav-item ${
                        activeTab === item.id ? "sidebar-nav-item-active" : "sidebar-nav-item-inactive"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">Company Admin</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">{getHeaderTitle()}</h1>
            {activeTab === "overview" && (
              <p className="text-sm text-muted-foreground">Here's what's happening with your challenges today</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <NotificationDropdown role="company" />
            {activeTab === "challenges" && (
              <Button className="gap-2 rounded-lg">
                <Plus className="w-4 h-4" />
                Create Challenge
              </Button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-secondary/30">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;

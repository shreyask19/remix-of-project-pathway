import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import CompanyOverview from "@/components/company/CompanyOverview";
import ProjectCreation from "@/components/company/ProjectCreation";
import SubmissionReview from "@/components/company/SubmissionReview";
import HiringPipeline from "@/components/company/HiringPipeline";
import TalentPool from "@/components/company/TalentPool";
import {
  LayoutDashboard,
  Briefcase,
  Eye,
  GitBranch,
  Users,
  Settings,
  Building2,
  Plus,
  Bell,
  LogOut
} from "lucide-react";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser, setIsOnboarded } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  const companyName = user?.companyName || user?.firstName || "Company";
  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : "CO";

  const sidebarSections = [
    {
      items: [
        { label: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, id: "overview" },
        { label: "Challenges", icon: <Briefcase className="w-5 h-5" />, id: "challenges" },
        { label: "Submissions", icon: <Eye className="w-5 h-5" />, id: "submissions", badge: 8 },
        { label: "Pipeline", icon: <GitBranch className="w-5 h-5" />, id: "pipeline" },
        { label: "Talent Pool", icon: <Users className="w-5 h-5" />, id: "talent" },
      ],
    },
    {
      items: [
        { label: "Settings", icon: <Settings className="w-5 h-5" />, id: "settings" },
      ],
    },
  ];

  const handleLogout = () => {
    setUser(null);
    setIsOnboarded(false);
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
      default:
        return `Welcome, ${companyName}`;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-purple-500/5">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-card/80 backdrop-blur-xl border-r border-border flex flex-col">
        <div className="p-5 border-b border-border/50">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold font-display text-foreground">Heuristic</h1>
              <p className="text-xs text-muted-foreground">Company Portal</p>
            </div>
          </a>
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
                        activeTab === item.id 
                          ? "bg-purple-500/10 text-purple-600" 
                          : "sidebar-nav-item-inactive"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-medium">
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

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.companyName || "Company"}</p>
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
        <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">{getHeaderTitle()}</h1>
            {activeTab === "overview" && (
              <p className="text-sm text-muted-foreground">Here's what's happening with your challenges today</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative rounded-xl">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            {activeTab === "challenges" && (
              <Button className="gap-2 rounded-2xl bg-purple-500 hover:bg-purple-600">
                <Plus className="w-4 h-4" />
                Create Challenge
              </Button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;

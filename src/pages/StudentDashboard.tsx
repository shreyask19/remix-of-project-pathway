import StudentOverview from "@/components/student/StudentOverview";
import ActiveProject from "@/components/student/ActiveProject";
import ProjectMarketplace from "@/components/student/ProjectMarketplace";
import SubmissionFlow from "@/components/student/SubmissionFlow";
import HiringSection from "@/components/student/HiringSection";
import Portfolio from "@/components/student/Portfolio";
import HeuristicLogo from "@/components/HeuristicLogo";
import { useUser } from "@/contexts/UserContext";
import { 
  LayoutDashboard, 
  Briefcase, 
  Award, 
  Upload,
  Building2,
  FolderOpen,
  Settings,
  Bell,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser, setIsOnboarded } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  const userName = user?.firstName || "Student";
  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : "ST";

  const sidebarSections = [
    {
      items: [
        { label: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, id: "overview" },
        { label: "Projects", icon: <Briefcase className="w-5 h-5" />, id: "projects" },
        { label: "Submissions", icon: <Upload className="w-5 h-5" />, id: "submissions" },
        { label: "Credits", icon: <Award className="w-5 h-5" />, id: "credits" },
        { label: "Hiring", icon: <Building2 className="w-5 h-5" />, id: "hiring", badge: 3 },
        { label: "Portfolio", icon: <FolderOpen className="w-5 h-5" />, id: "portfolio" },
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
      case "projects":
        return <ProjectMarketplace />;
      case "submissions":
        return <SubmissionFlow />;
      case "hiring":
        return <HiringSection />;
      case "portfolio":
        return <Portfolio />;
      default:
        return (
          <div className="space-y-6">
            <StudentOverview />
            <ActiveProject />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
        <div className="p-5 border-b border-border">
          <a href="/">
            <HeuristicLogo size="md" />
          </a>
          <p className="text-xs text-muted-foreground mt-1 ml-[52px]">Student Portal</p>
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
                      {item.badge && (
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
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "student@university.edu"}</p>
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
            <h1 className="text-lg font-semibold text-foreground">
              {activeTab === "overview" ? `Welcome back, ${userName}` : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            {activeTab === "overview" && (
              <p className="text-sm text-muted-foreground">Track your progress and build your future</p>
            )}
          </div>
          <Button variant="ghost" size="icon" className="relative rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-secondary/30">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
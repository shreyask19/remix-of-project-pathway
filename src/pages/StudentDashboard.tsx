import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StudentOverview from "@/components/student/StudentOverview";
import ActiveProject from "@/components/student/ActiveProject";
import ProjectMarketplace from "@/components/student/ProjectMarketplace";
import SubmissionFlow from "@/components/student/SubmissionFlow";
import HiringSection from "@/components/student/HiringSection";
import Portfolio from "@/components/student/Portfolio";
import { 
  LayoutDashboard, 
  Briefcase, 
  Award, 
  Upload,
  Building2,
  FolderOpen,
  Settings
} from "lucide-react";
import { useState } from "react";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const sidebarSections = [
    {
      items: [
        { label: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, id: "overview" },
        { label: "Projects", icon: <Briefcase className="w-5 h-5" />, id: "projects" },
        { label: "Submissions", icon: <Upload className="w-5 h-5" />, id: "submissions" },
        { label: "Credits", icon: <Award className="w-5 h-5" />, id: "credits" },
        { label: "Hiring", icon: <Building2 className="w-5 h-5" />, id: "hiring" },
        { label: "Portfolio", icon: <FolderOpen className="w-5 h-5" />, id: "portfolio" },
      ],
    },
    {
      items: [
        { label: "Settings", icon: <Settings className="w-5 h-5" />, id: "settings" },
      ],
    },
  ];

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
    <div className="flex h-screen bg-secondary/30">
      <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
        <div className="p-5 border-b border-border">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
              <Award className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold font-display text-foreground">Heuristic</h1>
              <p className="text-xs text-muted-foreground">Student Portal</p>
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
                        activeTab === item.id ? "sidebar-nav-item-active" : "sidebar-nav-item-inactive"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              AC
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Alex Chen</p>
              <p className="text-xs text-muted-foreground">alex@stanford.edu</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title={activeTab === "overview" ? "Welcome back, Alex" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
          subtitle={activeTab === "overview" ? "Track your progress and build your future" : undefined}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;

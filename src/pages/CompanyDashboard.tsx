import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CompanyOverview from "@/components/company/CompanyOverview";
import ProjectCreation from "@/components/company/ProjectCreation";
import SubmissionReview from "@/components/company/SubmissionReview";
import HiringPipeline from "@/components/company/HiringPipeline";
import TalentPool from "@/components/company/TalentPool";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Briefcase,
  Eye,
  GitBranch,
  Users,
  Settings,
  Award,
  Plus,
  Bell,
  MessageSquare
} from "lucide-react";
import { useState } from "react";

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

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
        return "Good morning, Acme Corp";
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
                        activeTab === item.id ? "sidebar-nav-item-active" : "sidebar-nav-item-inactive"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              AC
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Alex Morgan</p>
              <p className="text-xs text-muted-foreground">Acme Corp</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Custom Header */}
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
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
            <Button variant="ghost" size="icon" className="rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </Button>
            {activeTab === "challenges" && (
              <Button className="gap-2 rounded-2xl">
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

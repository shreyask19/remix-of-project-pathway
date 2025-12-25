import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import HeuristicLogo from "@/components/HeuristicLogo";
import NotificationDropdown from "@/components/NotificationDropdown";
import ClassOverview from "@/components/teacher/ClassOverview";
import StudentProgress from "@/components/teacher/StudentProgress";
import AssessmentApproval from "@/components/teacher/AssessmentApproval";
import AlertsSection from "@/components/teacher/AlertsSection";
import AcademicControl from "@/components/teacher/AcademicControl";
import TeacherAnalytics from "@/components/teacher/TeacherAnalytics";
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Bell,
  Settings,
  BarChart3,
  LogOut
} from "lucide-react";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser, setIsOnboarded } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  const userName = user?.firstName || "Professor";
  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : "PR";

  const sidebarSections = [
    {
      title: "MAIN MENU",
      items: [
        { label: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, id: "overview" },
        { label: "Students", icon: <Users className="w-5 h-5" />, id: "students" },
        { label: "Analytics", icon: <BarChart3 className="w-5 h-5" />, id: "analytics" },
        { label: "Approvals", icon: <CheckSquare className="w-5 h-5" />, id: "approvals", badge: 11 },
        { label: "Alerts", icon: <Bell className="w-5 h-5" />, id: "alerts", badge: 6 },
      ],
    },
    {
      title: "SETTINGS",
      items: [
        { label: "Academic Control", icon: <Settings className="w-5 h-5" />, id: "settings" },
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
      case "students":
        return <StudentProgress />;
      case "analytics":
        return <TeacherAnalytics />;
      case "approvals":
        return <AssessmentApproval />;
      case "alerts":
        return <AlertsSection />;
      case "settings":
        return <AcademicControl />;
      default:
        return <ClassOverview />;
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "students":
        return "Student Progress";
      case "analytics":
        return "Analytics & Insights";
      case "approvals":
        return "Assessment Approvals";
      case "alerts":
        return "Alerts & Notifications";
      case "settings":
        return "Academic Control";
      default:
        return `Welcome back, ${userName}`;
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
          <p className="text-xs text-muted-foreground mt-1 ml-[52px]">Educator Portal</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {sidebarSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              {section.title && (
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-3">
                  {section.title}
                </p>
              )}
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
              <p className="text-xs text-muted-foreground truncate">{user?.department || "Department"}</p>
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
              <p className="text-sm text-muted-foreground">Here's what's happening with your students today</p>
            )}
          </div>
          <NotificationDropdown role="teacher" />
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-secondary/30">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
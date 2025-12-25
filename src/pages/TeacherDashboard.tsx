import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ClassOverview from "@/components/teacher/ClassOverview";
import StudentProgress from "@/components/teacher/StudentProgress";
import AssessmentApproval from "@/components/teacher/AssessmentApproval";
import AlertsSection from "@/components/teacher/AlertsSection";
import AcademicControl from "@/components/teacher/AcademicControl";
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Bell,
  Settings,
  Award
} from "lucide-react";
import { useState } from "react";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const sidebarSections = [
    {
      title: "MAIN MENU",
      items: [
        { label: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, id: "overview" },
        { label: "Students", icon: <Users className="w-5 h-5" />, id: "students" },
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

  const renderContent = () => {
    switch (activeTab) {
      case "students":
        return <StudentProgress />;
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
      case "approvals":
        return "Assessment Approvals";
      case "alerts":
        return "Alerts & Notifications";
      case "settings":
        return "Academic Control";
      default:
        return "Welcome back, Prof. Elena";
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
              <p className="text-xs text-muted-foreground">Educator Portal</p>
            </div>
          </a>
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
              ER
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Prof. Elena R.</p>
              <p className="text-xs text-muted-foreground">Design Department</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title={getHeaderTitle()} 
          subtitle={activeTab === "overview" ? "Here's what's happening with your students today" : undefined}
          showSearch={activeTab === "students"}
          searchPlaceholder="Search students..."
        />

        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;

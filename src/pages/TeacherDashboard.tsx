import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  Settings,
  HelpCircle,
  GraduationCap,
  TrendingUp,
  FileCheck,
  BarChart3,
  Building2,
  Filter,
  Plus,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  MessageCircle,
} from "lucide-react";

const TeacherDashboard = () => {
  const sidebarSections = [
    {
      title: "MAIN MENU",
      items: [
        { label: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, href: "/teacher" },
        { label: "Students", icon: <Users className="w-5 h-5" />, href: "/teacher/students" },
        { label: "Projects", icon: <Briefcase className="w-5 h-5" />, href: "/teacher/projects" },
        { label: "Grading", icon: <CheckSquare className="w-5 h-5" />, href: "/teacher/grading", badge: 12 },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/teacher/settings" },
        { label: "Support", icon: <HelpCircle className="w-5 h-5" />, href: "/teacher/support" },
      ],
    },
  ];

  const stats = [
    {
      label: "Active Projects",
      value: "24",
      badge: "↗ +12%",
      badgeColor: "text-success",
      icon: <TrendingUp className="w-5 h-5" />,
      iconBg: "bg-primary/10 text-primary",
    },
    {
      label: "Pending Approvals",
      value: "12",
      icon: <FileCheck className="w-5 h-5" />,
      iconBg: "bg-success/10 text-success",
    },
    {
      label: "Avg Class Score",
      value: "85%",
      badge: "↗ +5%",
      badgeColor: "text-success",
      icon: <BarChart3 className="w-5 h-5" />,
      iconBg: "bg-primary/10 text-primary",
    },
    {
      label: "Company Partners",
      value: "7",
      icon: <Building2 className="w-5 h-5" />,
      iconBg: "bg-muted text-foreground",
    },
  ];

  const students = [
    {
      name: "Alex Chen",
      project: "Tesla UX Redesign",
      partner: "Tesla",
      partnerColor: "bg-foreground",
      status: "In Progress",
      statusColor: "bg-primary/10 text-primary",
      progress: 80,
    },
    {
      name: "Sarah Jones",
      project: "Marketing Strategy",
      partner: "Spotify",
      partnerColor: "bg-success",
      status: "Awaiting Approval",
      statusColor: "bg-warning/10 text-warning",
      progress: 100,
      showReview: true,
    },
    {
      name: "Marcus Reed",
      project: "Backend Architecture",
      partner: "Google",
      partnerColor: "bg-muted-foreground",
      status: "Submitted",
      statusColor: "bg-muted text-muted-foreground",
      progress: null,
      pending: true,
    },
    {
      name: "Lila Rossi",
      project: "Brand Identity",
      partner: "Airbnb",
      partnerColor: "bg-destructive",
      status: "In Progress",
      statusColor: "bg-primary/10 text-primary",
      progress: 45,
    },
  ];

  const attentionItems = [
    {
      type: "student",
      name: "Sarah Jones",
      subtitle: "Marketing Strategy",
      grade: "Grade A from Mentor",
      description: '"Excellent strategic thinking and customer acquisition plan. Highly imp...',
      showActions: true,
    },
    {
      type: "blocked",
      title: "Project Blocked",
      description: "Marcus Reed is blocked on Google Maps.",
    },
  ];

  const partnerFeedback = [
    { name: "Tesla Design Team", message: "Updated project requir...", color: "bg-foreground" },
    { name: "Spotify Data Lead", message: "3 new datasets availab...", color: "bg-success" },
  ];

  return (
    <div className="flex h-screen bg-muted/30">
      <DashboardSidebar
        logo={<GraduationCap className="w-5 h-5" />}
        title="EduPro"
        subtitle=""
        sections={sidebarSections}
        footer={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Prof. Elena R.</p>
              <p className="text-xs text-muted-foreground">Design Dept.</p>
            </div>
          </div>
        }
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="Dashboard"
          subtitle="Welcome back, here's what's happening today."
          showSearch
          searchPlaceholder="Search students, projects..."
        />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                  {stat.badge && (
                    <span className={`text-xs font-medium ${stat.badgeColor}`}>{stat.badge}</span>
                  )}
                  {stat.label === "Company Partners" && (
                    <div className="flex -space-x-1">
                      {["G", "T", "S"].map((letter, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-muted border border-background flex items-center justify-center text-xs font-medium">
                          {letter}
                        </div>
                      ))}
                      <div className="w-6 h-6 rounded-full bg-muted border border-background flex items-center justify-center text-xs">+4</div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Student Progress Table */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Student Progress</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Assignment
                  </Button>
                </div>
              </div>

              <div className="dashboard-card">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="pb-4 font-medium">Student</th>
                      <th className="pb-4 font-medium">Project</th>
                      <th className="pb-4 font-medium">Partner</th>
                      <th className="pb-4 font-medium">Status</th>
                      <th className="pb-4 font-medium">Progress</th>
                      <th className="pb-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {students.map((student, idx) => (
                      <tr key={idx}>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted" />
                            <span className="font-medium text-foreground">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">{student.project}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full ${student.partnerColor} flex items-center justify-center text-xs text-primary-foreground font-bold`}>
                              {student.partner[0]}
                            </div>
                            <span className="text-sm text-muted-foreground">{student.partner}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`status-badge ${student.statusColor}`}>{student.status}</span>
                        </td>
                        <td className="py-4">
                          {student.progress !== null ? (
                            <div className="flex items-center gap-2">
                              <Progress value={student.progress} className="w-16 h-1.5" />
                              <span className="text-xs text-muted-foreground">{student.progress}%</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">• Pending</span>
                          )}
                        </td>
                        <td className="py-4">
                          {student.showReview && (
                            <Button size="sm" className="h-7 text-xs">Review</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                  <span className="text-xs text-muted-foreground">Showing 4 of 24 students</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="w-7 h-7">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-7 h-7">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Needs Attention */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <h2 className="font-semibold text-foreground">Needs Attention</h2>
                </div>

                <div className="dashboard-card space-y-4">
                  {/* Sarah Jones card */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">Sarah Jones</p>
                      <p className="text-xs text-muted-foreground">Marketing Strategy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="font-medium text-foreground">Grade A from Mentor</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    "Excellent strategic thinking and customer acquisition plan. Highly imp...
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">Dispute</Button>
                    <Button size="sm" className="flex-1">Approve</Button>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-destructive" />
                      <span className="font-medium text-foreground">Project Blocked</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Marcus Reed is blocked on Google Maps.
                    </p>
                  </div>

                  <button className="text-sm text-primary font-medium hover:underline">
                    View All Notifications
                  </button>
                </div>
              </div>

              {/* Active Partner Feedback */}
              <div>
                <h2 className="font-semibold text-foreground mb-4">Active Partner Feedback</h2>
                <div className="dashboard-card space-y-3">
                  {partnerFeedback.map((partner, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${partner.color} flex items-center justify-center text-xs text-primary-foreground font-bold`}>
                        {partner.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{partner.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{partner.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;

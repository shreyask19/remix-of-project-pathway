import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Briefcase, 
  Award, 
  Users, 
  Settings,
  TrendingUp,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  BarChart3,
  CheckCircle,
  MessageSquare
} from "lucide-react";
import fintechMockup from "@/assets/fintech-app-mockup.png";

const StudentDashboard = () => {
  const sidebarSections = [
    {
      items: [
        { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/student" },
        { label: "Projects", icon: <Briefcase className="w-5 h-5" />, href: "/student/projects" },
        { label: "Credits", icon: <Award className="w-5 h-5" />, href: "/student/credits" },
        { label: "Mentors", icon: <Users className="w-5 h-5" />, href: "/student/mentors" },
        { label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/student/settings" },
      ],
    },
  ];

  const stats = [
    {
      label: "Total Credits",
      value: "120",
      subValue: "/150",
      progress: 80,
      badge: "80% Goal",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      label: "Projects Completed",
      value: "12",
      badge: "↑ +2",
      badgeColor: "text-primary",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      label: "Skill Score",
      value: "94%",
      badge: "Top 5%",
      badgeColor: "text-warning",
      icon: <Star className="w-5 h-5" />,
    },
  ];

  const recommendedProjects = [
    {
      title: "Market Analysis for Spotify",
      description: "Analyze Gen-Z listening habits in Southeast Asia and propose a new...",
      credits: 40,
      category: "MARKETING",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      title: "Supply Chain Optimization",
      description: "Optimize last-mile delivery routes for Nike's direct-to-consumer channel i...",
      credits: 65,
      category: "OPERATIONS",
      icon: <Check className="w-5 h-5" />,
    },
  ];

  const recentActivity = [
    {
      title: "Project Submitted",
      subtitle: "E-commerce Backend API",
      time: "2 hours ago",
      icon: <CheckCircle className="w-4 h-4" />,
      iconBg: "bg-success text-success-foreground",
    },
    {
      title: "New Feedback",
      subtitle: "From Mentor Sarah Jenkins",
      time: "Yesterday",
      icon: <MessageSquare className="w-4 h-4" />,
      iconBg: "bg-primary text-primary-foreground",
    },
  ];

  return (
    <div className="flex h-screen bg-secondary/30">
      <DashboardSidebar
        title="Heuristic"
        subtitle="Student Portal"
        sections={sidebarSections}
        footer={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary" />
            <div>
              <p className="text-sm font-medium text-foreground">Alex Chen</p>
              <p className="text-xs text-muted-foreground">alex@university.edu</p>
            </div>
          </div>
        }
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Welcome back, Alex" subtitle="Level 3 - Junior Developer" />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <span className={`text-xs font-medium ${stat.badgeColor || "text-muted-foreground"}`}>
                    {stat.badge}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                  {stat.subValue && <span className="text-muted-foreground font-normal">{stat.subValue}</span>}
                </p>
                {stat.progress && (
                  <Progress value={stat.progress} className="h-1.5 mt-3" />
                )}
              </div>
            ))}
          </div>

          {/* Active Project */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Active Project</h2>
              <button className="text-sm text-primary font-medium hover:underline">View all</button>
            </div>

            <div className="dashboard-card">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/2">
                  <div className="rounded-2xl overflow-hidden bg-foreground aspect-video flex items-center justify-center">
                    <img src={fintechMockup} alt="Fintech App Redesign" className="h-full object-contain" />
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">R</div>
                    <span className="text-sm text-muted-foreground">Revolut</span>
                    <span className="ml-auto status-badge bg-destructive/10 text-destructive">Due in 4 days</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Fintech App Redesign</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Redesign the user onboarding flow to increase conversion by 15%. Focus on simplification and trust signals.
                  </p>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-primary font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2 mb-4" />
                  <div className="flex items-center gap-4">
                    <Button className="rounded-2xl">Resume Work</Button>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-secondary border-2 border-background" />
                      ))}
                      <div className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                        +2
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recommended Projects */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Recommended Projects</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="w-8 h-8 rounded-xl">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="w-8 h-8 rounded-xl">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {recommendedProjects.map((project) => (
                  <div key={project.title} className="dashboard-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
                        {project.icon}
                      </div>
                      <span className="status-badge status-badge-muted">{project.category}</span>
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary font-medium">{project.credits} Credits</span>
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        Apply <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>
              <div className="dashboard-card">
                <ul className="space-y-4">
                  {recentActivity.map((activity, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center shrink-0`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.subtitle}</p>
                        <p className="text-xs text-success mt-1">{activity.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;

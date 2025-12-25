import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Briefcase,
  GitBranch,
  Users,
  BarChart3,
  Settings,
  Box,
  Plus,
  Bell,
  MessageSquare,
  Clock,
  Eye,
  Briefcase as BriefcaseIcon,
  Mail,
} from "lucide-react";
import backendChallenge from "@/assets/backend-challenge.png";
import reactDashboard from "@/assets/react-dashboard.png";

const CompanyDashboard = () => {
  const sidebarSections = [
    {
      items: [
        { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/company" },
        { label: "Challenges", icon: <Briefcase className="w-5 h-5" />, href: "/company/challenges" },
        { label: "Pipeline", icon: <GitBranch className="w-5 h-5" />, href: "/company/pipeline" },
        { label: "Talent Pool", icon: <Users className="w-5 h-5" />, href: "/company/talent" },
        { label: "Analytics", icon: <BarChart3 className="w-5 h-5" />, href: "/company/analytics" },
      ],
    },
    {
      items: [
        { label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/company/settings" },
      ],
    },
  ];

  const stats = [
    {
      label: "Active Challenges",
      value: "3",
      badge: "+1 this week",
      badgeColor: "text-success",
      icon: <Briefcase className="w-5 h-5" />,
      iconBg: "bg-primary/10 text-primary",
    },
    {
      label: "Pending Reviews",
      value: "12",
      badge: "+4 since yesterday",
      badgeColor: "text-success",
      icon: <Eye className="w-5 h-5" />,
      iconBg: "bg-warning/10 text-warning",
    },
    {
      label: "Top Candidates",
      value: "8",
      badge: "+2 new",
      badgeColor: "text-success",
      icon: <Users className="w-5 h-5" />,
      iconBg: "bg-success/10 text-success",
    },
  ];

  const challenges = [
    {
      title: "Backend Optimization Challenge",
      status: "ACTIVE",
      description: "Optimize a Django API for high-concurrency traffic.",
      tags: ["Python", "Django"],
      deadline: "5 days left",
      submissions: 12,
      image: backendChallenge,
    },
    {
      title: "React Dashboard Component",
      status: "ACTIVE",
      description: "Build a reusable data visualization component library.",
      tags: ["React", "D3.js"],
      deadline: "12 days left",
      submissions: 4,
      image: reactDashboard,
    },
  ];

  const talentSpotlight = [
    {
      name: "Elena Rodriguez",
      score: "98/100",
      skills: ["PYTHON", "DATA SCIENCE"],
    },
    {
      name: "David Chen",
      score: "95/100",
      skills: ["REACT", "NODE.JS"],
    },
  ];

  const submissions = [
    {
      name: "James Smith",
      email: "james.s@uni.edu",
      initials: "JS",
      initialsColor: "bg-primary",
      challenge: "Backend Optimization",
      submitted: "2 hours ago",
      status: "Under Review",
      statusColor: "bg-warning/10 text-warning",
      showReview: true,
    },
    {
      name: "Sarah Lee",
      email: "s.lee@tech.edu",
      initials: "AL",
      initialsColor: "bg-success",
      challenge: "React Dashboard",
      submitted: "5 hours ago",
      status: "New",
      statusColor: "bg-muted text-muted-foreground",
      showReview: true,
    },
    {
      name: "Mike K.",
      email: "mike.dev@gmail.com",
      initials: "MK",
      initialsColor: "bg-warning",
      challenge: "Backend Optimization",
      submitted: "1 day ago",
      status: "Qualified",
      statusColor: "bg-success/10 text-success",
      showDetails: true,
    },
  ];

  const pipelineHealth = [
    { label: "Submitted", count: 16, icon: <Mail className="w-4 h-4" /> },
    { label: "Under Review", count: 4, icon: <Eye className="w-4 h-4" /> },
    { label: "Interview", count: 2, icon: <BriefcaseIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="flex h-screen bg-muted/30">
      <DashboardSidebar
        logo={<Box className="w-5 h-5" />}
        title="EduPlatform"
        subtitle="Enterprise"
        sections={sidebarSections}
        footer={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Alex Morgan</p>
              <p className="text-xs text-muted-foreground">Acme Corp</p>
            </div>
          </div>
        }
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Custom Header for Company */}
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search challenges, candidates..."
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="w-5 h-5" />
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Challenge
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Good morning, Acme Corp</h1>
            <p className="text-muted-foreground">Here's what's happening with your engineering challenges today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className={`text-xs ${stat.badgeColor} mt-1`}>{stat.badge}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Challenges */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Active Challenges</h2>
                  <button className="text-sm text-primary font-medium hover:underline">View All</button>
                </div>

                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.title} className="dashboard-card">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                          <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{challenge.title}</h3>
                            <span className="status-badge status-badge-success">{challenge.status}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              {"<>"} {challenge.tags.join(", ")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {challenge.deadline}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-2xl font-bold text-foreground">{challenge.submissions}</p>
                          <p className="text-xs text-muted-foreground">Submissions</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Submissions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Recent Submissions</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Filter</Button>
                    <Button variant="outline" size="sm">Sort</Button>
                  </div>
                </div>

                <div className="dashboard-card">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="pb-4 font-medium">Candidate</th>
                        <th className="pb-4 font-medium">Challenge</th>
                        <th className="pb-4 font-medium">Submitted</th>
                        <th className="pb-4 font-medium">Status</th>
                        <th className="pb-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {submissions.map((sub, idx) => (
                        <tr key={idx}>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${sub.initialsColor} flex items-center justify-center text-xs text-primary-foreground font-bold`}>
                                {sub.initials}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{sub.name}</p>
                                <p className="text-xs text-muted-foreground">{sub.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">{sub.challenge}</td>
                          <td className="py-4 text-sm text-muted-foreground">{sub.submitted}</td>
                          <td className="py-4">
                            <span className={`status-badge ${sub.statusColor}`}>
                              {sub.status === "Under Review" && "• "}
                              {sub.status === "Qualified" && "• "}
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-4">
                            {sub.showReview && (
                              <button className="text-sm text-primary font-medium hover:underline">Review</button>
                            )}
                            {sub.showDetails && (
                              <button className="text-sm text-muted-foreground hover:text-foreground">Details</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Talent Spotlight */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-foreground">Talent Spotlight</h2>
                  <button className="text-muted-foreground hover:text-foreground">•••</button>
                </div>

                <div className="space-y-4">
                  {talentSpotlight.map((talent, idx) => (
                    <div key={idx} className="dashboard-card">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-foreground">{talent.name}</p>
                            <Mail className="w-4 h-4 text-primary" />
                          </div>
                          <p className="text-xs text-muted-foreground">Score: {talent.score}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mb-3">
                        {talent.skills.map((skill) => (
                          <span key={skill} className="status-badge status-badge-muted text-xs">{skill}</span>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pipeline Health */}
              <div>
                <h2 className="font-semibold text-foreground mb-4">Pipeline Health</h2>
                <div className="dashboard-card space-y-4">
                  {pipelineHealth.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                          {item.icon}
                        </div>
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                      </div>
                      <span className="font-semibold text-foreground">{item.count}</span>
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

export default CompanyDashboard;

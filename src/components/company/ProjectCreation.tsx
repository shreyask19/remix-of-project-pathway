import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Clock,
  Users,
  Code,
  Palette,
  Database,
  BarChart3,
  MoreVertical,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

const ProjectCreation = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const challenges = [
    {
      id: 1,
      title: "Backend Optimization Challenge",
      description: "Optimize a Django API for high-concurrency traffic with caching strategies.",
      status: "active",
      difficulty: "Hard",
      credits: 90,
      skills: ["Python", "Django", "Redis"],
      deadline: "5 days left",
      submissions: 12,
      icon: <Database className="w-5 h-5" />,
    },
    {
      id: 2,
      title: "React Dashboard Component",
      description: "Build a reusable data visualization component library with D3.js integration.",
      status: "active",
      difficulty: "Medium",
      credits: 70,
      skills: ["React", "TypeScript", "D3.js"],
      deadline: "12 days left",
      submissions: 18,
      icon: <Code className="w-5 h-5" />,
    },
    {
      id: 3,
      title: "UX Research Study",
      description: "Conduct user research and create personas for our mobile app redesign.",
      status: "draft",
      difficulty: "Easy",
      credits: 50,
      skills: ["UX Research", "Figma", "User Testing"],
      deadline: "Not set",
      submissions: 0,
      icon: <Palette className="w-5 h-5" />,
    },
    {
      id: 4,
      title: "Data Pipeline Architecture",
      description: "Design and implement a real-time data processing pipeline using Apache Kafka.",
      status: "closed",
      difficulty: "Hard",
      credits: 100,
      skills: ["Python", "Kafka", "AWS"],
      deadline: "Ended",
      submissions: 9,
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="status-badge bg-success/10 text-success">Active</span>;
      case "draft":
        return <span className="status-badge bg-muted text-muted-foreground">Draft</span>;
      case "closed":
        return <span className="status-badge bg-secondary text-muted-foreground">Closed</span>;
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-success/10 text-success";
      case "Medium":
        return "bg-warning/10 text-warning";
      case "Hard":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Project Challenges</h2>
          <p className="text-muted-foreground">Create and manage engineering challenges for students</p>
        </div>
        <Button className="rounded-2xl gap-2" onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="w-4 h-4" />
          Create Challenge
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="dashboard-card border-primary/30">
          <h3 className="font-bold text-foreground mb-4">Create New Challenge</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Challenge Title</label>
              <input
                type="text"
                placeholder="e.g., API Performance Optimization"
                className="w-full px-4 py-2 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Difficulty</label>
              <select className="w-full px-4 py-2 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Credits</label>
              <input
                type="number"
                placeholder="50-100"
                className="w-full px-4 py-2 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Deadline</label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                rows={3}
                placeholder="Describe the challenge requirements, evaluation criteria, and expected deliverables..."
                className="w-full px-4 py-2 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Required Skills</label>
              <input
                type="text"
                placeholder="e.g., Python, Django, PostgreSQL (comma-separated)"
                className="w-full px-4 py-2 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-2xl" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
            <Button className="rounded-2xl gap-2">
              <CheckCircle className="w-4 h-4" />
              Publish Challenge
            </Button>
          </div>
        </div>
      )}

      {/* Challenges List */}
      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="dashboard-card group">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {challenge.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-foreground">{challenge.title}</h3>
                    {getStatusBadge(challenge.status)}
                    <span className={`status-badge ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {challenge.skills.map((skill) => (
                      <span key={skill} className="text-xs px-2 py-1 rounded-xl bg-secondary text-muted-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 lg:border-l lg:border-border lg:pl-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{challenge.credits}</p>
                  <p className="text-xs text-muted-foreground">Credits</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">{challenge.submissions}</p>
                  <p className="text-xs text-muted-foreground">Submissions</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {challenge.deadline}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-xl text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectCreation;

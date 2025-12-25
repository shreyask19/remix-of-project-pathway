import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Clock,
  Code,
  Palette,
  Database,
  BarChart3,
  CheckCircle,
  Upload,
  FileText,
  X
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Challenge {
  id: number;
  title: string;
  description: string;
  status: "active" | "draft" | "closed";
  difficulty: "Easy" | "Medium" | "Hard";
  credits: number;
  skills: string[];
  deadline: string;
  submissions: number;
  instructions: string;
  files: string[];
}

const ProjectCreation = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    credits: 50,
    deadline: "",
    description: "",
    skills: "",
    instructions: "",
    files: [] as string[]
  });

  const [challenges, setChallenges] = useState<Challenge[]>([
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
      instructions: "Implement caching layer and optimize database queries.",
      files: ["requirements.pdf"],
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
      instructions: "Create at least 5 chart components with documentation.",
      files: ["design-specs.pdf", "sample-data.json"],
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
      instructions: "",
      files: [],
    },
  ]);

  const resetForm = () => {
    setFormData({
      title: "",
      difficulty: "Medium",
      credits: 50,
      deadline: "",
      description: "",
      skills: "",
      instructions: "",
      files: []
    });
    setEditingId(null);
    setShowCreateForm(false);
  };

  const handleFileUpload = () => {
    const fileName = `file-${Date.now()}.pdf`;
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, fileName]
    }));
    toast.success("File uploaded successfully");
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handlePublish = () => {
    if (!formData.title || !formData.description) {
      toast.error("Please fill in title and description");
      return;
    }

    const newChallenge: Challenge = {
      id: editingId || Date.now(),
      title: formData.title,
      description: formData.description,
      status: "active",
      difficulty: formData.difficulty,
      credits: formData.credits,
      skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      deadline: formData.deadline ? `${Math.ceil((new Date(formData.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left` : "14 days left",
      submissions: 0,
      instructions: formData.instructions,
      files: formData.files,
    };

    if (editingId) {
      setChallenges(prev => prev.map(c => c.id === editingId ? newChallenge : c));
      toast.success("Challenge updated successfully");
    } else {
      setChallenges(prev => [newChallenge, ...prev]);
      toast.success("Challenge published successfully");
    }
    
    resetForm();
  };

  const handleSaveDraft = () => {
    if (!formData.title) {
      toast.error("Please add a title");
      return;
    }

    const draftChallenge: Challenge = {
      id: editingId || Date.now(),
      title: formData.title,
      description: formData.description || "No description yet",
      status: "draft",
      difficulty: formData.difficulty,
      credits: formData.credits,
      skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      deadline: "Not set",
      submissions: 0,
      instructions: formData.instructions,
      files: formData.files,
    };

    if (editingId) {
      setChallenges(prev => prev.map(c => c.id === editingId ? draftChallenge : c));
    } else {
      setChallenges(prev => [draftChallenge, ...prev]);
    }
    
    toast.success("Draft saved");
    resetForm();
  };

  const handleEdit = (challenge: Challenge) => {
    setFormData({
      title: challenge.title,
      difficulty: challenge.difficulty,
      credits: challenge.credits,
      deadline: "",
      description: challenge.description,
      skills: challenge.skills.join(", "),
      instructions: challenge.instructions,
      files: challenge.files
    });
    setEditingId(challenge.id);
    setShowCreateForm(true);
  };

  const handleDelete = (id: number) => {
    setChallenges(prev => prev.filter(c => c.id !== id));
    toast.success("Challenge deleted");
  };

  const handleCloseChallenge = (id: number) => {
    setChallenges(prev => prev.map(c => 
      c.id === id ? { ...c, status: "closed" as const } : c
    ));
    toast.success("Challenge closed");
  };

  const getIcon = (title: string) => {
    if (title.toLowerCase().includes("backend") || title.toLowerCase().includes("data")) {
      return <Database className="w-5 h-5" />;
    }
    if (title.toLowerCase().includes("react") || title.toLowerCase().includes("component")) {
      return <Code className="w-5 h-5" />;
    }
    if (title.toLowerCase().includes("ux") || title.toLowerCase().includes("design")) {
      return <Palette className="w-5 h-5" />;
    }
    return <BarChart3 className="w-5 h-5" />;
  };

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
          <p className="text-muted-foreground text-sm">Create and manage engineering challenges for students</p>
        </div>
        <Button className="rounded-2xl gap-2" onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="w-4 h-4" />
          Create Challenge
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="glass-card p-6 border border-primary/20">
          <h3 className="font-bold text-foreground mb-6">
            {editingId ? "Edit Challenge" : "Create New Challenge"}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Challenge Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., API Performance Optimization"
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Difficulty</label>
                <select 
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as "Easy" | "Medium" | "Hard" }))}
                  className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Credits</label>
                <input
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData(prev => ({ ...prev, credits: Number(e.target.value) }))}
                  placeholder="50-100"
                  className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Required Skills</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                placeholder="Python, Django, PostgreSQL (comma-separated)"
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the challenge requirements and expected deliverables..."
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Instructions & Restrictions</label>
              <textarea
                rows={3}
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Specific instructions, evaluation criteria, restrictions..."
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
            
            {/* File Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Attachments</label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-3">Upload datasets, specifications, or resources</p>
                <Button variant="outline" className="rounded-xl" onClick={handleFileUpload}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </div>
              
              {formData.files.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{file}</span>
                      <button onClick={() => removeFile(index)} className="text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
            <Button variant="outline" className="rounded-xl" onClick={resetForm}>
              Cancel
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={handleSaveDraft}>
              Save as Draft
            </Button>
            <Button className="rounded-xl gap-2 ml-auto" onClick={handlePublish}>
              <CheckCircle className="w-4 h-4" />
              {editingId ? "Update Challenge" : "Publish Challenge"}
            </Button>
          </div>
        </div>
      )}

      {/* Challenges List */}
      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="glass-card p-5 group hover:border-primary/20 transition-colors">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {getIcon(challenge.title)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-foreground">{challenge.title}</h3>
                    {getStatusBadge(challenge.status)}
                    <span className={`status-badge ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{challenge.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {challenge.skills.map((skill) => (
                      <span key={skill} className="text-xs px-2 py-1 rounded-lg bg-secondary text-muted-foreground">
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
                <div className="text-center min-w-[80px]">
                  <p className="text-sm font-medium text-foreground flex items-center gap-1 justify-center">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {challenge.deadline}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => handleEdit(challenge)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  {challenge.status === "active" && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-xl"
                      onClick={() => handleCloseChallenge(challenge.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl text-destructive hover:text-destructive"
                    onClick={() => handleDelete(challenge.id)}
                  >
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
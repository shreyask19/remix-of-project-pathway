import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  X,
  Loader2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useChallenges } from "@/hooks/useChallenges";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface AttachedFile {
  id?: string;
  name: string;
  path: string;
  size: number;
}

const ProjectCreation = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    credits: 50,
    deadline: "",
    description: "",
    skills: "",
    instructions: "",
    restrictions: "",
    files: [] as AttachedFile[]
  });

  const { createChallenge } = useChallenges();
  const { isUploading, progress, uploadChallengeFile, deleteFile } = useFileUpload();

  // Fetch company's own challenges
  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ["companyChallenges", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("challenges")
        .select(`
          *,
          challenge_attachments (id, file_name, file_path, file_size)
        `)
        .eq("company_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      difficulty: "Medium",
      credits: 50,
      deadline: "",
      description: "",
      skills: "",
      instructions: "",
      restrictions: "",
      files: []
    });
    setEditingId(null);
    setShowCreateForm(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingId) return;

    for (const file of Array.from(files)) {
      const result = await uploadChallengeFile(editingId, file);
      if (result) {
        setFormData(prev => ({
          ...prev,
          files: [...prev.files, {
            name: result.fileName,
            path: result.path,
            size: result.fileSize,
          }]
        }));
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = async (index: number) => {
    const file = formData.files[index];
    if (file.path) {
      await deleteFile("challenge-attachments", file.path);
    }
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Please fill in title and description");
      return;
    }

    try {
      if (editingId) {
        // Update existing challenge
        const { error } = await supabase
          .from("challenges")
          .update({
            title: formData.title,
            description: formData.description,
            difficulty: formData.difficulty,
            credits: formData.credits,
            required_skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
            deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
            instructions: formData.instructions,
            restrictions: formData.restrictions.split(",").map(s => s.trim()).filter(Boolean),
            status: "active",
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Challenge updated successfully");
      } else {
        // Create new challenge
        await createChallenge.mutateAsync({
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          credits: formData.credits,
          required_skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
          deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
          instructions: formData.instructions,
          restrictions: formData.restrictions.split(",").map(s => s.trim()).filter(Boolean),
          status: "active",
        });
        toast.success("Challenge published successfully");
      }
      
      queryClient.invalidateQueries({ queryKey: ["companyChallenges"] });
      resetForm();
    } catch (error) {
      toast.error("Failed to save challenge");
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.title) {
      toast.error("Please add a title");
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("challenges")
          .update({
            title: formData.title,
            description: formData.description || "No description yet",
            difficulty: formData.difficulty,
            credits: formData.credits,
            required_skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
            instructions: formData.instructions,
            restrictions: formData.restrictions.split(",").map(s => s.trim()).filter(Boolean),
            status: "draft",
          })
          .eq("id", editingId);

        if (error) throw error;
      } else {
        await createChallenge.mutateAsync({
          title: formData.title,
          description: formData.description || "No description yet",
          difficulty: formData.difficulty,
          credits: formData.credits,
          required_skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
          instructions: formData.instructions,
          restrictions: formData.restrictions.split(",").map(s => s.trim()).filter(Boolean),
          status: "draft",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["companyChallenges"] });
      toast.success("Draft saved");
      resetForm();
    } catch (error) {
      toast.error("Failed to save draft");
    }
  };

  const handleEdit = (challenge: typeof challenges[0]) => {
    const attachedFiles: AttachedFile[] = (challenge.challenge_attachments || []).map((a: { id: string; file_name: string; file_path: string; file_size: number }) => ({
      id: a.id,
      name: a.file_name,
      path: a.file_path,
      size: a.file_size,
    }));

    setFormData({
      title: challenge.title,
      difficulty: challenge.difficulty as "Easy" | "Medium" | "Hard",
      credits: challenge.credits,
      deadline: challenge.deadline ? challenge.deadline.split("T")[0] : "",
      description: challenge.description,
      skills: (challenge.required_skills || []).join(", "),
      instructions: challenge.instructions || "",
      restrictions: (challenge.restrictions || []).join(", "),
      files: attachedFiles
    });
    setEditingId(challenge.id);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("challenges")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["companyChallenges"] });
      toast.success("Challenge deleted");
    } catch (error) {
      toast.error("Failed to delete challenge");
    }
  };

  const handleCloseChallenge = async (id: string) => {
    try {
      const { error } = await supabase
        .from("challenges")
        .update({ status: "closed" })
        .eq("id", id);
      
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["companyChallenges"] });
      toast.success("Challenge closed");
    } catch (error) {
      toast.error("Failed to close challenge");
    }
  };

  const getDeadlineText = (deadline: string | null): string => {
    if (!deadline) return "No deadline";
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Due today";
    return `${diffDays} days left`;
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
              {editingId ? (
                <>
                  <div 
                    className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Uploading... {progress?.percentage || 0}%</p>
                        <Progress value={progress?.percentage || 0} className="h-2 max-w-xs mx-auto" />
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-3">Upload datasets, specifications, or resources (max 10MB)</p>
                        <Button variant="outline" className="rounded-xl" type="button">
                          <Upload className="w-4 h-4 mr-2" />
                          Select Files
                        </Button>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.json,.txt,.csv,.zip,.png,.jpg,.jpeg"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </>
              ) : (
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Save as draft first to upload files</p>
                </div>
              )}
              
              {formData.files.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
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
                    {(challenge.required_skills || []).map((skill) => (
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
                  <p className="text-xl font-bold text-foreground">{challenge.current_applicants}</p>
                  <p className="text-xs text-muted-foreground">Applicants</p>
                </div>
                <div className="text-center min-w-[80px]">
                  <p className="text-sm font-medium text-foreground flex items-center gap-1 justify-center">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {getDeadlineText(challenge.deadline)}
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
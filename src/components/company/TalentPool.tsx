import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, 
  Mail, 
  ExternalLink,
  Award,
  GraduationCap,
  X,
  FileText,
  Check,
  Star,
  Users,
  Loader2,
  ArrowUpDown,
  Filter,
  Briefcase,
  Send
} from "lucide-react";
import { useTalentPool, TalentStudent } from "@/hooks/useTalentPool";
import { useHiringPipeline } from "@/hooks/useHiringPipeline";
import { useInvitationActions } from "@/hooks/useInvitationActions";

type SortOption = "credits" | "projects" | "name";
type AvailabilityFilter = "all" | "available" | "hired";

const TalentPool = () => {
  const { talents, isLoading } = useTalentPool();
  const { addToPipeline } = useHiringPipeline();
  const { sendInvitation } = useInvitationActions();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSkillFilter, setActiveSkillFilter] = useState<string | null>(null);
  const [selectedTalent, setSelectedTalent] = useState<TalentStudent | null>(null);
  const [contactingId, setContactingId] = useState<string | null>(null);
  const [contactedIds, setContactedIds] = useState<Set<string>>(new Set());
  
  // Enhanced filtering & sorting
  const [sortBy, setSortBy] = useState<SortOption>("credits");
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>("available");
  
  // Invitation modal
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteTalent, setInviteTalent] = useState<TalentStudent | null>(null);
  const [inviteRole, setInviteRole] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");

  const skillFilters = ["All", "Python", "React", "Node.js", "TypeScript", "Data Science", "Machine Learning", "Java", "SQL"];

  // Apply filters and sorting
  const filteredTalents = useMemo(() => {
    let result = talents || [];
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(talent => {
        const fullName = `${talent.firstName} ${talent.lastName}`.toLowerCase();
        return fullName.includes(query) ||
               (talent.university || "").toLowerCase().includes(query) ||
               talent.skills.some(s => s.toLowerCase().includes(query));
      });
    }
    
    // Skill filter
    if (activeSkillFilter && activeSkillFilter !== "All") {
      result = result.filter(talent =>
        talent.skills.some(s => s.toLowerCase() === activeSkillFilter.toLowerCase())
      );
    }
    
    // Availability filter
    if (availabilityFilter === "available") {
      result = result.filter(talent => talent.available);
    } else if (availabilityFilter === "hired") {
      result = result.filter(talent => !talent.available);
    }
    
    // Sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "credits":
          return b.credits - a.credits;
        case "projects":
          return b.projectsCompleted - a.projectsCompleted;
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        default:
          return 0;
      }
    });
    
    return result;
  }, [talents, searchQuery, activeSkillFilter, availabilityFilter, sortBy]);

  const handleContact = async (talent: TalentStudent) => {
    setContactingId(talent.userId);
    try {
      await addToPipeline.mutateAsync({ 
        studentId: talent.userId, 
        notes: "Added via Talent Pool" 
      });
      setContactedIds(prev => new Set([...prev, talent.userId]));
      toast.success(`Added ${talent.firstName} to your hiring pipeline`);
    } catch (error) {
      // Error handled by hook
    } finally {
      setContactingId(null);
    }
  };

  const handleSendInvitation = async () => {
    if (!inviteTalent || !inviteRole.trim()) {
      toast.error("Please enter a role");
      return;
    }

    try {
      // First add to pipeline if not already added
      if (!contactedIds.has(inviteTalent.userId)) {
        await addToPipeline.mutateAsync({ 
          studentId: inviteTalent.userId, 
          notes: inviteMessage || `Interview for ${inviteRole}` 
        });
        setContactedIds(prev => new Set([...prev, inviteTalent.userId]));
      }

      // Send interview invitation
      await sendInvitation.mutateAsync({
        studentId: inviteTalent.userId,
        role: inviteRole,
        type: "interview",
        message: inviteMessage,
      });

      setInviteModalOpen(false);
      setInviteTalent(null);
      setInviteRole("");
      setInviteMessage("");
    } catch (error) {
      // Error handled by hook
    }
  };

  const openInviteModal = (talent: TalentStudent) => {
    setInviteTalent(talent);
    setInviteModalOpen(true);
  };

  const handleViewProfile = (talent: TalentStudent) => {
    setSelectedTalent(talent);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Talent Pool</h2>
            <p className="text-muted-foreground">Discover high-performing students based on their project work</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="dashboard-card animate-pulse">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary" />
                <div className="flex-1">
                  <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-14 bg-secondary rounded-lg" />
                ))}
              </div>
              <div className="flex gap-2">
                <div className="h-10 bg-secondary rounded-lg flex-1" />
                <div className="h-10 bg-secondary rounded-lg flex-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Talent Pool</h2>
          <p className="text-muted-foreground">Discover high-performing students based on their project work</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, university, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-clean pl-10 w-80"
          />
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Skill Filters */}
        <div className="flex gap-2 flex-wrap flex-1">
          {skillFilters.map((skill) => (
            <button
              key={skill}
              onClick={() => setActiveSkillFilter(skill === "All" ? null : skill)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                (skill === "All" && !activeSkillFilter) || activeSkillFilter === skill
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Availability Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value as AvailabilityFilter)}
            className="px-3 py-2 rounded-lg bg-secondary text-foreground text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="available">Available Only</option>
            <option value="all">All Candidates</option>
            <option value="hired">Hired</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 rounded-lg bg-secondary text-foreground text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="credits">Sort by Credits</option>
            <option value="projects">Sort by Projects</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredTalents.length} candidate{filteredTalents.length !== 1 ? 's' : ''}
      </div>

      {/* Empty State */}
      {filteredTalents.length === 0 && (
        <div className="dashboard-card text-center py-12">
          <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">No matching talents</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {searchQuery || activeSkillFilter 
              ? "Try adjusting your filters to find more candidates."
              : "As students complete projects and earn credits, top performers will appear here."}
          </p>
        </div>
      )}

      {/* Talent Grid */}
      {filteredTalents.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTalents.map((talent) => (
            <div key={talent.userId} className="dashboard-card hover:border-primary/20">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold">
                    {getInitials(talent.firstName, talent.lastName)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{talent.firstName} {talent.lastName}</h3>
                    <p className="text-sm text-muted-foreground">{talent.university || "University not specified"}</p>
                  </div>
                </div>
                {talent.available ? (
                  <span className="status-badge status-badge-success">Available</span>
                ) : (
                  <span className="status-badge status-badge-muted">Hired</span>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center py-2 rounded-lg bg-secondary">
                  <p className="text-lg font-bold text-primary">{Math.min(100, Math.round(talent.credits / 5))}%</p>
                  <p className="text-xs text-muted-foreground">Score</p>
                </div>
                <div className="text-center py-2 rounded-lg bg-secondary">
                  <p className="text-lg font-bold text-foreground">{talent.credits}</p>
                  <p className="text-xs text-muted-foreground">Credits</p>
                </div>
                <div className="text-center py-2 rounded-lg bg-secondary">
                  <p className="text-lg font-bold text-foreground">{talent.projectsCompleted}</p>
                  <p className="text-xs text-muted-foreground">Projects</p>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {talent.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                    {skill}
                  </span>
                ))}
                {talent.skills.length > 4 && (
                  <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                    +{talent.skills.length - 4}
                  </span>
                )}
                {talent.skills.length === 0 && (
                  <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                    No skills listed
                  </span>
                )}
              </div>

              {/* Top Project */}
              {talent.projectsCompleted > 0 && (
                <div className="p-3 rounded-lg bg-secondary/50 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">Top Performer</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {talent.projectsCompleted} project{talent.projectsCompleted !== 1 ? 's' : ''} completed
                  </p>
                </div>
              )}

              {/* Info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {talent.university || "Student"}
                </span>
                <span>{talent.credits} credits earned</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-lg gap-2"
                  onClick={() => handleViewProfile(talent)}
                >
                  <ExternalLink className="w-4 h-4" />
                  Profile
                </Button>
                {talent.available && (
                  <>
                    {contactedIds.has(talent.userId) ? (
                      <Button 
                        className="flex-1 rounded-lg gap-2"
                        onClick={() => openInviteModal(talent)}
                      >
                        <Briefcase className="w-4 h-4" />
                        Invite
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1 rounded-lg gap-2"
                        onClick={() => handleContact(talent)}
                        disabled={contactingId === talent.userId}
                      >
                        {contactingId === talent.userId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                        Add to Pipeline
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile Modal */}
      {selectedTalent && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Student Profile</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedTalent(null)} className="rounded-lg">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Modal Content */}
            <div className="p-5 space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                  {getInitials(selectedTalent.firstName, selectedTalent.lastName)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl font-semibold text-foreground">
                      {selectedTalent.firstName} {selectedTalent.lastName}
                    </h4>
                    {selectedTalent.available ? (
                      <span className="status-badge status-badge-success">Available</span>
                    ) : (
                      <span className="status-badge status-badge-muted">Hired</span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{selectedTalent.university || "University not specified"}</p>
                  <p className="text-sm text-muted-foreground">{selectedTalent.email}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="stat-card text-center">
                  <p className="text-2xl font-bold text-primary">{Math.min(100, Math.round(selectedTalent.credits / 5))}%</p>
                  <p className="text-xs text-muted-foreground">Skill Score</p>
                </div>
                <div className="stat-card text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedTalent.credits}</p>
                  <p className="text-xs text-muted-foreground">Credits</p>
                </div>
                <div className="stat-card text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedTalent.projectsCompleted}</p>
                  <p className="text-xs text-muted-foreground">Projects</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h5 className="text-sm font-medium text-foreground mb-3">Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedTalent.skills.length > 0 ? (
                    selectedTalent.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills listed yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-card border-t border-border p-5 flex gap-3">
              <Button variant="outline" className="flex-1 rounded-lg gap-2">
                <FileText className="w-4 h-4" />
                Download Resume
              </Button>
              {selectedTalent.available && (
                <>
                  {contactedIds.has(selectedTalent.userId) ? (
                    <Button 
                      className="flex-1 rounded-lg gap-2"
                      onClick={() => {
                        openInviteModal(selectedTalent);
                        setSelectedTalent(null);
                      }}
                    >
                      <Briefcase className="w-4 h-4" />
                      Send Interview Invite
                    </Button>
                  ) : (
                    <Button 
                      className="flex-1 rounded-lg gap-2"
                      onClick={() => {
                        handleContact(selectedTalent);
                        setSelectedTalent(null);
                      }}
                    >
                      <Mail className="w-4 h-4" />
                      Add to Pipeline
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interview Invitation Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Interview Invitation</DialogTitle>
            <DialogDescription>
              Invite {inviteTalent?.firstName} {inviteTalent?.lastName} for an interview
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Role / Position *
              </label>
              <input
                type="text"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                placeholder="e.g., Frontend Developer Intern"
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message (Optional)
              </label>
              <textarea
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder="Add a personal message..."
                rows={3}
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendInvitation}
              disabled={sendInvitation.isPending || !inviteRole.trim()}
              className="gap-2"
            >
              {sendInvitation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TalentPool;
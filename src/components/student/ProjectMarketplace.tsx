import { Button } from "@/components/ui/button";
import { 
  Search, 
  ArrowRight, 
  Code, 
  Palette, 
  BarChart3, 
  Database,
  Clock,
  CheckCircle,
  X,
  SortAsc,
  Loader2,
  RefreshCw,
  DollarSign
} from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChallenges, useFilterOptions, type Challenge } from "@/hooks/useChallenges";
import { formatDeadline } from "@/lib/transformers";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { MarketplaceGridSkeleton } from "@/components/ui/loading-skeleton";
import HeartbeatIndicator from "@/components/shared/HeartbeatIndicator";
import FilterPanel, { type FilterState } from "@/components/shared/FilterPanel";

type ChallengeWithCompany = Challenge & { company: { company_name: string; logo_url: string; avg_review_time_hours?: number | null } | null };

const ProjectMarketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL params
  const [activeFilter, setActiveFilter] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "deadline");
  const [selectedProject, setSelectedProject] = useState<ChallengeWithCompany | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Advanced filters state
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>(() => ({
    techStack: searchParams.get("tech")?.split(",").filter(Boolean) || [],
    minCredits: parseInt(searchParams.get("minCredits") || "0") || 0,
    maxCredits: parseInt(searchParams.get("maxCredits") || "500") || 500,
    hasStipend: searchParams.get("stipend") === "true",
    company: searchParams.get("company") || "",
  }));

  // Fetch filter options (cached separately)
  const { techStacks, companies } = useFilterOptions();

  // Use debounced search for performance
  const { 
    value: searchValue, 
    setValue: setSearchValue, 
    debouncedValue: searchQuery, 
    isDebouncing, 
    clear: clearSearch 
  } = useDebouncedSearch(searchParams.get("q") || "", { delay: 300 });

  // Sync URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set("q", searchQuery);
    if (activeFilter !== "all") params.set("category", activeFilter);
    if (sortBy !== "deadline") params.set("sort", sortBy);
    if (advancedFilters.techStack.length > 0) params.set("tech", advancedFilters.techStack.join(","));
    if (advancedFilters.minCredits > 0) params.set("minCredits", advancedFilters.minCredits.toString());
    if (advancedFilters.maxCredits < 500) params.set("maxCredits", advancedFilters.maxCredits.toString());
    if (advancedFilters.hasStipend) params.set("stipend", "true");
    if (advancedFilters.company) params.set("company", advancedFilters.company);
    
    setSearchParams(params, { replace: true });
  }, [searchQuery, activeFilter, sortBy, advancedFilters, setSearchParams]);

  // Use the useChallenges hook with all filters
  const { 
    challenges, 
    challengesLoading, 
    applications,
    applyToChallenge 
  } = useChallenges({
    searchQuery: searchQuery.trim() || undefined,
    category: activeFilter !== "all" ? activeFilter : undefined,
    techStack: advancedFilters.techStack.length > 0 ? advancedFilters.techStack : undefined,
    minCredits: advancedFilters.minCredits > 0 ? advancedFilters.minCredits : undefined,
    maxCredits: advancedFilters.maxCredits < 500 ? advancedFilters.maxCredits : undefined,
    hasStipend: advancedFilters.hasStipend || undefined,
    companyId: advancedFilters.company || undefined,
  });

  // Get applied challenge IDs
  const appliedChallengeIds = useMemo(() => {
    return new Set(applications?.map(a => a.challenge_id) || []);
  }, [applications]);

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "design", label: "Design" },
    { id: "data", label: "Data Science" },
    { id: "mobile", label: "Mobile" },
    { id: "devops", label: "DevOps" },
  ];

  // Client-side sorting only (filtering is server-side)
  const sortedChallenges = useMemo(() => {
    if (!challenges) return [];
    
    return [...challenges].sort((a, b) => {
      switch (sortBy) {
        case "credits-high":
          return b.credits - a.credits;
        case "credits-low":
          return a.credits - b.credits;
        case "stipend":
          return (b.stipend_amount || 0) - (a.stipend_amount || 0);
        case "difficulty": {
          const diffOrder: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
          return (diffOrder[a.difficulty] || 2) - (diffOrder[b.difficulty] || 2);
        }
        default: // deadline
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
    });
  }, [challenges, sortBy]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "frontend":
        return <Code className="w-5 h-5" />;
      case "design":
        return <Palette className="w-5 h-5" />;
      case "data":
        return <BarChart3 className="w-5 h-5" />;
      case "backend":
        return <Database className="w-5 h-5" />;
      default:
        return <Code className="w-5 h-5" />;
    }
  };

  const handleApply = async () => {
    if (!selectedProject) return;
    
    try {
      await applyToChallenge.mutateAsync({ 
        challengeId: selectedProject.id,
        coverLetter: "" 
      });
      
      setShowApplyModal(false);
      setSelectedProject(null);
      
      toast.success("Application Submitted!", {
        description: `You've applied to ${selectedProject.title}`,
      });
    } catch (error) {
      toast.error("Failed to apply", {
        description: "Please try again later",
      });
    }
  };

  const openApplyModal = (project: ChallengeWithCompany) => {
    if (appliedChallengeIds.has(project.id)) {
      toast.info("Already Applied", {
        description: "You've already applied to this project",
      });
      return;
    }
    setSelectedProject(project);
    setShowApplyModal(true);
  };

  const clearAllFilters = useCallback(() => {
    clearSearch();
    setActiveFilter("all");
    setAdvancedFilters({
      techStack: [],
      minCredits: 0,
      maxCredits: 500,
      hasStipend: false,
      company: "",
    });
  }, [clearSearch]);

  const hasAnyFilters = searchQuery || 
    activeFilter !== "all" || 
    advancedFilters.techStack.length > 0 || 
    advancedFilters.minCredits > 0 || 
    advancedFilters.maxCredits < 500 || 
    advancedFilters.hasStipend || 
    advancedFilters.company;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Project Marketplace</h2>
          <p className="text-muted-foreground">Browse real-world projects from top companies</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects, skills, companies..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 pr-4 py-2 bg-secondary rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20 w-72"
            />
            {(searchValue || isDebouncing) && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {isDebouncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 rounded-xl">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="credits-high">Credits (High)</SelectItem>
              <SelectItem value="credits-low">Credits (Low)</SelectItem>
              <SelectItem value="stipend">Stipend</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters Panel */}
      <FilterPanel
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
        availableTechStacks={techStacks}
        availableCompanies={companies}
        isLoading={challengesLoading}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {challengesLoading || isDebouncing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Loading...
            </span>
          ) : (
            <>
              Showing <span className="font-semibold text-foreground">{sortedChallenges.length}</span> project{sortedChallenges.length !== 1 ? "s" : ""}
              {searchQuery && <span className="text-primary"> for "{searchQuery}"</span>}
            </>
          )}
        </p>
        {hasAnyFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Reset All
          </Button>
        )}
      </div>

      {/* Loading State with Skeleton */}
      {challengesLoading && (
        <MarketplaceGridSkeleton count={6} />
      )}

      {/* Empty State */}
      {!challengesLoading && sortedChallenges.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            {hasAnyFilters ? "Try adjusting your search or filters" : "Companies haven't posted any challenges yet"}
          </p>
          {hasAnyFilters && (
            <Button variant="outline" onClick={clearAllFilters}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Projects Grid */}
      {!challengesLoading && sortedChallenges.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedChallenges.map((project) => {
            const isApplied = appliedChallengeIds.has(project.id);
            
            return (
              <div 
                key={project.id} 
                className={`dashboard-card group hover:border-primary/30 transition-all ${isApplied ? "border-success/30 bg-success/5" : ""}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center font-bold">
                      {project.company?.company_name?.[0] || "H"}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-foreground">
                          {project.company?.company_name || "Heuristic Labs"}
                        </p>
                        <HeartbeatIndicator avgReviewTimeHours={project.company?.avg_review_time_hours} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          project.difficulty === "Easy" ? "bg-success/10 text-success" :
                          project.difficulty === "Medium" ? "bg-warning/10 text-warning" :
                          "bg-destructive/10 text-destructive"
                        }`}>
                          {project.difficulty}
                        </span>
                        {isApplied && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Applied
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    {getCategoryIcon(project.category)}
                  </div>
                </div>

                <h3 className="font-bold text-foreground mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.tech_stack || project.required_skills || []).slice(0, 3).map((skill) => (
                    <span key={skill} className="status-badge status-badge-muted text-xs">
                      {skill}
                    </span>
                  ))}
                  {((project.tech_stack || project.required_skills || []).length > 3) && (
                    <span className="status-badge status-badge-muted text-xs">
                      +{(project.tech_stack || project.required_skills || []).length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-primary">{project.credits} Credits</span>
                    {project.stipend_amount && project.stipend_amount > 0 && (
                      <span className="text-xs text-success flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ${project.stipend_amount}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDeadline(project.deadline)}
                    </span>
                  </div>
                  <Button 
                    variant={isApplied ? "outline" : "ghost"}
                    size="sm"
                    className={`gap-1 ${isApplied ? "text-success" : "text-muted-foreground hover:text-primary"}`}
                    onClick={() => openApplyModal(project)}
                    disabled={isApplied}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Applied
                      </>
                    ) : (
                      <>
                        Apply <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Details & Application</DialogTitle>
            <DialogDescription>
              Review the full project requirements before applying
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="py-4 space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center font-bold text-lg">
                  {selectedProject.company?.company_name?.[0] || "H"}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{selectedProject.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedProject.company?.company_name || "Heuristic Labs"}
                  </p>
                </div>
              </div>

              {/* Objective/Description */}
              <div className="space-y-2">
                <h5 className="text-sm font-semibold text-foreground">Objective</h5>
                <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
              </div>

              {/* Instructions */}
              {selectedProject.instructions && (
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-foreground">Instructions</h5>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-secondary/50 p-3 rounded-lg">
                    {selectedProject.instructions}
                  </div>
                </div>
              )}

              {/* Restrictions */}
              {selectedProject.restrictions && selectedProject.restrictions.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-foreground">Restrictions (Not Allowed)</h5>
                  <ul className="text-sm text-muted-foreground list-disc list-inside bg-destructive/5 p-3 rounded-lg border border-destructive/20">
                    {selectedProject.restrictions.map((restriction, idx) => (
                      <li key={idx}>{restriction}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack / Allowed Tools */}
              {(selectedProject.tech_stack || selectedProject.required_skills) && (
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-foreground">Allowed Tools & Technologies</h5>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProject.tech_stack || selectedProject.required_skills || []).map((tech) => (
                      <span key={tech} className="status-badge status-badge-muted text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Required Deliverables */}
              <div className="space-y-2">
                <h5 className="text-sm font-semibold text-foreground">Required Deliverables</h5>
                <ul className="text-sm text-muted-foreground list-disc list-inside bg-secondary/50 p-3 rounded-lg">
                  <li>GitHub repository with complete source code</li>
                  <li>Video walkthrough demonstrating the solution</li>
                  <li>README documentation with setup instructions</li>
                </ul>
              </div>
              
              {/* Key Details */}
              <div className="space-y-3 p-4 bg-secondary/50 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Credits</span>
                  <span className="font-medium text-primary">{selectedProject.credits}</span>
                </div>
                {selectedProject.stipend_amount && selectedProject.stipend_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stipend</span>
                    <span className="font-medium text-success">${selectedProject.stipend_amount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Difficulty</span>
                  <span className={`font-medium ${
                    selectedProject.difficulty === "Easy" ? "text-success" :
                    selectedProject.difficulty === "Medium" ? "text-warning" :
                    "text-destructive"
                  }`}>{selectedProject.difficulty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deadline</span>
                  <span className="font-medium">{formatDeadline(selectedProject.deadline)}</span>
                </div>
                {selectedProject.estimated_hours && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Hours</span>
                    <span className="font-medium">{selectedProject.estimated_hours}h</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                By applying, you commit to completing this project within the deadline. 
                Your profile will be shared with {selectedProject.company?.company_name || "the company"}.
              </p>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setShowApplyModal(false)} disabled={applyToChallenge.isPending}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={applyToChallenge.isPending} className="gap-2">
              {applyToChallenge.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Confirm Application
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectMarketplace;

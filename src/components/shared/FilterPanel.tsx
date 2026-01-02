import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterState {
  techStack: string[];
  minCredits: number;
  maxCredits: number;
  hasStipend: boolean;
  company: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableTechStacks: string[];
  availableCompanies: { id: string; name: string }[];
  isLoading?: boolean;
  className?: string;
}

const TECH_STACK_OPTIONS = [
  "React", "TypeScript", "JavaScript", "Node.js", "Python", 
  "Java", "Go", "Rust", "Vue.js", "Angular", "Next.js",
  "Django", "Flask", "Express", "PostgreSQL", "MongoDB",
  "AWS", "Docker", "Kubernetes", "GraphQL", "REST API",
  "TensorFlow", "PyTorch", "Machine Learning", "Data Science",
  "Figma", "UI/UX", "Tailwind CSS", "Swift", "Kotlin", "React Native"
];

const FilterPanel = ({
  filters,
  onFiltersChange,
  availableTechStacks,
  availableCompanies,
  isLoading,
  className,
}: FilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [techStackOpen, setTechStackOpen] = useState(true);
  const [creditsOpen, setCreditsOpen] = useState(true);
  const [companyOpen, setCompanyOpen] = useState(false);

  // Use available tech stacks from data, fallback to predefined options
  const techStackOptions = availableTechStacks.length > 0 
    ? availableTechStacks 
    : TECH_STACK_OPTIONS;

  const handleTechStackChange = (tech: string, checked: boolean) => {
    const newTechStack = checked
      ? [...filters.techStack, tech]
      : filters.techStack.filter((t) => t !== tech);
    onFiltersChange({ ...filters, techStack: newTechStack });
  };

  const handleCreditsChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      minCredits: values[0],
      maxCredits: values[1],
    });
  };

  const handleStipendChange = (checked: boolean) => {
    onFiltersChange({ ...filters, hasStipend: checked });
  };

  const handleCompanyChange = (companyId: string) => {
    onFiltersChange({
      ...filters,
      company: filters.company === companyId ? "" : companyId,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      techStack: [],
      minCredits: 0,
      maxCredits: 500,
      hasStipend: false,
      company: "",
    });
  };

  const activeFiltersCount =
    filters.techStack.length +
    (filters.hasStipend ? 1 : 0) +
    (filters.company ? 1 : 0) +
    (filters.minCredits > 0 || filters.maxCredits < 500 ? 1 : 0);

  const ActiveFilterChips = () => (
    <div className="flex flex-wrap gap-2">
      {filters.techStack.map((tech) => (
        <span
          key={tech}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary"
        >
          {tech}
          <button
            onClick={() => handleTechStackChange(tech, false)}
            className="hover:bg-primary/20 rounded p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      {filters.hasStipend && (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-success/10 text-success">
          Has Stipend
          <button
            onClick={() => handleStipendChange(false)}
            className="hover:bg-success/20 rounded p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}
      {(filters.minCredits > 0 || filters.maxCredits < 500) && (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-secondary text-foreground">
          {filters.minCredits}-{filters.maxCredits} Credits
          <button
            onClick={() => onFiltersChange({ ...filters, minCredits: 0, maxCredits: 500 })}
            className="hover:bg-muted rounded p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}
      {filters.company && (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-secondary text-foreground">
          {availableCompanies.find((c) => c.id === filters.company)?.name || "Company"}
          <button
            onClick={() => onFiltersChange({ ...filters, company: "" })}
            className="hover:bg-muted rounded p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}
    </div>
  );

  return (
    <div className={cn("space-y-3", className)}>
      {/* Mobile Toggle + Active Filters */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2 rounded-xl"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full bg-primary text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground gap-1"
          >
            <X className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && <ActiveFilterChips />}

      {/* Collapsible Filter Panel */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-5 animate-in slide-in-from-top-2 duration-200">
            {/* Tech Stack Filter */}
            <Collapsible open={techStackOpen} onOpenChange={setTechStackOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-foreground hover:text-primary transition-colors">
                <span className="flex items-center gap-2">
                  Tech Stack
                  {filters.techStack.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({filters.techStack.length})
                    </span>
                  )}
                </span>
                {techStackOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                  {techStackOptions.slice(0, 20).map((tech) => (
                    <label
                      key={tech}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors",
                        filters.techStack.includes(tech)
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "bg-background hover:bg-muted border border-transparent"
                      )}
                    >
                      <Checkbox
                        checked={filters.techStack.includes(tech)}
                        onCheckedChange={(checked) =>
                          handleTechStackChange(tech, checked as boolean)
                        }
                        className="w-4 h-4"
                      />
                      <span className="truncate">{tech}</span>
                    </label>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Credits Range */}
            <Collapsible open={creditsOpen} onOpenChange={setCreditsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-foreground hover:text-primary transition-colors">
                <span>Credit Range</span>
                {creditsOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 space-y-3">
                <div className="px-2">
                  <Slider
                    value={[filters.minCredits, filters.maxCredits]}
                    onValueChange={handleCreditsChange}
                    min={0}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{filters.minCredits} credits</span>
                  <span>{filters.maxCredits} credits</span>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Stipend Toggle */}
            <div className="flex items-center justify-between py-2">
              <Label
                htmlFor="stipend-toggle"
                className="text-sm font-medium cursor-pointer"
              >
                Has Stipend
              </Label>
              <Switch
                id="stipend-toggle"
                checked={filters.hasStipend}
                onCheckedChange={handleStipendChange}
              />
            </div>

            {/* Company Filter */}
            {availableCompanies.length > 0 && (
              <Collapsible open={companyOpen} onOpenChange={setCompanyOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-foreground hover:text-primary transition-colors">
                  <span>Company</span>
                  {companyOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {availableCompanies.map((company) => (
                      <button
                        key={company.id}
                        onClick={() => handleCompanyChange(company.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm transition-colors",
                          filters.company === company.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-background hover:bg-muted border border-border"
                        )}
                      >
                        {company.name}
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FilterPanel;

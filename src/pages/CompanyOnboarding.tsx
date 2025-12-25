import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  User, 
  Target, 
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Globe,
  Users,
  MapPin,
  DollarSign,
  GraduationCap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompanyOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    // Step 1: Company Info
    companyName: "",
    industry: "",
    companySize: "",
    website: "",
    linkedinUrl: "",
    headquarters: "",
    description: "",
    
    // Step 2: Contact Person
    contactFirstName: "",
    contactLastName: "",
    contactEmail: "",
    contactPhone: "",
    contactRole: "",
    
    // Step 3: Hiring Needs
    hiringRoles: [] as string[],
    requiredSkills: [] as string[],
    hiringLocations: [] as string[],
    internshipBudget: "",
    hiringTimeline: "",
    
    // Step 4: Project Preferences
    projectTypes: [] as string[],
    projectDifficulty: [] as string[],
    evaluationCriteria: [] as string[],
    companyValues: [] as string[],
  });

  const [customRole, setCustomRole] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const [customLocation, setCustomLocation] = useState("");

  const industries = [
    "Technology / Software",
    "Finance / FinTech",
    "Healthcare / HealthTech",
    "E-commerce / Retail",
    "EdTech",
    "Manufacturing",
    "Consulting",
    "Media / Entertainment",
    "Telecommunications",
    "Automotive",
    "Aerospace",
    "Energy / CleanTech",
    "Real Estate / PropTech",
    "Travel / Hospitality",
    "Other"
  ];

  const companySizes = [
    "1-10 employees (Startup)",
    "11-50 employees (Small)",
    "51-200 employees (Medium)",
    "201-500 employees (Mid-size)",
    "501-1000 employees (Large)",
    "1000+ employees (Enterprise)"
  ];

  const roleOptions = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Data Analyst",
    "ML Engineer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Product Manager",
    "UX Designer",
    "UI Designer",
    "QA Engineer",
    "Security Engineer",
    "Mobile Developer",
    "Blockchain Developer"
  ];

  const skillOptions = [
    "Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "Rust",
    "React", "Angular", "Vue.js", "Node.js", "Django", "Spring Boot",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes",
    "Machine Learning", "Data Analysis", "SQL", "NoSQL",
    "UI/UX Design", "Figma", "Product Management"
  ];

  const locationOptions = [
    "Remote",
    "Bangalore",
    "Mumbai",
    "Delhi NCR",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Kolkata",
    "San Francisco",
    "New York",
    "London",
    "Singapore"
  ];

  const projectTypeOptions = [
    { id: "frontend", label: "Frontend Development" },
    { id: "backend", label: "Backend Development" },
    { id: "fullstack", label: "Full Stack Projects" },
    { id: "mobile", label: "Mobile App Development" },
    { id: "data", label: "Data & Analytics" },
    { id: "ml", label: "Machine Learning / AI" },
    { id: "design", label: "UI/UX Design" },
    { id: "devops", label: "DevOps & Infrastructure" },
    { id: "security", label: "Security & Compliance" },
    { id: "research", label: "Research & Prototyping" },
  ];

  const evaluationOptions = [
    "Code Quality",
    "Problem-Solving Approach",
    "Communication Skills",
    "Documentation",
    "Testing Coverage",
    "Performance Optimization",
    "Security Best Practices",
    "User Experience",
    "Creativity & Innovation",
    "Deadline Adherence"
  ];

  const valueOptions = [
    "Innovation",
    "Collaboration",
    "Diversity & Inclusion",
    "Work-Life Balance",
    "Continuous Learning",
    "Customer Focus",
    "Integrity",
    "Excellence",
    "Sustainability",
    "Agility"
  ];

  const toggleArrayItem = (field: keyof typeof formData, item: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(item)) {
      setFormData({
        ...formData,
        [field]: currentArray.filter(i => i !== item)
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...currentArray, item]
      });
    }
  };

  const addCustomItem = (field: keyof typeof formData, value: string, setter: (val: string) => void) => {
    if (value.trim()) {
      const currentArray = formData[field] as string[];
      if (!currentArray.includes(value.trim())) {
        setFormData({
          ...formData,
          [field]: [...currentArray, value.trim()]
        });
      }
      setter("");
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/company");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Company Information</h2>
              <p className="text-muted-foreground mt-2">Tell us about your organization</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Company Name *</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g., Acme Corporation"
                className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Industry *</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Company Size *</label>
                <select
                  value={formData.companySize}
                  onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select size</option>
                  {companySizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.company.com"
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Headquarters</label>
                <input
                  type="text"
                  value={formData.headquarters}
                  onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                  placeholder="e.g., Bangalore, India"
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Company Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of what your company does..."
                className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Contact Person</h2>
              <p className="text-muted-foreground mt-2">Who will be managing your Heuristic account?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.contactFirstName}
                  onChange={(e) => setFormData({ ...formData, contactFirstName: e.target.value })}
                  placeholder="Alex"
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.contactLastName}
                  onChange={(e) => setFormData({ ...formData, contactLastName: e.target.value })}
                  placeholder="Morgan"
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Role / Title *</label>
              <input
                type="text"
                value={formData.contactRole}
                onChange={(e) => setFormData({ ...formData, contactRole: e.target.value })}
                placeholder="e.g., Head of Talent Acquisition"
                className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Work Email *</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="alex@company.com"
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> This person will receive notifications about submissions, have access to grade candidates, and manage hiring pipelines.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Hiring Needs</h2>
              <p className="text-muted-foreground mt-2">What kind of talent are you looking for?</p>
            </div>

            {/* Roles */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Roles You're Hiring For</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {roleOptions.map((role) => (
                  <button
                    key={role}
                    onClick={() => toggleArrayItem("hiringRoles", role)}
                    className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                      formData.hiringRoles.includes(role)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="Add custom role..."
                  className="flex-1 px-4 py-2 bg-secondary rounded-2xl text-foreground text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20"
                  onKeyPress={(e) => e.key === "Enter" && addCustomItem("hiringRoles", customRole, setCustomRole)}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl"
                  onClick={() => addCustomItem("hiringRoles", customRole, setCustomRole)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Required Skills</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {skillOptions.slice(0, 15).map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleArrayItem("requiredSkills", skill)}
                    className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                      formData.requiredSkills.includes(skill)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Add custom skill..."
                  className="flex-1 px-4 py-2 bg-secondary rounded-2xl text-foreground text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20"
                  onKeyPress={(e) => e.key === "Enter" && addCustomItem("requiredSkills", customSkill, setCustomSkill)}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl"
                  onClick={() => addCustomItem("requiredSkills", customSkill, setCustomSkill)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Locations */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Hiring Locations</label>
              <div className="flex flex-wrap gap-2">
                {locationOptions.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => toggleArrayItem("hiringLocations", loc)}
                    className={`px-3 py-1.5 rounded-xl text-sm transition-colors flex items-center gap-1 ${
                      formData.hiringLocations.includes(loc)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Internship/Entry Budget</label>
                <select
                  value={formData.internshipBudget}
                  onChange={(e) => setFormData({ ...formData, internshipBudget: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select range</option>
                  <option value="10-20k">₹10,000 - ₹20,000/month</option>
                  <option value="20-40k">₹20,000 - ₹40,000/month</option>
                  <option value="40-60k">₹40,000 - ₹60,000/month</option>
                  <option value="60k+">₹60,000+/month</option>
                  <option value="competitive">Competitive / Negotiable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Hiring Timeline</label>
                <select
                  value={formData.hiringTimeline}
                  onChange={(e) => setFormData({ ...formData, hiringTimeline: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select timeline</option>
                  <option value="immediate">Immediate (within 1 month)</option>
                  <option value="1-3months">1-3 months</option>
                  <option value="3-6months">3-6 months</option>
                  <option value="ongoing">Ongoing / Rolling basis</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Project Preferences</h2>
              <p className="text-muted-foreground mt-2">What kind of challenges will you post?</p>
            </div>

            {/* Project Types */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Types of Projects</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {projectTypeOptions.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => toggleArrayItem("projectTypes", type.id)}
                    className={`p-3 rounded-2xl border-2 text-center transition-all ${
                      formData.projectTypes.includes(type.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="text-xs font-medium text-foreground">{type.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Project Difficulty Levels</label>
              <div className="flex gap-3">
                {["Easy", "Medium", "Hard"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => toggleArrayItem("projectDifficulty", diff)}
                    className={`flex-1 p-4 rounded-2xl border-2 text-center transition-all ${
                      formData.projectDifficulty.includes(diff)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className={`font-medium ${
                      diff === "Easy" ? "text-success" :
                      diff === "Medium" ? "text-warning" :
                      "text-destructive"
                    }`}>{diff}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Evaluation Criteria */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Important Evaluation Criteria</label>
              <div className="flex flex-wrap gap-2">
                {evaluationOptions.map((criteria) => (
                  <button
                    key={criteria}
                    onClick={() => toggleArrayItem("evaluationCriteria", criteria)}
                    className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                      formData.evaluationCriteria.includes(criteria)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {criteria}
                  </button>
                ))}
              </div>
            </div>

            {/* Company Values */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Company Values (helps match culture fit)</label>
              <div className="flex flex-wrap gap-2">
                {valueOptions.map((value) => (
                  <button
                    key={value}
                    onClick={() => toggleArrayItem("companyValues", value)}
                    className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                      formData.companyValues.includes(value)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-success" />
                <span className="font-medium text-foreground">Ready to Find Top Talent!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You can now post challenges, review submissions, grade candidates, and make direct hires through Heuristic.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepLabels = [
    { step: 1, label: "Company", icon: <Building2 className="w-4 h-4" /> },
    { step: 2, label: "Contact", icon: <User className="w-4 h-4" /> },
    { step: 3, label: "Hiring", icon: <Target className="w-4 h-4" /> },
    { step: 4, label: "Projects", icon: <Briefcase className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold font-display text-foreground">Heuristic</span>
          </a>
          <p className="text-muted-foreground mt-2">Company Onboarding</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {stepLabels.map((item, idx) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                  currentStep === item.step 
                    ? "bg-primary text-primary-foreground" 
                    : currentStep > item.step
                    ? "bg-success text-success-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {currentStep > item.step ? <Check className="w-4 h-4" /> : item.icon}
                  <span className="text-sm font-medium hidden md:inline">{item.label}</span>
                </div>
                {idx < stepLabels.length - 1 && (
                  <div className={`w-8 md:w-20 h-0.5 mx-2 ${
                    currentStep > item.step ? "bg-success" : "bg-border"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-3xl border border-border p-8 shadow-lg">
          {renderStep()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="rounded-2xl gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button onClick={handleNext} className="rounded-2xl gap-2">
              {currentStep === totalSteps ? (
                <>
                  Complete Setup
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        <p className="text-center mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/company" className="text-primary font-medium hover:underline">
            Skip to Dashboard
          </a>
        </p>
      </div>
    </div>
  );
};

export default CompanyOnboarding;

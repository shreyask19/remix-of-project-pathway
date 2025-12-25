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
  MapPin,
  AlertCircle,
  Linkedin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

const CompanyOnboarding = () => {
  const navigate = useNavigate();
  const { updateUser, setIsOnboarded } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    website: "",
    linkedinUrl: "",
    headquarters: "",
    description: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    contactRole: "",
    hiringRoles: [] as string[],
    requiredSkills: [] as string[],
    hiringLocations: [] as string[],
    internshipBudget: "",
    hiringTimeline: "",
    projectTypes: [] as string[],
    evaluationCriteria: [] as string[],
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
    "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "Data Scientist", "ML Engineer", "DevOps Engineer", "Product Manager", "UX Designer"
  ];

  const skillOptions = [
    "Python", "JavaScript", "TypeScript", "Java", "C++",
    "React", "Node.js", "Django", "AWS", "Docker",
    "Machine Learning", "SQL", "UI/UX Design"
  ];

  const locationOptions = ["Remote", "Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Chennai", "Pune", "San Francisco", "New York"];

  const projectTypeOptions = [
    { id: "frontend", label: "Frontend Development" },
    { id: "backend", label: "Backend Development" },
    { id: "fullstack", label: "Full Stack Projects" },
    { id: "data", label: "Data & Analytics" },
    { id: "ml", label: "Machine Learning / AI" },
    { id: "design", label: "UI/UX Design" },
  ];

  const evaluationOptions = [
    "Code Quality", "Problem-Solving", "Communication", "Documentation",
    "Testing Coverage", "Performance", "Security", "Creativity"
  ];

  const toggleArrayItem = (field: keyof typeof formData, item: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(item)) {
      setFormData({ ...formData, [field]: currentArray.filter(i => i !== item) });
    } else {
      setFormData({ ...formData, [field]: [...currentArray, item] });
    }
  };

  const addCustomItem = (field: keyof typeof formData, value: string, setter: (val: string) => void) => {
    if (value.trim()) {
      const currentArray = formData[field] as string[];
      if (!currentArray.includes(value.trim())) {
        setFormData({ ...formData, [field]: [...currentArray, value.trim()] });
      }
      setter("");
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
      if (!formData.industry) newErrors.industry = "Industry is required";
      if (!formData.companySize) newErrors.companySize = "Company size is required";
    }
    
    if (step === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.age.trim()) newErrors.age = "Age is required";
      if (!formData.contactRole.trim()) newErrors.contactRole = "Role is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      updateUser({ ...formData, role: "company" });
      setIsOnboarded(true);
      toast.success(`Welcome, ${formData.firstName}! Start posting challenges.`);
      navigate("/company");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const inputClass = (field: string) => 
    `w-full px-4 py-3.5 bg-secondary/50 rounded-xl text-foreground border transition-all outline-none focus:ring-2 focus:ring-primary/20 ${
      errors[field] ? "border-destructive" : "border-transparent focus:border-primary/30"
    }`;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Company Information</h2>
              <p className="text-muted-foreground mt-2">Tell us about your organization</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Company Name <span className="text-destructive">*</span></label>
              <input type="text" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} placeholder="e.g., Acme Corporation" className={inputClass("companyName")} />
              {errors.companyName && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.companyName}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Industry <span className="text-destructive">*</span></label>
                <select value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className={inputClass("industry")}>
                  <option value="">Select industry</option>
                  {industries.map((ind) => (<option key={ind} value={ind}>{ind}</option>))}
                </select>
                {errors.industry && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.industry}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Company Size <span className="text-destructive">*</span></label>
                <select value={formData.companySize} onChange={(e) => setFormData({ ...formData, companySize: e.target.value })} className={inputClass("companySize")}>
                  <option value="">Select size</option>
                  {companySizes.map((size) => (<option key={size} value={size}>{size}</option>))}
                </select>
                {errors.companySize && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.companySize}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2"><Globe className="w-4 h-4 inline mr-1" />Website</label>
                <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://company.com" className={inputClass("website")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2"><MapPin className="w-4 h-4 inline mr-1" />Headquarters</label>
                <input type="text" value={formData.headquarters} onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })} placeholder="e.g., Bangalore, India" className={inputClass("headquarters")} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Company Description</label>
              <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of what your company does..." className={`${inputClass("description")} resize-none`} />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Contact Person</h2>
              <p className="text-muted-foreground mt-2">Who will be managing your Heuristic account?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">First Name <span className="text-destructive">*</span></label>
                <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder="Alex" className={inputClass("firstName")} />
                {errors.firstName && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last Name <span className="text-destructive">*</span></label>
                <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder="Morgan" className={inputClass("lastName")} />
                {errors.lastName && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Age <span className="text-destructive">*</span></label>
                <input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} placeholder="30" className={inputClass("age")} />
                {errors.age && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.age}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number <span className="text-destructive">*</span></label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" className={inputClass("phone")} />
                {errors.phone && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Work Email <span className="text-destructive">*</span></label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="alex@company.com" className={inputClass("email")} />
              {errors.email && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Role / Title <span className="text-destructive">*</span></label>
              <input type="text" value={formData.contactRole} onChange={(e) => setFormData({ ...formData, contactRole: e.target.value })} placeholder="e.g., Head of Talent Acquisition" className={inputClass("contactRole")} />
              {errors.contactRole && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.contactRole}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Hiring Needs</h2>
              <p className="text-muted-foreground mt-2">What kind of talent are you looking for?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Roles You're Hiring For</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {roleOptions.map((role) => (
                  <button key={role} type="button" onClick={() => toggleArrayItem("hiringRoles", role)}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${formData.hiringRoles.includes(role) ? "bg-purple-500 text-white shadow-md" : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                    {role}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={customRole} onChange={(e) => setCustomRole(e.target.value)} placeholder="Add custom role..." className="flex-1 px-4 py-2.5 bg-secondary/50 rounded-xl text-foreground text-sm border-0 outline-none" onKeyPress={(e) => e.key === "Enter" && addCustomItem("hiringRoles", customRole, setCustomRole)} />
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => addCustomItem("hiringRoles", customRole, setCustomRole)}><Plus className="w-4 h-4" /></Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Required Skills</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {skillOptions.map((skill) => (
                  <button key={skill} type="button" onClick={() => toggleArrayItem("requiredSkills", skill)}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${formData.requiredSkills.includes(skill) ? "bg-purple-500 text-white shadow-md" : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                    {skill}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} placeholder="Add custom skill..." className="flex-1 px-4 py-2.5 bg-secondary/50 rounded-xl text-foreground text-sm border-0 outline-none" onKeyPress={(e) => e.key === "Enter" && addCustomItem("requiredSkills", customSkill, setCustomSkill)} />
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => addCustomItem("requiredSkills", customSkill, setCustomSkill)}><Plus className="w-4 h-4" /></Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Hiring Locations</label>
              <div className="flex flex-wrap gap-2">
                {locationOptions.map((loc) => (
                  <button key={loc} type="button" onClick={() => toggleArrayItem("hiringLocations", loc)}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${formData.hiringLocations.includes(loc) ? "bg-purple-500 text-white shadow-md" : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Project Preferences</h2>
              <p className="text-muted-foreground mt-2">What kind of challenges will you create?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Project Types You'll Post</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {projectTypeOptions.map((type) => (
                  <button key={type.id} type="button" onClick={() => toggleArrayItem("projectTypes", type.id)}
                    className={`p-3 rounded-xl text-sm transition-all text-left ${formData.projectTypes.includes(type.id) ? "bg-purple-500 text-white shadow-md" : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Evaluation Criteria</label>
              <div className="flex flex-wrap gap-2">
                {evaluationOptions.map((criteria) => (
                  <button key={criteria} type="button" onClick={() => toggleArrayItem("evaluationCriteria", criteria)}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${formData.evaluationCriteria.includes(criteria) ? "bg-purple-500 text-white shadow-md" : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                    {criteria}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Internship Budget (per project)</label>
                <select value={formData.internshipBudget} onChange={(e) => setFormData({ ...formData, internshipBudget: e.target.value })} className={inputClass("internshipBudget")}>
                  <option value="">Select budget</option>
                  <option value="unpaid">Unpaid (Credits only)</option>
                  <option value="5k-15k">₹5,000 - ₹15,000</option>
                  <option value="15k-30k">₹15,000 - ₹30,000</option>
                  <option value="30k+">₹30,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Hiring Timeline</label>
                <select value={formData.hiringTimeline} onChange={(e) => setFormData({ ...formData, hiringTimeline: e.target.value })} className={inputClass("hiringTimeline")}>
                  <option value="">Select timeline</option>
                  <option value="immediate">Immediate</option>
                  <option value="1-3months">1-3 months</option>
                  <option value="3-6months">3-6 months</option>
                  <option value="6months+">6+ months</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-success/10 border border-success/20">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">Ready to post challenges!</h4>
                  <p className="text-sm text-muted-foreground">You can create project challenges, review student submissions, and build your hiring pipeline.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-3xl">
          <div className="flex items-center justify-between mb-3">
            <a href="/" className="flex items-center gap-2 text-foreground font-bold">
              <div className="w-8 h-8 rounded-xl bg-purple-500 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-display">Heuristic</span>
            </a>
            <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-1.5" />
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">{renderStep()}</div>

      <div className="border-t border-border bg-background/80 backdrop-blur-sm sticky bottom-0">
        <div className="container mx-auto px-4 py-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1} className="gap-2 rounded-xl">
              <ArrowLeft className="w-4 h-4" />Back
            </Button>
            <div className="flex gap-2">
              {[...Array(totalSteps)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i + 1 === currentStep ? "w-6 bg-purple-500" : i + 1 < currentStep ? "bg-purple-500" : "bg-border"}`} />
              ))}
            </div>
            <Button onClick={handleNext} className="gap-2 rounded-xl bg-purple-500 hover:bg-purple-600">
              {currentStep === totalSteps ? "Complete" : "Continue"}
              {currentStep === totalSteps ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyOnboarding;

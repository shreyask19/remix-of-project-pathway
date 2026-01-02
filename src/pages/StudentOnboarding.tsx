import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  Heart, 
  Target,
  Code,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  Briefcase,
  Globe,
  Clock,
  Linkedin,
  Github,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const StudentOnboarding = () => {
  const navigate = useNavigate();
  const { user, profile, completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill from auth profile
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    phone: "",
    universityName: "",
    universityProgram: "",
    batch: "",
    graduationYear: "",
    currentSemester: "",
    currentSubjects: [] as string[],
    existingSkills: [] as string[],
    interests: [] as string[],
    careerGoals: [] as string[],
    preferredProjectTypes: [] as string[],
    hoursPerWeek: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
  });

  // Pre-fill user data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        firstName: profile.firstName || prev.firstName,
        lastName: profile.lastName || prev.lastName,
        email: profile.email || prev.email,
        phone: profile.phone || prev.phone,
      }));
    }
  }, [profile]);

  const [customSubject, setCustomSubject] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const [customInterest, setCustomInterest] = useState("");

  const programs = [
    "Computer Science (CSE)",
    "Electronics & Communication (ECE)",
    "Electrical Engineering (EE)",
    "Mechanical Engineering (ME)",
    "Civil Engineering (CE)",
    "Information Technology (IT)",
    "Data Science",
    "Artificial Intelligence",
    "Biotechnology",
    "Chemical Engineering",
    "Aerospace Engineering",
    "Other"
  ];

  const batchOptions = ["2021", "2022", "2023", "2024", "2025", "2026"];
  const graduationYears = ["2025", "2026", "2027", "2028", "2029", "2030"];

  const commonSubjects = [
    "Data Structures & Algorithms",
    "Database Management Systems",
    "Operating Systems",
    "Computer Networks",
    "Web Development",
    "Machine Learning",
    "Artificial Intelligence",
    "Cloud Computing",
    "Cyber Security",
    "Software Engineering"
  ];

  const skillOptions = [
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C",
    "React", "Angular", "Vue.js", "Node.js", "Django", "Flask",
    "SQL", "MongoDB", "PostgreSQL", "AWS", "Docker", "Git"
  ];

  const interestOptions = [
    "Web Development", "Mobile Development", "AI/Machine Learning", "Data Science",
    "Cloud Computing", "DevOps", "Cyber Security", "Blockchain", "IoT",
    "Game Development", "UI/UX Design", "Open Source"
  ];

  const careerGoalOptions = [
    "Software Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer",
    "Data Scientist", "ML Engineer", "DevOps Engineer", "Cloud Architect",
    "Product Manager", "UX Designer", "Security Engineer", "Entrepreneur"
  ];

  const projectTypeOptions = [
    { id: "frontend", label: "Frontend Development", icon: <Code className="w-4 h-4" /> },
    { id: "backend", label: "Backend Development", icon: <Briefcase className="w-4 h-4" /> },
    { id: "fullstack", label: "Full Stack", icon: <Globe className="w-4 h-4" /> },
    { id: "data", label: "Data & Analytics", icon: <Target className="w-4 h-4" /> },
    { id: "ml", label: "Machine Learning", icon: <BookOpen className="w-4 h-4" /> },
    { id: "design", label: "UI/UX Design", icon: <Heart className="w-4 h-4" /> },
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
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.age.trim()) newErrors.age = "Age is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    }
    
    if (step === 2) {
      if (!formData.universityName.trim()) newErrors.universityName = "University name is required";
      if (!formData.universityProgram) newErrors.universityProgram = "Program is required";
      if (!formData.batch) newErrors.batch = "Batch is required";
      if (!formData.graduationYear) newErrors.graduationYear = "Graduation year is required";
    }

    if (step === 3) {
      if (formData.existingSkills.length === 0) newErrors.existingSkills = "Select at least one skill";
    }

    if (step === 4) {
      if (formData.interests.length === 0) newErrors.interests = "Select at least one interest";
      if (formData.careerGoals.length === 0) newErrors.careerGoals = "Select at least one career goal";
    }

    if (step === 5) {
      if (formData.preferredProjectTypes.length === 0) newErrors.preferredProjectTypes = "Select at least one project type";
      if (!formData.hoursPerWeek) newErrors.hoursPerWeek = "Select hours per week";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding - use atomic RPC
      setIsSubmitting(true);
      try {
        // Update profile with first/last name and phone
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
          })
          .eq("id", user?.id);

        if (profileError) throw profileError;

        // Use atomic RPC for student onboarding
        const { data: rpcResult, error: rpcError } = await supabase.rpc(
          "complete_student_onboarding",
          {
            p_user_id: user?.id,
            p_university_name: formData.universityName,
            p_university_program: formData.universityProgram,
            p_batch: formData.batch,
            p_graduation_year: formData.graduationYear,
            p_current_semester: formData.currentSemester || null,
            p_current_subjects: formData.currentSubjects,
            p_existing_skills: formData.existingSkills,
            p_interests: formData.interests,
            p_career_goals: formData.careerGoals,
            p_preferred_project_types: formData.preferredProjectTypes,
            p_linkedin_url: formData.linkedinUrl || null,
            p_github_url: formData.githubUrl || null,
            p_portfolio_url: formData.portfolioUrl || null,
            p_hours_per_week: formData.hoursPerWeek || null,
          }
        );

        if (rpcError) throw rpcError;

        const result = rpcResult as { success: boolean; error?: string };
        if (!result.success) {
          throw new Error(result.error || "Onboarding failed");
        }
        
        toast.success(`Welcome, ${formData.firstName}! Let's start building.`);
        navigate("/student");
      } catch (error: any) {
        console.error("Onboarding error:", error);
        toast.error(`Failed to complete onboarding: ${error.message || "Please try again."}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
              <p className="text-muted-foreground mt-2">Let's get to know you better</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  First Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Your first name"
                  className={inputClass("firstName")}
                />
                {errors.firstName && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Last Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Your last name"
                  className={inputClass("lastName")}
                />
                {errors.lastName && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Age <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Your age"
                  min="16"
                  max="35"
                  className={inputClass("age")}
                />
                {errors.age && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.age}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className={inputClass("phone")}
                />
                {errors.phone && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address <span className="text-destructive">*</span>
                {profile?.email && <span className="text-muted-foreground font-normal ml-2">(verified)</span>}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@university.edu"
                className={inputClass("email")}
                readOnly={!!profile?.email}
              />
              {errors.email && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Academic Information</h2>
              <p className="text-muted-foreground mt-2">Tell us about your education</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                University / College Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.universityName}
                onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                placeholder="e.g., IIT Delhi, Stanford University"
                className={inputClass("universityName")}
              />
              {errors.universityName && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.universityName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Program / Department <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.universityProgram}
                onChange={(e) => setFormData({ ...formData, universityProgram: e.target.value })}
                className={inputClass("universityProgram")}
              >
                <option value="">Select your program</option>
                {programs.map((program) => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
              {errors.universityProgram && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.universityProgram}</p>}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Batch <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  className={inputClass("batch")}
                >
                  <option value="">Select batch</option>
                  {batchOptions.map((batch) => (
                    <option key={batch} value={batch}>{batch}</option>
                  ))}
                </select>
                {errors.batch && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.batch}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Graduation Year <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  className={inputClass("graduationYear")}
                >
                  <option value="">Select year</option>
                  {graduationYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.graduationYear && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.graduationYear}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Current Semester</label>
                <select
                  value={formData.currentSemester}
                  onChange={(e) => setFormData({ ...formData, currentSemester: e.target.value })}
                  className={inputClass("currentSemester")}
                >
                  <option value="">Select</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem.toString()}>Semester {sem}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Subjects & Skills</h2>
              <p className="text-muted-foreground mt-2">What are you studying and what can you do?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Current Semester Subjects</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {commonSubjects.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleArrayItem("currentSubjects", subject)}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${
                      formData.currentSubjects.includes(subject)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Add custom subject"
                  className="flex-1 px-3 py-2 bg-secondary/50 rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomItem("currentSubjects", customSubject, setCustomSubject))}
                />
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  className="rounded-xl"
                  onClick={() => addCustomItem("currentSubjects", customSubject, setCustomSubject)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.currentSubjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.currentSubjects.filter(s => !commonSubjects.includes(s)).map((subject) => (
                    <span key={subject} className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm flex items-center gap-2">
                      {subject}
                      <button onClick={() => toggleArrayItem("currentSubjects", subject)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Existing Skills <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleArrayItem("existingSkills", skill)}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${
                      formData.existingSkills.includes(skill)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
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
                  placeholder="Add custom skill"
                  className="flex-1 px-3 py-2 bg-secondary/50 rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomItem("existingSkills", customSkill, setCustomSkill))}
                />
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  className="rounded-xl"
                  onClick={() => addCustomItem("existingSkills", customSkill, setCustomSkill)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {errors.existingSkills && <p className="text-xs text-destructive mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.existingSkills}</p>}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Interests & Goals</h2>
              <p className="text-muted-foreground mt-2">What excites you and where do you want to go?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Areas of Interest <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleArrayItem("interests", interest)}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${
                      formData.interests.includes(interest)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  placeholder="Add custom interest"
                  className="flex-1 px-3 py-2 bg-secondary/50 rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomItem("interests", customInterest, setCustomInterest))}
                />
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  className="rounded-xl"
                  onClick={() => addCustomItem("interests", customInterest, setCustomInterest)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {errors.interests && <p className="text-xs text-destructive mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.interests}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Career Goals <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {careerGoalOptions.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleArrayItem("careerGoals", goal)}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${
                      formData.careerGoals.includes(goal)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
              {errors.careerGoals && <p className="text-xs text-destructive mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.careerGoals}</p>}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Project Preferences</h2>
              <p className="text-muted-foreground mt-2">Help us match you with the right projects</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Preferred Project Types <span className="text-destructive">*</span>
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {projectTypeOptions.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => toggleArrayItem("preferredProjectTypes", type.id)}
                    className={`p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                      formData.preferredProjectTypes.includes(type.id)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {type.icon}
                    <span>{type.label}</span>
                    {formData.preferredProjectTypes.includes(type.id) && (
                      <Check className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
              {errors.preferredProjectTypes && <p className="text-xs text-destructive mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.preferredProjectTypes}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Available Hours per Week <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {["5-10", "10-15", "15-20", "20+"].map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => setFormData({ ...formData, hoursPerWeek: hours })}
                    className={`p-3 rounded-xl text-center transition-all ${
                      formData.hoursPerWeek === hours
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    <Clock className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">{hours} hrs</span>
                  </button>
                ))}
              </div>
              {errors.hoursPerWeek && <p className="text-xs text-destructive mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.hoursPerWeek}</p>}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-foreground">Professional Links (Optional)</label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full pl-10 pr-4 py-3.5 bg-secondary/50 rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/yourusername"
                  className="w-full pl-10 pr-4 py-3.5 bg-secondary/50 rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  placeholder="https://yourportfolio.com"
                  className="w-full pl-10 pr-4 py-3.5 bg-secondary/50 rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
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
      {/* Progress Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm font-medium text-primary">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {renderStep()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="gap-2 rounded-xl min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : currentStep === totalSteps ? (
                <>
                  Complete
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
      </div>
    </div>
  );
};

export default StudentOnboarding;

import { useState } from "react";
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
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const StudentOnboarding = () => {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();
  const { saveProfile } = useStudentProfile();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Complete onboarding - save to database
      setIsSubmitting(true);
      try {
        // Update profile with first/last name and phone
        await supabase
          .from("profiles")
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
          })
          .eq("id", user?.id);

        // Save student profile
        await saveProfile.mutateAsync({
          universityName: formData.universityName,
          universityProgram: formData.universityProgram,
          batch: formData.batch,
          graduationYear: formData.graduationYear,
          currentSemester: formData.currentSemester,
          currentSubjects: formData.currentSubjects,
          existingSkills: formData.existingSkills,
          interests: formData.interests,
          careerGoals: formData.careerGoals,
          preferredProjectTypes: formData.preferredProjectTypes,
          linkedinUrl: formData.linkedinUrl,
          githubUrl: formData.githubUrl,
          portfolioUrl: formData.portfolioUrl,
          hoursPerWeek: formData.hoursPerWeek,
        });

        // Mark onboarding as complete
        await completeOnboarding();
        
        toast.success(`Welcome, ${formData.firstName}! Let's start building.`);
        navigate("/student");
      } catch (error) {
        console.error("Onboarding error:", error);
        toast.error("Failed to complete onboarding. Please try again.");
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
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@university.edu"
                className={inputClass("email")}
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
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
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
                  placeholder="Add custom subject..."
                  className="flex-1 px-4 py-2.5 bg-secondary/50 rounded-xl text-foreground text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20"
                  onKeyPress={(e) => e.key === "Enter" && addCustomItem("currentSubjects", customSubject, setCustomSubject)}
                />
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => addCustomItem("currentSubjects", customSubject, setCustomSubject)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.currentSubjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.currentSubjects.map((subject) => (
                    <span key={subject} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm">
                      {subject}
                      <button type="button" onClick={() => toggleArrayItem("currentSubjects", subject)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Technical Skills</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleArrayItem("existingSkills", skill)}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${
                      formData.existingSkills.includes(skill)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
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
                  className="flex-1 px-4 py-2.5 bg-secondary/50 rounded-xl text-foreground text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20"
                  onKeyPress={(e) => e.key === "Enter" && addCustomItem("existingSkills", customSkill, setCustomSkill)}
                />
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => addCustomItem("existingSkills", customSkill, setCustomSkill)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
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
              <p className="text-muted-foreground mt-2">Help us personalize your experience</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Areas of Interest</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleArrayItem("interests", interest)}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${
                      formData.interests.includes(interest)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
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
                  placeholder="Add custom interest..."
                  className="flex-1 px-4 py-2.5 bg-secondary/50 rounded-xl text-foreground text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20"
                  onKeyPress={(e) => e.key === "Enter" && addCustomItem("interests", customInterest, setCustomInterest)}
                />
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => addCustomItem("interests", customInterest, setCustomInterest)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Career Goals</label>
              <div className="flex flex-wrap gap-2">
                {careerGoalOptions.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleArrayItem("careerGoals", goal)}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${
                      formData.careerGoals.includes(goal)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Preferred Project Types</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {projectTypeOptions.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => toggleArrayItem("preferredProjectTypes", type.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm transition-all ${
                      formData.preferredProjectTypes.includes(type.id)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Online Presence</h2>
              <p className="text-muted-foreground mt-2">Connect your professional profiles</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Hours Available Per Week</label>
              <select
                value={formData.hoursPerWeek}
                onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                className={inputClass("hoursPerWeek")}
              >
                <option value="">Select availability</option>
                <option value="5-10">5-10 hours/week</option>
                <option value="10-15">10-15 hours/week</option>
                <option value="15-20">15-20 hours/week</option>
                <option value="20+">20+ hours/week</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Linkedin className="w-4 h-4 inline mr-2" />
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
                className={inputClass("linkedinUrl")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Github className="w-4 h-4 inline mr-2" />
                GitHub Profile
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/yourusername"
                className={inputClass("githubUrl")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Globe className="w-4 h-4 inline mr-2" />
                Portfolio Website
              </label>
              <input
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                placeholder="https://yourportfolio.com"
                className={inputClass("portfolioUrl")}
              />
            </div>

            <div className="p-4 rounded-2xl bg-success/10 border border-success/20">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">Almost done!</h4>
                  <p className="text-sm text-muted-foreground">Your profile will be used to recommend personalized projects and connect you with companies looking for your skills.</p>
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
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Progress Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-3xl">
          <div className="flex items-center justify-between mb-3">
            <a href="/" className="flex items-center gap-2 text-foreground font-bold">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display">Heuristic</span>
            </a>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-1.5" />
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        {renderStep()}
      </div>

      {/* Navigation Footer */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm sticky bottom-0">
        <div className="container mx-auto px-4 py-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex gap-2">
              {[...Array(totalSteps)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i + 1 === currentStep
                      ? "w-6 bg-primary"
                      : i + 1 < currentStep
                      ? "bg-primary"
                      : "bg-border"
                  }`}
                />
              ))}
            </div>

            <Button onClick={handleNext} className="gap-2 rounded-xl" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {currentStep === totalSteps ? "Complete" : "Continue"}
                  {currentStep === totalSteps ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
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

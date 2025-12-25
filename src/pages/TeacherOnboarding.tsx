import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  Settings,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Building2,
  AlertCircle,
  Linkedin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import HeuristicLogo from "@/components/HeuristicLogo";

const TeacherOnboarding = () => {
  const navigate = useNavigate();
  const { updateUser, setIsOnboarded } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    phone: "",
    designation: "",
    institutionName: "",
    institutionType: "",
    department: "",
    batch: "",
    graduationYear: "",
    employeeId: "",
    yearsOfExperience: "",
    subjectsTaught: [] as string[],
    specializations: [] as string[],
    linkedinUrl: "",
    classSize: "",
    gradingPreference: "",
    communicationPreference: [] as string[],
  });

  const [customSubject, setCustomSubject] = useState("");
  const [customSpecialization, setCustomSpecialization] = useState("");

  const designations = [
    "Assistant Professor",
    "Associate Professor",
    "Professor",
    "Lecturer",
    "Senior Lecturer",
    "Teaching Assistant",
    "Lab Instructor",
    "Department Head",
    "Dean",
    "Other"
  ];

  const institutionTypes = [
    "University",
    "Engineering College",
    "Arts & Science College",
    "Polytechnic",
    "IIT",
    "NIT",
    "IIIT",
    "Private University",
    "Deemed University",
    "Other"
  ];

  const departments = [
    "Computer Science & Engineering",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Information Technology",
    "Data Science",
    "Artificial Intelligence",
    "Mathematics",
    "Physics",
    "Other"
  ];

  const subjectOptions = [
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

  const specializationOptions = [
    "Machine Learning & AI",
    "Data Science",
    "Cloud Computing",
    "Cyber Security",
    "IoT & Embedded Systems",
    "Web Technologies",
    "Mobile Development",
    "Computer Vision",
    "Natural Language Processing"
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
      if (!formData.designation) newErrors.designation = "Designation is required";
    }
    
    if (step === 2) {
      if (!formData.institutionName.trim()) newErrors.institutionName = "Institution name is required";
      if (!formData.institutionType) newErrors.institutionType = "Institution type is required";
      if (!formData.department) newErrors.department = "Department is required";
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
      updateUser({ ...formData, role: "teacher" });
      setIsOnboarded(true);
      toast.success(`Welcome, ${formData.firstName}! Your dashboard is ready.`);
      navigate("/teacher");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const inputClass = (field: string) => 
    `w-full px-4 py-3 bg-secondary rounded-lg text-foreground border transition-all outline-none focus:ring-2 focus:ring-primary/20 ${
      errors[field] ? "border-destructive" : "border-transparent focus:border-primary/30"
    }`;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Personal Information</h2>
              <p className="text-muted-foreground mt-2">Let's set up your faculty profile</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">First Name <span className="text-destructive">*</span></label>
                <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder="Dr. John" className={inputClass("firstName")} />
                {errors.firstName && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last Name <span className="text-destructive">*</span></label>
                <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder="Smith" className={inputClass("lastName")} />
                {errors.lastName && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Age <span className="text-destructive">*</span></label>
                <input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} placeholder="35" className={inputClass("age")} />
                {errors.age && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.age}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number <span className="text-destructive">*</span></label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" className={inputClass("phone")} />
                {errors.phone && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address <span className="text-destructive">*</span></label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john.smith@university.edu" className={inputClass("email")} />
              {errors.email && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Designation <span className="text-destructive">*</span></label>
              <select value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className={inputClass("designation")}>
                <option value="">Select your designation</option>
                {designations.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
              {errors.designation && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.designation}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Institution Details</h2>
              <p className="text-muted-foreground mt-2">Tell us about your institution</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Institution Name <span className="text-destructive">*</span></label>
              <input type="text" value={formData.institutionName} onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })} placeholder="e.g., IIT Delhi" className={inputClass("institutionName")} />
              {errors.institutionName && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.institutionName}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Institution Type <span className="text-destructive">*</span></label>
                <select value={formData.institutionType} onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })} className={inputClass("institutionType")}>
                  <option value="">Select type</option>
                  {institutionTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                </select>
                {errors.institutionType && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.institutionType}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Department <span className="text-destructive">*</span></label>
                <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className={inputClass("department")}>
                  <option value="">Select department</option>
                  {departments.map((dept) => (<option key={dept} value={dept}>{dept}</option>))}
                </select>
                {errors.department && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.department}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Employee ID</label>
                <input type="text" value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} placeholder="EMP12345" className={inputClass("employeeId")} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Years of Experience</label>
                <select value={formData.yearsOfExperience} onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })} className={inputClass("yearsOfExperience")}>
                  <option value="">Select</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-15">11-15 years</option>
                  <option value="15+">15+ years</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Subjects & Expertise</h2>
              <p className="text-muted-foreground mt-2">What do you teach and specialize in?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Subjects You Teach</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {subjectOptions.map((subject) => (
                  <button key={subject} type="button" onClick={() => toggleArrayItem("subjectsTaught", subject)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${formData.subjectsTaught.includes(subject) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                    {subject}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} placeholder="Add custom subject..." className="flex-1 px-4 py-2.5 bg-secondary rounded-lg text-foreground text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20" onKeyPress={(e) => e.key === "Enter" && addCustomItem("subjectsTaught", customSubject, setCustomSubject)} />
                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => addCustomItem("subjectsTaught", customSubject, setCustomSubject)}><Plus className="w-4 h-4" /></Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Areas of Specialization</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {specializationOptions.map((spec) => (
                  <button key={spec} type="button" onClick={() => toggleArrayItem("specializations", spec)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${formData.specializations.includes(spec) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                    {spec}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={customSpecialization} onChange={(e) => setCustomSpecialization(e.target.value)} placeholder="Add custom specialization..." className="flex-1 px-4 py-2.5 bg-secondary rounded-lg text-foreground text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20" onKeyPress={(e) => e.key === "Enter" && addCustomItem("specializations", customSpecialization, setCustomSpecialization)} />
                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => addCustomItem("specializations", customSpecialization, setCustomSpecialization)}><Plus className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Preferences</h2>
              <p className="text-muted-foreground mt-2">Customize your Heuristic experience</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Average Class Size</label>
                <select value={formData.classSize} onChange={(e) => setFormData({ ...formData, classSize: e.target.value })} className={inputClass("classSize")}>
                  <option value="">Select</option>
                  <option value="1-30">1-30 students</option>
                  <option value="31-60">31-60 students</option>
                  <option value="61-100">61-100 students</option>
                  <option value="100+">100+ students</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Grading Preference</label>
                <select value={formData.gradingPreference} onChange={(e) => setFormData({ ...formData, gradingPreference: e.target.value })} className={inputClass("gradingPreference")}>
                  <option value="">Select</option>
                  <option value="auto">Auto-approve company grades</option>
                  <option value="review">Review each grade manually</option>
                  <option value="hybrid">Hybrid (auto for high scores)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2"><Linkedin className="w-4 h-4 inline mr-2" />LinkedIn Profile</label>
              <input type="url" value={formData.linkedinUrl} onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/yourprofile" className={inputClass("linkedinUrl")} />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Communication Preferences</label>
              <div className="flex flex-wrap gap-2">
                {["Email Notifications", "Weekly Reports", "Student Alerts", "Deadline Reminders", "Grade Updates"].map((pref) => (
                  <button key={pref} type="button" onClick={() => toggleArrayItem("communicationPreference", pref)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${formData.communicationPreference.includes(pref) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">You're all set!</h4>
                  <p className="text-sm text-muted-foreground">Your faculty dashboard will help you monitor student progress, approve assessments, and manage academic controls.</p>
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
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-3xl">
          <div className="flex items-center justify-between mb-3">
            <a href="/">
              <HeuristicLogo size="sm" />
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
            <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1} className="gap-2 rounded-lg">
              <ArrowLeft className="w-4 h-4" />Back
            </Button>
            <div className="flex gap-2">
              {[...Array(totalSteps)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i + 1 === currentStep ? "w-6 bg-primary" : i + 1 < currentStep ? "bg-primary" : "bg-border"}`} />
              ))}
            </div>
            <Button onClick={handleNext} className="gap-2 rounded-lg">
              {currentStep === totalSteps ? "Complete" : "Continue"}
              {currentStep === totalSteps ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherOnboarding;
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
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    phone: "",
    
    // Step 2: Academic Info
    universityName: "",
    universityProgram: "",
    currentSemester: "",
    expectedGraduation: "",
    cgpa: "",
    
    // Step 3: Subjects & Skills
    currentSubjects: [] as string[],
    existingSkills: [] as string[],
    programmingLanguages: [] as string[],
    
    // Step 4: Interests & Goals
    interests: [] as string[],
    careerGoals: [] as string[],
    preferredProjectTypes: [] as string[],
    
    // Step 5: Availability & Links
    hoursPerWeek: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    previousExperience: "",
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
    "Software Engineering",
    "Digital Electronics",
    "Signal Processing",
    "Embedded Systems",
    "IoT",
    "Blockchain",
    "Mobile App Development"
  ];

  const skillOptions = [
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C", "Go", "Rust",
    "React", "Angular", "Vue.js", "Node.js", "Django", "Flask", "Spring Boot",
    "SQL", "MongoDB", "PostgreSQL", "Redis", "AWS", "Azure", "GCP", "Docker",
    "Kubernetes", "Git", "Linux", "Figma", "UI/UX Design", "Data Analysis"
  ];

  const interestOptions = [
    "Web Development", "Mobile Development", "AI/Machine Learning", "Data Science",
    "Cloud Computing", "DevOps", "Cyber Security", "Blockchain", "IoT",
    "Game Development", "AR/VR", "UI/UX Design", "Product Management",
    "Open Source", "Competitive Programming", "Research", "Startups"
  ];

  const careerGoalOptions = [
    "Software Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer",
    "Data Scientist", "ML Engineer", "DevOps Engineer", "Cloud Architect",
    "Product Manager", "UX Designer", "Security Engineer", "Research Scientist",
    "Entrepreneur", "Tech Lead", "Engineering Manager"
  ];

  const projectTypeOptions = [
    { id: "frontend", label: "Frontend Development", icon: <Code className="w-5 h-5" /> },
    { id: "backend", label: "Backend Development", icon: <Briefcase className="w-5 h-5" /> },
    { id: "fullstack", label: "Full Stack", icon: <Globe className="w-5 h-5" /> },
    { id: "mobile", label: "Mobile Apps", icon: <Award className="w-5 h-5" /> },
    { id: "data", label: "Data & Analytics", icon: <Target className="w-5 h-5" /> },
    { id: "ml", label: "Machine Learning", icon: <BookOpen className="w-5 h-5" /> },
    { id: "design", label: "UI/UX Design", icon: <Heart className="w-5 h-5" /> },
    { id: "devops", label: "DevOps & Cloud", icon: <Clock className="w-5 h-5" /> },
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
      // Complete onboarding
      navigate("/student");
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
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Let's get to know you</h2>
              <p className="text-muted-foreground mt-2">Tell us about yourself to personalize your experience</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Age *</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="20"
                  min="16"
                  max="35"
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.doe@university.edu"
                className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Academic Information</h2>
              <p className="text-muted-foreground mt-2">Help us understand your academic background</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">University / College Name *</label>
              <input
                type="text"
                value={formData.universityName}
                onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                placeholder="e.g., Stanford University"
                className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Program / Branch *</label>
              <select
                value={formData.universityProgram}
                onChange={(e) => setFormData({ ...formData, universityProgram: e.target.value })}
                className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select your program</option>
                {programs.map((program) => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Current Semester *</label>
                <select
                  value={formData.currentSemester}
                  onChange={(e) => setFormData({ ...formData, currentSemester: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Expected Graduation</label>
                <select
                  value={formData.expectedGraduation}
                  onChange={(e) => setFormData({ ...formData, expectedGraduation: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select year</option>
                  {[2024, 2025, 2026, 2027, 2028].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">CGPA (Optional)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  placeholder="8.5"
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Subjects & Skills</h2>
              <p className="text-muted-foreground mt-2">What are you currently studying and what can you do?</p>
            </div>

            {/* Current Subjects */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Current Semester Subjects</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {commonSubjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => toggleArrayItem("currentSubjects", subject)}
                    className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                      formData.currentSubjects.includes(subject)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
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
                  className="flex-1 px-4 py-2 bg-secondary rounded-2xl text-foreground text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20"
                  onKeyPress={(e) => e.key === "Enter" && addCustomItem("currentSubjects", customSubject, setCustomSubject)}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl"
                  onClick={() => addCustomItem("currentSubjects", customSubject, setCustomSubject)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.currentSubjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.currentSubjects.map((subject) => (
                    <span key={subject} className="flex items-center gap-1 px-3 py-1 rounded-xl bg-primary/10 text-primary text-sm">
                      {subject}
                      <button onClick={() => toggleArrayItem("currentSubjects", subject)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Existing Skills */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Technical Skills You Have</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleArrayItem("existingSkills", skill)}
                    className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                      formData.existingSkills.includes(skill)
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
                  onKeyPress={(e) => e.key === "Enter" && addCustomItem("existingSkills", customSkill, setCustomSkill)}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl"
                  onClick={() => addCustomItem("existingSkills", customSkill, setCustomSkill)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Interests & Career Goals</h2>
              <p className="text-muted-foreground mt-2">What excites you and where do you see yourself?</p>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Areas of Interest</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleArrayItem("interests", interest)}
                    className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                      formData.interests.includes(interest)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
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
                  className="flex-1 px-4 py-2 bg-secondary rounded-2xl text-foreground text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20"
                  onKeyPress={(e) => e.key === "Enter" && addCustomItem("interests", customInterest, setCustomInterest)}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl"
                  onClick={() => addCustomItem("interests", customInterest, setCustomInterest)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Career Goals */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Career Goals</label>
              <div className="flex flex-wrap gap-2">
                {careerGoalOptions.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => toggleArrayItem("careerGoals", goal)}
                    className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                      formData.careerGoals.includes(goal)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Project Types */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Preferred Project Types</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {projectTypeOptions.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => toggleArrayItem("preferredProjectTypes", type.id)}
                    className={`p-4 rounded-2xl border-2 transition-all text-center ${
                      formData.preferredProjectTypes.includes(type.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ${
                      formData.preferredProjectTypes.includes(type.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {type.icon}
                    </div>
                    <p className="text-sm font-medium text-foreground">{type.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Almost Done!</h2>
              <p className="text-muted-foreground mt-2">A few more details to complete your profile</p>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Hours Available Per Week for Projects</label>
              <select
                value={formData.hoursPerWeek}
                onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select availability</option>
                <option value="5-10">5-10 hours</option>
                <option value="10-15">10-15 hours</option>
                <option value="15-20">15-20 hours</option>
                <option value="20-25">20-25 hours</option>
                <option value="25+">25+ hours</option>
              </select>
            </div>

            {/* Social Links */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">LinkedIn Profile</label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">GitHub Profile</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/yourusername"
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Portfolio Website (Optional)</label>
              <input
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                placeholder="https://yourportfolio.com"
                className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Previous Experience */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Previous Internship/Project Experience (Optional)</label>
              <textarea
                rows={4}
                value={formData.previousExperience}
                onChange={(e) => setFormData({ ...formData, previousExperience: e.target.value })}
                placeholder="Briefly describe any previous internships, projects, or relevant experience..."
                className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            {/* Summary Card */}
            <div className="p-4 rounded-2xl bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-success" />
                <span className="font-medium text-foreground">Ready to Start!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                We'll use this information to recommend projects that match your skills, interests, and academic requirements.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepLabels = [
    { step: 1, label: "Personal", icon: <User className="w-4 h-4" /> },
    { step: 2, label: "Academic", icon: <GraduationCap className="w-4 h-4" /> },
    { step: 3, label: "Skills", icon: <Code className="w-4 h-4" /> },
    { step: 4, label: "Interests", icon: <Heart className="w-4 h-4" /> },
    { step: 5, label: "Finish", icon: <Target className="w-4 h-4" /> },
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
                  <div className={`w-8 md:w-16 h-0.5 mx-2 ${
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

        {/* Skip Option */}
        <p className="text-center mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/student" className="text-primary font-medium hover:underline">
            Skip to Dashboard
          </a>
        </p>
      </div>
    </div>
  );
};

export default StudentOnboarding;

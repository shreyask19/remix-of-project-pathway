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
  X,
  Users,
  Award,
  Building2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeacherOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    designation: "",
    
    // Step 2: Institution Info
    institutionName: "",
    institutionType: "",
    department: "",
    employeeId: "",
    yearsOfExperience: "",
    
    // Step 3: Academic Details
    subjectsTaught: [] as string[],
    specializations: [] as string[],
    researchAreas: [] as string[],
    
    // Step 4: Preferences
    classSize: "",
    gradingPreference: "",
    communicationPreference: [] as string[],
    additionalNotes: "",
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
    "Chemistry",
    "Management Studies",
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
    "Software Engineering",
    "Digital Electronics",
    "Signal Processing",
    "Embedded Systems",
    "Compiler Design",
    "Theory of Computation",
    "Computer Architecture"
  ];

  const specializationOptions = [
    "Machine Learning & AI",
    "Data Science",
    "Cloud Computing",
    "Cyber Security",
    "IoT & Embedded Systems",
    "Web Technologies",
    "Mobile Development",
    "Blockchain",
    "Computer Vision",
    "Natural Language Processing",
    "Robotics",
    "Quantum Computing"
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
      navigate("/teacher");
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
              <h2 className="text-2xl font-bold text-foreground">Welcome, Educator!</h2>
              <p className="text-muted-foreground mt-2">Let's set up your profile to get started</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Dr. John"
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Smith"
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Designation *</label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select your designation</option>
                {designations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.smith@university.edu"
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Institution Details</h2>
              <p className="text-muted-foreground mt-2">Tell us about your institution</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Institution Name *</label>
              <input
                type="text"
                value={formData.institutionName}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                placeholder="e.g., Indian Institute of Technology Delhi"
                className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Institution Type *</label>
                <select
                  value={formData.institutionType}
                  onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select type</option>
                  {institutionTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Employee ID</label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  placeholder="EMP12345"
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Years of Experience</label>
                <select
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                >
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
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Subjects & Expertise</h2>
              <p className="text-muted-foreground mt-2">What do you teach and specialize in?</p>
            </div>

            {/* Subjects Taught */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Subjects You Teach</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {subjectOptions.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => toggleArrayItem("subjectsTaught", subject)}
                    className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                      formData.subjectsTaught.includes(subject)
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
                  onKeyPress={(e) => e.key === "Enter" && addCustomItem("subjectsTaught", customSubject, setCustomSubject)}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl"
                  onClick={() => addCustomItem("subjectsTaught", customSubject, setCustomSubject)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Specializations */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Areas of Specialization</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {specializationOptions.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => toggleArrayItem("specializations", spec)}
                    className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                      formData.specializations.includes(spec)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSpecialization}
                  onChange={(e) => setCustomSpecialization(e.target.value)}
                  placeholder="Add custom specialization..."
                  className="flex-1 px-4 py-2 bg-secondary rounded-2xl text-foreground text-sm border-0 outline-none focus:ring-2 focus:ring-primary/20"
                  onKeyPress={(e) => e.key === "Enter" && addCustomItem("specializations", customSpecialization, setCustomSpecialization)}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl"
                  onClick={() => addCustomItem("specializations", customSpecialization, setCustomSpecialization)}
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
                <Settings className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Preferences</h2>
              <p className="text-muted-foreground mt-2">Customize your Heuristic experience</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Average Class Size</label>
                <select
                  value={formData.classSize}
                  onChange={(e) => setFormData({ ...formData, classSize: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select</option>
                  <option value="1-30">1-30 students</option>
                  <option value="31-60">31-60 students</option>
                  <option value="61-100">61-100 students</option>
                  <option value="100+">100+ students</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Grading Preference</label>
                <select
                  value={formData.gradingPreference}
                  onChange={(e) => setFormData({ ...formData, gradingPreference: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select</option>
                  <option value="auto">Auto-approve company grades</option>
                  <option value="review">Review each grade manually</option>
                  <option value="threshold">Auto-approve above threshold</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Communication Preferences</label>
              <div className="grid grid-cols-2 gap-3">
                {["Email notifications", "SMS alerts", "Weekly digest", "Real-time updates"].map((pref) => (
                  <button
                    key={pref}
                    onClick={() => toggleArrayItem("communicationPreference", pref)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      formData.communicationPreference.includes(pref)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="text-sm font-medium text-foreground">{pref}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Additional Notes (Optional)</label>
              <textarea
                rows={3}
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                placeholder="Any specific requirements or preferences..."
                className="w-full px-4 py-3 bg-secondary rounded-2xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-success" />
                <span className="font-medium text-foreground">Ready to Transform Assessment!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You'll be able to track student progress, approve company grades, and manage exam exemptions all in one place.
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
    { step: 2, label: "Institution", icon: <Building2 className="w-4 h-4" /> },
    { step: 3, label: "Expertise", icon: <BookOpen className="w-4 h-4" /> },
    { step: 4, label: "Preferences", icon: <Settings className="w-4 h-4" /> },
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
          <p className="text-muted-foreground mt-2">Educator Onboarding</p>
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
          <a href="/teacher" className="text-primary font-medium hover:underline">
            Skip to Dashboard
          </a>
        </p>
      </div>
    </div>
  );
};

export default TeacherOnboarding;

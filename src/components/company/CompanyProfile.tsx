import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { 
  Building2, 
  Globe, 
  Users, 
  MapPin, 
  Calendar,
  Briefcase,
  Target,
  Award,
  Edit,
  Save,
  X,
  ExternalLink,
  Mail,
  Phone
} from "lucide-react";

const CompanyProfile = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    companyName: user?.companyName || "TechCorp Inc.",
    domain: "Technology",
    website: "https://techcorp.example.com",
    location: "San Francisco, CA",
    founded: "2015",
    employees: "500-1000",
    description: "We are a leading technology company focused on building innovative solutions that transform how businesses operate. Our mission is to empower organizations with cutting-edge tools and platforms.",
    mission: "To democratize technology and make it accessible to businesses of all sizes.",
    values: ["Innovation", "Integrity", "Collaboration", "Excellence"],
    openPositions: 12,
    projectsPosted: 8,
    studentsHired: 24,
    contactEmail: user?.email || "hiring@techcorp.com",
    contactPhone: "+1 (555) 123-4567",
    focusAreas: ["Software Development", "Data Science", "UX/UI Design", "Cloud Infrastructure"]
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProfile(editedProfile);
    setIsEditing(false);
    setIsSaving(false);
    toast.success("Company profile updated successfully");
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Company Profile</h2>
          <p className="text-muted-foreground">This information is visible to students browsing projects</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2 rounded-lg">
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline" className="gap-2 rounded-lg">
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2 rounded-lg">
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {/* Main Profile Card */}
      <div className="dashboard-card">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Building2 className="w-10 h-10" />
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.companyName}
                onChange={(e) => setEditedProfile({ ...editedProfile, companyName: e.target.value })}
                className="input-clean text-xl font-semibold mb-2"
              />
            ) : (
              <h3 className="text-xl font-semibold text-foreground">{profile.companyName}</h3>
            )}
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.domain}
                    onChange={(e) => setEditedProfile({ ...editedProfile, domain: e.target.value })}
                    className="input-clean py-1 px-2 text-sm w-32"
                  />
                ) : (
                  profile.domain
                )}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {profile.employees} employees
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Founded {profile.founded}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-foreground mb-2">About</h4>
          {isEditing ? (
            <textarea
              value={editedProfile.description}
              onChange={(e) => setEditedProfile({ ...editedProfile, description: e.target.value })}
              className="input-clean min-h-[100px] resize-none"
              rows={4}
            />
          ) : (
            <p className="text-muted-foreground leading-relaxed">{profile.description}</p>
          )}
        </div>

        {/* Mission */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-foreground mb-2">Our Mission</h4>
          {isEditing ? (
            <textarea
              value={editedProfile.mission}
              onChange={(e) => setEditedProfile({ ...editedProfile, mission: e.target.value })}
              className="input-clean min-h-[60px] resize-none"
              rows={2}
            />
          ) : (
            <p className="text-muted-foreground leading-relaxed">{profile.mission}</p>
          )}
        </div>

        {/* Values */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-foreground mb-2">Core Values</h4>
          <div className="flex flex-wrap gap-2">
            {profile.values.map((value, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                {value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card text-center">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-foreground">{profile.projectsPosted}</p>
          <p className="text-sm text-muted-foreground">Projects Posted</p>
        </div>
        <div className="stat-card text-center">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <Target className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-foreground">{profile.openPositions}</p>
          <p className="text-sm text-muted-foreground">Open Positions</p>
        </div>
        <div className="stat-card text-center">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <Award className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-foreground">{profile.studentsHired}</p>
          <p className="text-sm text-muted-foreground">Students Hired</p>
        </div>
      </div>

      {/* Focus Areas */}
      <div className="dashboard-card">
        <h4 className="text-sm font-medium text-foreground mb-4">Focus Areas</h4>
        <div className="flex flex-wrap gap-2">
          {profile.focusAreas.map((area, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-secondary text-foreground rounded-lg text-sm">
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="dashboard-card">
        <h4 className="text-sm font-medium text-foreground mb-4">Contact Information</h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-foreground">{profile.contactEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Phone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-foreground">{profile.contactPhone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Globe className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Website</p>
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                {profile.website.replace('https://', '')}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Public Profile Preview */}
      <div className="dashboard-card bg-primary/5 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <ExternalLink className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground">Public Profile</h4>
            <p className="text-sm text-muted-foreground">Students can view your company profile when browsing projects</p>
          </div>
          <Button variant="outline" className="rounded-lg gap-2">
            <ExternalLink className="w-4 h-4" />
            View Public Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
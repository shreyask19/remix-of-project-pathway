import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Save,
  Loader2,
  ExternalLink,
  Github,
  Linkedin
} from "lucide-react";

const StudentSettings = () => {
  const { profile: authProfile, user, refreshProfile } = useAuth();
  const { profile: studentProfile, isLoading } = useStudentProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    hoursPerWeek: "",
  });

  // Update form data when profiles load
  useEffect(() => {
    setFormData({
      firstName: authProfile?.firstName || "",
      lastName: authProfile?.lastName || "",
      phone: authProfile?.phone || "",
      githubUrl: studentProfile?.github_url || "",
      linkedinUrl: studentProfile?.linkedin_url || "",
      portfolioUrl: studentProfile?.portfolio_url || "",
      hoursPerWeek: studentProfile?.hours_per_week || "",
    });
  }, [authProfile, studentProfile]);

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    projectAlerts: true,
    gradeNotifications: true,
    hiringAlerts: true,
    weeklyDigest: false,
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showCredits: true,
    allowHiringContacts: true,
  });

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Update student_profiles table
      const { error: studentError } = await supabase
        .from("student_profiles")
        .update({
          github_url: formData.githubUrl || null,
          linkedin_url: formData.linkedinUrl || null,
          portfolio_url: formData.portfolioUrl || null,
          hours_per_week: formData.hoursPerWeek || null,
        })
        .eq("user_id", user.id);

      if (studentError) throw studentError;

      await refreshProfile();
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "privacy", label: "Privacy", icon: <Shield className="w-4 h-4" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
  ];

  const inputClass = "w-full px-4 py-3 bg-secondary rounded-lg text-foreground border border-transparent focus:border-primary/30 outline-none focus:ring-2 focus:ring-primary/20 transition-all";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences and profile</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="md:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3">
          <div className="dashboard-card">
            {activeSection === "profile" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Profile Information</h3>
                  <p className="text-sm text-muted-foreground">Update your personal details and social links</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Social & Portfolio Links
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Github className="w-4 h-4 inline mr-1" />
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/yourusername"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Linkedin className="w-4 h-4 inline mr-1" />
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <ExternalLink className="w-4 h-4 inline mr-1" />
                        Portfolio Website
                      </label>
                      <input
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        placeholder="https://yourportfolio.com"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="text-sm font-semibold text-foreground mb-4">Availability</h4>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Hours per Week for Projects</label>
                    <select
                      value={formData.hoursPerWeek}
                      onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Select availability</option>
                      <option value="0-5">Less than 5 hours</option>
                      <option value="5-10">5-10 hours</option>
                      <option value="10-20">10-20 hours</option>
                      <option value="20+">20+ hours</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">Choose what updates you want to receive</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">Email Updates</p>
                      <p className="text-sm text-muted-foreground">Receive general platform updates via email</p>
                    </div>
                    <Switch
                      checked={notifications.emailUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailUpdates: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">Project Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified when new projects match your skills</p>
                    </div>
                    <Switch
                      checked={notifications.projectAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, projectAlerts: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">Grade Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive alerts when your submissions are graded</p>
                    </div>
                    <Switch
                      checked={notifications.gradeNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, gradeNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">Hiring Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified about interview invitations and offers</p>
                    </div>
                    <Switch
                      checked={notifications.hiringAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, hiringAlerts: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-foreground">Weekly Digest</p>
                      <p className="text-sm text-muted-foreground">Receive a weekly summary of your activity</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "privacy" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Privacy Settings</h3>
                  <p className="text-sm text-muted-foreground">Control your profile visibility and data sharing</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">Public Profile</p>
                      <p className="text-sm text-muted-foreground">Allow companies to view your profile in the talent pool</p>
                    </div>
                    <Switch
                      checked={privacy.publicProfile}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, publicProfile: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="font-medium text-foreground">Show Credits</p>
                      <p className="text-sm text-muted-foreground">Display your earned credits on your public profile</p>
                    </div>
                    <Switch
                      checked={privacy.showCredits}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showCredits: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-foreground">Allow Hiring Contacts</p>
                      <p className="text-sm text-muted-foreground">Let companies send you interview invitations</p>
                    </div>
                    <Switch
                      checked={privacy.allowHiringContacts}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, allowHiringContacts: checked })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Appearance</h3>
                  <p className="text-sm text-muted-foreground">Customize your dashboard experience</p>
                </div>

                <div className="p-6 bg-secondary/50 rounded-xl text-center">
                  <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Theme customization coming soon!</p>
                  <p className="text-sm text-muted-foreground mt-1">We're working on dark mode and custom themes.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;
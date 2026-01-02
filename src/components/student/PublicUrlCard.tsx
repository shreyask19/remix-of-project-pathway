import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  ExternalLink, 
  Linkedin, 
  QrCode, 
  Share2,
  Check,
  Twitter,
  Download,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PublicUrlCard = () => {
  const { profile: authProfile, user } = useAuth();
  const { profile: studentProfile } = useStudentProfile();
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const slug = studentProfile?.public_profile_slug;
  const publicUrl = slug ? `${window.location.origin}/portfolio/${slug}` : null;

  const generateSlug = async () => {
    if (!user || !authProfile) return;
    
    setIsGenerating(true);
    try {
      // Generate a unique slug
      const firstName = (authProfile.firstName || "user").toLowerCase().replace(/[^a-z0-9]/g, "");
      const lastName = (authProfile.lastName || "profile").toLowerCase().replace(/[^a-z0-9]/g, "");
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      const newSlug = `${firstName}-${lastName}-${randomSuffix}`;

      const { error } = await supabase
        .from("student_profiles")
        .update({ public_profile_slug: newSlug })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Public portfolio URL generated!");
      // Refresh will happen via react-query
      window.location.reload();
    } catch (error: any) {
      console.error("Error generating slug:", error);
      toast.error("Failed to generate URL");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!publicUrl) return;
    
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkedInShare = () => {
    if (!publicUrl) return;
    
    const url = encodeURIComponent(publicUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const handleTwitterShare = () => {
    if (!publicUrl) return;
    
    const text = encodeURIComponent(
      `Check out my verified project portfolio on @HeuristicLabs! 🚀\n\n${publicUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (!publicUrl) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${authProfile?.firstName}'s Portfolio`,
          text: "Check out my verified project portfolio on Heuristic",
          url: publicUrl,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  if (!slug) {
    return (
      <div className="dashboard-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Public Portfolio</h3>
            <p className="text-sm text-muted-foreground">Share your verified work</p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Generate a unique public URL to share your verified portfolio with recruiters and on LinkedIn.
        </p>
        
        <Button onClick={generateSlug} disabled={isGenerating} className="w-full gap-2">
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Generate Public URL
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Your Public Portfolio</h3>
            <p className="text-sm text-muted-foreground">Share with recruiters</p>
          </div>
        </div>

        {/* URL Display */}
        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg mb-4">
          <code className="flex-1 text-sm text-foreground truncate">
            {publicUrl}
          </code>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="shrink-0">
            {copied ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <Button variant="ghost" size="sm" asChild className="shrink-0">
            <a href={publicUrl!} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLinkedInShare}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Linkedin className="w-5 h-5 text-[#0077b5]" />
            <span className="text-xs">LinkedIn</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleTwitterShare}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Twitter className="w-5 h-5" />
            <span className="text-xs">Twitter</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowQR(true)}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <QrCode className="w-5 h-5" />
            <span className="text-xs">QR Code</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNativeShare}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs">Share</span>
          </Button>
        </div>
      </div>

      {/* QR Code Modal */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            {/* Simple QR code placeholder - in production, use a QR library */}
            <div className="w-48 h-48 bg-white p-4 rounded-xl border border-border flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-24 h-24 text-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Scan to view portfolio</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Scan this QR code to open the portfolio on any device
            </p>
            <Button variant="outline" className="mt-4 gap-2" onClick={handleCopy}>
              <Copy className="w-4 h-4" />
              Copy Link Instead
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PublicUrlCard;
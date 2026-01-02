import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  Video,
  Github,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";

interface UploadedFile {
  name: string;
  path: string;
  size: number;
  type: "document" | "video";
}

interface SubmissionUploadProps {
  submissionId: string;
  challengeId: string;
  onSubmit: (data: {
    githubUrl: string;
    videoUrl: string;
    notes: string;
    files: UploadedFile[];
  }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const SubmissionUpload = ({
  submissionId,
  challengeId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: SubmissionUploadProps) => {
  const [githubUrl, setGithubUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [videoFile, setVideoFile] = useState<UploadedFile | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const { isUploading, progress, uploadSubmissionFile, uploadSubmissionVideo, deleteFile } =
    useFileUpload();

  const validateGithubUrl = (url: string): boolean => {
    if (!url) return true; // Optional
    return url.includes("github.com");
  };

  const validateVideoUrl = (url: string): boolean => {
    if (!url) return true; // Optional if video file uploaded
    return (
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("loom.com") ||
      url.includes("vimeo.com") ||
      url.startsWith("http")
    );
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      const result = await uploadSubmissionFile(submissionId, challengeId, file);
      if (result) {
        setUploadedFiles((prev) => [
          ...prev,
          {
            name: result.fileName,
            path: result.path,
            size: result.fileSize,
            type: "document",
          },
        ]);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadSubmissionVideo(submissionId, challengeId, file);
    if (result) {
      setVideoFile({
        name: result.fileName,
        path: result.path,
        size: result.fileSize,
        type: "video",
      });
    }

    // Reset input
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const removeFile = async (index: number) => {
    const file = uploadedFiles[index];
    const deleted = await deleteFile("submissions", file.path);
    if (deleted) {
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const removeVideo = async () => {
    if (videoFile) {
      const deleted = await deleteFile("submissions", videoFile.path);
      if (deleted) {
        setVideoFile(null);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = () => {
    // Validate GitHub URL
    if (!githubUrl) {
      toast.error("GitHub repository URL is required");
      return;
    }
    if (!validateGithubUrl(githubUrl)) {
      toast.error("Please enter a valid GitHub URL");
      return;
    }

    // Validate video (either URL or file required)
    if (!videoUrl && !videoFile) {
      toast.error("Please provide a video walkthrough (URL or file upload)");
      return;
    }
    if (videoUrl && !validateVideoUrl(videoUrl)) {
      toast.error("Please enter a valid video URL (YouTube, Loom, Vimeo)");
      return;
    }

    const allFiles = videoFile ? [...uploadedFiles, videoFile] : uploadedFiles;

    onSubmit({
      githubUrl,
      videoUrl: videoUrl || (videoFile ? videoFile.path : ""),
      notes,
      files: allFiles,
    });
  };

  return (
    <div className="space-y-6">
      {/* GitHub URL */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <Github className="w-4 h-4 inline mr-2" />
          GitHub Repository URL *
        </label>
        <input
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/username/project-name"
          className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20"
        />
        {githubUrl && !validateGithubUrl(githubUrl) && (
          <p className="text-destructive text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Must be a valid GitHub URL
          </p>
        )}
      </div>

      {/* Video Walkthrough */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <Video className="w-4 h-4 inline mr-2" />
          Video Walkthrough (2-5 minutes) *
        </label>
        <p className="text-sm text-muted-foreground mb-3">
          Explain your solution, demonstrate key features, and walk through your code.
        </p>

        {/* Video URL Input */}
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=... or https://loom.com/share/..."
          className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20 mb-3"
          disabled={!!videoFile}
        />

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <span className="h-px flex-1 bg-border" />
          <span>OR</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Video File Upload */}
        {!videoFile ? (
          <div
            className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => videoInputRef.current?.click()}
          >
            <Video className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload video file (max 50MB)
            </p>
            <p className="text-xs text-muted-foreground">MP4, WebM, or MOV</p>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-success/10 rounded-xl">
            <Video className="w-5 h-5 text-success" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {videoFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(videoFile.size)}
              </p>
            </div>
            <CheckCircle className="w-5 h-5 text-success" />
            <button
              onClick={removeVideo}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Additional Files */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <FileText className="w-4 h-4 inline mr-2" />
          Additional Files (Optional)
        </label>
        <div
          className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Upload documentation, screenshots, or resources (max 10MB each)
          </p>
          <p className="text-xs text-muted-foreground">PDF, ZIP, PNG, JPG</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.zip,.png,.jpg,.jpeg,.txt"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2 mt-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-secondary rounded-lg"
              >
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional context, challenges faced, or features to highlight..."
          className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      {/* Upload Progress */}
      {isUploading && progress && (
        <div className="p-4 bg-secondary rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span className="text-sm text-foreground">Uploading...</span>
            <span className="text-sm text-muted-foreground ml-auto">
              {progress.percentage}%
            </span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <Button variant="outline" className="rounded-xl" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="rounded-xl gap-2 ml-auto"
          onClick={handleSubmit}
          disabled={isUploading || isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          Submit Project
        </Button>
      </div>
    </div>
  );
};

export default SubmissionUpload;

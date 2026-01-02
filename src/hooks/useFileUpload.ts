import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UploadResult {
  path: string;
  publicUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

interface FileValidation {
  maxSize: number;
  allowedTypes: string[];
}

const CHALLENGE_VALIDATION: FileValidation = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "application/pdf",
    "application/json",
    "text/plain",
    "text/csv",
    "application/zip",
    "image/png",
    "image/jpeg",
  ],
};

const SUBMISSION_DOC_VALIDATION: FileValidation = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "application/pdf",
    "application/zip",
    "image/png",
    "image/jpeg",
    "text/plain",
  ],
};

const SUBMISSION_VIDEO_VALIDATION: FileValidation = {
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: ["video/mp4", "video/webm", "video/quicktime"],
};

export const useFileUpload = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  const validateFile = (file: File, validation: FileValidation): string | null => {
    if (file.size > validation.maxSize) {
      const maxMB = Math.round(validation.maxSize / (1024 * 1024));
      return `File size exceeds ${maxMB}MB limit`;
    }
    if (!validation.allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`;
    }
    return null;
  };

  const uploadFile = async (
    bucket: string,
    path: string,
    file: File
  ): Promise<UploadResult> => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      publicUrl: urlData.publicUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    };
  };

  const uploadChallengeFile = async (
    challengeId: string,
    file: File
  ): Promise<UploadResult | null> => {
    if (!user) {
      toast.error("You must be logged in to upload files");
      return null;
    }

    const validationError = validateFile(file, CHALLENGE_VALIDATION);
    if (validationError) {
      toast.error(validationError);
      return null;
    }

    setIsUploading(true);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const path = `${user.id}/${challengeId}/${timestamp}-${sanitizedName}`;

      const result = await uploadFile("challenge-attachments", path, file);

      // Record in challenge_attachments table
      const { error: dbError } = await supabase
        .from("challenge_attachments")
        .insert({
          challenge_id: challengeId,
          file_name: file.name,
          file_path: result.path,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
        });

      if (dbError) throw dbError;

      setProgress({ loaded: file.size, total: file.size, percentage: 100 });
      toast.success(`${file.name} uploaded successfully`);
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Upload failed";
      toast.error(message);
      return null;
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  };

  const uploadSubmissionFile = async (
    submissionId: string,
    challengeId: string,
    file: File
  ): Promise<UploadResult | null> => {
    if (!user) {
      toast.error("You must be logged in to upload files");
      return null;
    }

    const validationError = validateFile(file, SUBMISSION_DOC_VALIDATION);
    if (validationError) {
      toast.error(validationError);
      return null;
    }

    setIsUploading(true);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const path = `${user.id}/${challengeId}/${timestamp}-${sanitizedName}`;

      const result = await uploadFile("submissions", path, file);

      // Record in submission_files table
      const { error: dbError } = await supabase
        .from("submission_files")
        .insert({
          submission_id: submissionId,
          file_name: file.name,
          file_path: result.path,
          file_size: file.size,
          mime_type: file.type,
          file_type: "document",
          uploaded_by: user.id,
        });

      if (dbError) throw dbError;

      setProgress({ loaded: file.size, total: file.size, percentage: 100 });
      toast.success(`${file.name} uploaded successfully`);
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Upload failed";
      toast.error(message);
      return null;
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  };

  const uploadSubmissionVideo = async (
    submissionId: string,
    challengeId: string,
    file: File
  ): Promise<UploadResult | null> => {
    if (!user) {
      toast.error("You must be logged in to upload files");
      return null;
    }

    const validationError = validateFile(file, SUBMISSION_VIDEO_VALIDATION);
    if (validationError) {
      toast.error(validationError);
      return null;
    }

    setIsUploading(true);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const path = `${user.id}/${challengeId}/video-${timestamp}-${sanitizedName}`;

      const result = await uploadFile("submissions", path, file);

      // Record in submission_files table
      const { error: dbError } = await supabase
        .from("submission_files")
        .insert({
          submission_id: submissionId,
          file_name: file.name,
          file_path: result.path,
          file_size: file.size,
          mime_type: file.type,
          file_type: "video",
          uploaded_by: user.id,
        });

      if (dbError) throw dbError;

      setProgress({ loaded: file.size, total: file.size, percentage: 100 });
      toast.success("Video uploaded successfully");
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Upload failed";
      toast.error(message);
      return null;
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  };

  const deleteFile = async (bucket: string, path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) throw error;
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Delete failed";
      toast.error(message);
      return false;
    }
  };

  return {
    isUploading,
    progress,
    uploadChallengeFile,
    uploadSubmissionFile,
    uploadSubmissionVideo,
    deleteFile,
  };
};

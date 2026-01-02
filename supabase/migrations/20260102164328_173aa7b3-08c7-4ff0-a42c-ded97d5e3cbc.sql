-- Phase 2: File Storage Infrastructure

-- 1. Create challenge-attachments bucket (public read, authenticated write)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'challenge-attachments', 
  'challenge-attachments', 
  true,
  10485760, -- 10MB limit for documents
  ARRAY['application/pdf', 'application/json', 'text/plain', 'text/csv', 'application/zip', 'image/png', 'image/jpeg']
);

-- 2. Create submissions bucket (private, RLS-controlled)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'submissions', 
  'submissions', 
  false,
  52428800, -- 50MB limit for videos
  ARRAY['application/pdf', 'video/mp4', 'video/webm', 'video/quicktime', 'application/zip', 'image/png', 'image/jpeg', 'text/plain']
);

-- 3. RLS Policies for challenge-attachments bucket

-- Anyone can view challenge attachments (public bucket)
CREATE POLICY "Public can view challenge attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'challenge-attachments');

-- Companies can upload to their own folder
CREATE POLICY "Companies can upload challenge attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'challenge-attachments' 
  AND has_role(auth.uid(), 'company'::app_role)
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Companies can update their own files
CREATE POLICY "Companies can update own challenge attachments"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'challenge-attachments' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Companies can delete their own files
CREATE POLICY "Companies can delete own challenge attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'challenge-attachments' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. RLS Policies for submissions bucket

-- Students can view their own submissions
CREATE POLICY "Students can view own submissions"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'submissions' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Students can upload to their own folder
CREATE POLICY "Students can upload submissions"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'submissions' 
  AND has_role(auth.uid(), 'student'::app_role)
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Students can update their own files
CREATE POLICY "Students can update own submissions"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'submissions' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Students can delete their own files
CREATE POLICY "Students can delete own submissions"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'submissions' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Companies can view submissions to their challenges
CREATE POLICY "Companies can view challenge submissions"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'submissions' 
  AND has_role(auth.uid(), 'company'::app_role)
);

-- Teachers can view submissions from their institution students
CREATE POLICY "Teachers can view student submissions"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'submissions' 
  AND has_role(auth.uid(), 'teacher'::app_role)
);

-- 5. Create challenge_attachments table to track uploaded files
CREATE TABLE public.challenge_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.challenge_attachments ENABLE ROW LEVEL SECURITY;

-- Anyone can view challenge attachments
CREATE POLICY "Anyone can view challenge attachments"
ON public.challenge_attachments FOR SELECT
USING (true);

-- Companies can insert attachments for their challenges
CREATE POLICY "Companies can insert challenge attachments"
ON public.challenge_attachments FOR INSERT
WITH CHECK (
  auth.uid() = uploaded_by 
  AND EXISTS (
    SELECT 1 FROM challenges WHERE id = challenge_id AND company_id = auth.uid()
  )
);

-- Companies can delete their own attachments
CREATE POLICY "Companies can delete own challenge attachments"
ON public.challenge_attachments FOR DELETE
USING (auth.uid() = uploaded_by);

-- 6. Create submission_files table to track uploaded submission files
CREATE TABLE public.submission_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'document', -- 'document', 'video', 'code'
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.submission_files ENABLE ROW LEVEL SECURITY;

-- Students can view their own submission files
CREATE POLICY "Students can view own submission files"
ON public.submission_files FOR SELECT
USING (auth.uid() = uploaded_by);

-- Students can insert their own submission files
CREATE POLICY "Students can insert submission files"
ON public.submission_files FOR INSERT
WITH CHECK (auth.uid() = uploaded_by);

-- Students can delete their own submission files
CREATE POLICY "Students can delete own submission files"
ON public.submission_files FOR DELETE
USING (auth.uid() = uploaded_by);

-- Companies can view submission files for their challenges
CREATE POLICY "Companies can view submission files"
ON public.submission_files FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM submissions s
    JOIN challenges c ON s.challenge_id = c.id
    WHERE s.id = submission_id AND c.company_id = auth.uid()
  )
);

-- Teachers can view submission files
CREATE POLICY "Teachers can view submission files"
ON public.submission_files FOR SELECT
USING (has_role(auth.uid(), 'teacher'::app_role));
-- Add authenticity tracking columns to submissions
ALTER TABLE public.submissions
ADD COLUMN authenticity_score INTEGER DEFAULT NULL,
ADD COLUMN authenticity_breakdown JSONB DEFAULT NULL,
ADD COLUMN github_repo_url TEXT DEFAULT NULL,
ADD COLUMN github_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN video_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN flagged_for_review BOOLEAN DEFAULT false,
ADD COLUMN flag_reasons TEXT[] DEFAULT '{}';

-- Create authenticity_logs table for audit trail
CREATE TABLE public.authenticity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  check_type TEXT NOT NULL, -- 'github', 'video', 'timing', 'plagiarism'
  check_result JSONB NOT NULL,
  score_contribution INTEGER NOT NULL DEFAULT 0,
  verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.authenticity_logs ENABLE ROW LEVEL SECURITY;

-- Policies for authenticity_logs
CREATE POLICY "Students can view own submission authenticity"
ON public.authenticity_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM submissions s 
    WHERE s.id = authenticity_logs.submission_id 
    AND s.student_id = auth.uid()
  )
);

CREATE POLICY "Companies can view authenticity for their challenges"
ON public.authenticity_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM submissions s
    JOIN challenges c ON s.challenge_id = c.id
    WHERE s.id = authenticity_logs.submission_id
    AND c.company_id = auth.uid()
  )
);

CREATE POLICY "Teachers can view all authenticity logs"
ON public.authenticity_logs FOR SELECT
USING (has_role(auth.uid(), 'teacher'::app_role));

CREATE POLICY "System can insert authenticity logs"
ON public.authenticity_logs FOR INSERT
WITH CHECK (true);

-- Add index for faster lookups
CREATE INDEX idx_authenticity_logs_submission ON public.authenticity_logs(submission_id);
CREATE INDEX idx_submissions_flagged ON public.submissions(flagged_for_review) WHERE flagged_for_review = true;
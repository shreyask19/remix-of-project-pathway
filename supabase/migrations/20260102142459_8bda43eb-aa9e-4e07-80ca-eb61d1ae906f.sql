-- Create institutions table for multi-tenant support
CREATE TABLE public.institutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('university', 'college', 'bootcamp', 'corporate')),
  domain TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on institutions
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view institutions
CREATE POLICY "Anyone can view institutions"
ON public.institutions FOR SELECT
USING (true);

-- Add institution_id to profiles table
ALTER TABLE public.profiles ADD COLUMN institution_id UUID REFERENCES public.institutions(id);

-- Add institution_id to student_profiles table
ALTER TABLE public.student_profiles ADD COLUMN institution_id UUID REFERENCES public.institutions(id);

-- Add institution_id to teacher_profiles table
ALTER TABLE public.teacher_profiles ADD COLUMN institution_id UUID REFERENCES public.institutions(id);

-- Update student_profiles RLS: Teachers can only view students from same institution
DROP POLICY IF EXISTS "Teachers can view student profiles" ON public.student_profiles;
CREATE POLICY "Teachers can view student profiles from same institution"
ON public.student_profiles FOR SELECT
USING (
  has_role(auth.uid(), 'teacher'::app_role) AND (
    institution_id IS NULL OR 
    institution_id IN (
      SELECT tp.institution_id FROM public.teacher_profiles tp WHERE tp.user_id = auth.uid()
    )
  )
);

-- Update submissions RLS: Teachers can only view submissions from same institution
DROP POLICY IF EXISTS "Teachers can view submissions for approval" ON public.submissions;
CREATE POLICY "Teachers can view submissions from same institution"
ON public.submissions FOR SELECT
USING (
  has_role(auth.uid(), 'teacher'::app_role) AND (
    student_id IN (
      SELECT sp.user_id FROM public.student_profiles sp
      WHERE sp.institution_id IS NULL OR sp.institution_id IN (
        SELECT tp.institution_id FROM public.teacher_profiles tp WHERE tp.user_id = auth.uid()
      )
    )
  )
);

DROP POLICY IF EXISTS "Teachers can update submissions for approval" ON public.submissions;
CREATE POLICY "Teachers can update submissions from same institution"
ON public.submissions FOR UPDATE
USING (
  has_role(auth.uid(), 'teacher'::app_role) AND (
    student_id IN (
      SELECT sp.user_id FROM public.student_profiles sp
      WHERE sp.institution_id IS NULL OR sp.institution_id IN (
        SELECT tp.institution_id FROM public.teacher_profiles tp WHERE tp.user_id = auth.uid()
      )
    )
  )
);

-- Insert seed institutions
INSERT INTO public.institutions (id, name, type, domain) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Stanford University', 'university', 'stanford.edu'),
  ('22222222-2222-2222-2222-222222222222', 'MIT', 'university', 'mit.edu'),
  ('33333333-3333-3333-3333-333333333333', 'UC Berkeley', 'university', 'berkeley.edu');

-- Insert 5 default challenges with a system company ID
-- First create a system company profile for seed data
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'system@heuristic.app',
  '$2a$10$PwnJeC9ELH/Dc7TQ9h3g0eJaQfbCQUJpT8qVKXbBGHqZX0yM1t4PC',
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"first_name":"System","last_name":"Company"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, first_name, last_name, email, is_onboarded)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'System', 'Company', 'system@heuristic.app', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'company')
ON CONFLICT DO NOTHING;

INSERT INTO public.company_profiles (user_id, company_name, industry, description, company_size)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Heuristic Labs', 'EdTech', 'Platform challenges for student learning', '50-100')
ON CONFLICT DO NOTHING;

-- Insert 5 seed challenges
INSERT INTO public.challenges (id, company_id, title, description, difficulty, credits, category, required_skills, deadline, status, max_applicants) VALUES
(
  'c1111111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Global Supply Chain Data Cleaning',
  'Clean and normalize a messy CSV dataset containing global supply chain transactions. Handle missing values, standardize date formats, and identify outliers in shipping data across 50+ countries.',
  'Easy',
  50,
  'data',
  ARRAY['Python', 'Pandas', 'Data Cleaning', 'CSV'],
  (now() + interval '30 days')::timestamp with time zone,
  'active',
  100
),
(
  'c2222222-2222-2222-2222-222222222222',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Customer Sentiment JSON Parser',
  'Build a parser to extract and analyze customer sentiment from nested JSON responses. Aggregate sentiment scores, identify trending topics, and generate summary statistics.',
  'Medium',
  65,
  'backend',
  ARRAY['Python', 'JSON', 'NLP', 'APIs'],
  (now() + interval '21 days')::timestamp with time zone,
  'active',
  75
),
(
  'c3333333-3333-3333-3333-333333333333',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'FinTech Fraud Detection',
  'Analyze a structured transaction dataset to build a fraud detection model. Identify suspicious patterns, flag anomalous transactions, and create a risk scoring system.',
  'Hard',
  100,
  'data',
  ARRAY['Python', 'ML', 'SQL', 'Statistics', 'Scikit-learn'],
  (now() + interval '45 days')::timestamp with time zone,
  'active',
  50
),
(
  'c4444444-4444-4444-4444-444444444444',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'E-commerce Recommendation System',
  'Design and implement a product recommendation engine using a relational dataset of user purchases, browsing history, and product metadata. Optimize for conversion rate.',
  'Hard',
  90,
  'data',
  ARRAY['Python', 'SQL', 'ML', 'Collaborative Filtering', 'PostgreSQL'],
  (now() + interval '35 days')::timestamp with time zone,
  'active',
  60
),
(
  'c5555555-5555-5555-5555-555555555555',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Healthcare Vital Sign Analytics',
  'Process and analyze time-series vital sign data from wearable devices. Detect anomalies, predict health events, and create real-time monitoring dashboards.',
  'Hard',
  95,
  'data',
  ARRAY['Python', 'Time Series', 'TensorFlow', 'Visualization', 'Healthcare'],
  (now() + interval '40 days')::timestamp with time zone,
  'active',
  40
);

-- Create RPC for atomic credit approval (transaction)
CREATE OR REPLACE FUNCTION public.approve_grade_and_award_credits(
  p_submission_id UUID,
  p_teacher_id UUID,
  p_credits INTEGER,
  p_challenge_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student_id UUID;
  v_grade_approval_id UUID;
  v_credit_entry_id UUID;
BEGIN
  -- Get student_id from submission
  SELECT student_id INTO v_student_id
  FROM submissions
  WHERE id = p_submission_id;
  
  IF v_student_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Submission not found');
  END IF;
  
  -- Update submission status to approved
  UPDATE submissions
  SET status = 'approved', approved_at = now(), teacher_feedback = 'Approved by teacher'
  WHERE id = p_submission_id;
  
  -- Update or insert grade approval record
  INSERT INTO grade_approvals (submission_id, teacher_id, status, approved_at)
  VALUES (p_submission_id, p_teacher_id, 'approved', now())
  ON CONFLICT (submission_id) DO UPDATE
  SET status = 'approved', teacher_id = p_teacher_id, approved_at = now();
  
  -- Award credits to student
  INSERT INTO credits_ledger (student_id, amount, reason, challenge_id, submission_id)
  VALUES (v_student_id, p_credits, 'Grade approved by teacher', p_challenge_id, p_submission_id)
  RETURNING id INTO v_credit_entry_id;
  
  RETURN json_build_object(
    'success', true,
    'student_id', v_student_id,
    'credits_awarded', p_credits,
    'credit_entry_id', v_credit_entry_id
  );
END;
$$;

-- Create trigger for updated_at on institutions
CREATE TRIGGER update_institutions_updated_at
  BEFORE UPDATE ON public.institutions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
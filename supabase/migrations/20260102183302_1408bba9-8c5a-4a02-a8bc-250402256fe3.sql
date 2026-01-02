-- =====================================================
-- PHASE 1: DATABASE SCHEMA EXTENSIONS FOR 16 FEATURES
-- =====================================================

-- 1. Add columns to student_profiles
ALTER TABLE public.student_profiles
ADD COLUMN IF NOT EXISTS reliability_score integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS industry_readiness_score integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS public_profile_slug text UNIQUE,
ADD COLUMN IF NOT EXISTS pro_badge_earned boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS preferred_companies text[] DEFAULT '{}'::text[];

-- 2. Add columns to company_profiles
ALTER TABLE public.company_profiles
ADD COLUMN IF NOT EXISTS avg_review_time_hours numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS logo_high_res_url text DEFAULT '';

-- 3. Add columns to challenges
ALTER TABLE public.challenges
ADD COLUMN IF NOT EXISTS estimated_hours integer DEFAULT 8,
ADD COLUMN IF NOT EXISTS tech_stack text[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS stipend_amount integer;

-- =====================================================
-- 4. Create teacher_vouches table
-- =====================================================
CREATE TABLE public.teacher_vouches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  student_id uuid NOT NULL,
  vouch_type text NOT NULL CHECK (vouch_type IN ('punctuality', 'professionalism', 'reliability')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, student_id, vouch_type)
);

-- Enable RLS
ALTER TABLE public.teacher_vouches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teacher_vouches
CREATE POLICY "Teachers can insert vouches"
ON public.teacher_vouches FOR INSERT
WITH CHECK (auth.uid() = teacher_id AND has_role(auth.uid(), 'teacher'::app_role));

CREATE POLICY "Teachers can view own vouches"
ON public.teacher_vouches FOR SELECT
USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view their vouches"
ON public.teacher_vouches FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Companies can view student vouches"
ON public.teacher_vouches FOR SELECT
USING (has_role(auth.uid(), 'company'::app_role));

-- =====================================================
-- 5. Create company_feedback_to_teacher table
-- =====================================================
CREATE TABLE public.company_feedback_to_teacher (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  company_id uuid NOT NULL,
  teacher_id uuid,
  feedback_text text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_feedback_to_teacher ENABLE ROW LEVEL SECURITY;

-- RLS Policies for company_feedback_to_teacher
CREATE POLICY "Companies can insert feedback"
ON public.company_feedback_to_teacher FOR INSERT
WITH CHECK (auth.uid() = company_id AND has_role(auth.uid(), 'company'::app_role));

CREATE POLICY "Companies can view own feedback"
ON public.company_feedback_to_teacher FOR SELECT
USING (auth.uid() = company_id);

CREATE POLICY "Teachers can view feedback for their institution students"
ON public.company_feedback_to_teacher FOR SELECT
USING (
  has_role(auth.uid(), 'teacher'::app_role) AND
  EXISTS (
    SELECT 1 FROM submissions s
    JOIN student_profiles sp ON s.student_id = sp.user_id
    JOIN teacher_profiles tp ON tp.user_id = auth.uid()
    WHERE s.id = company_feedback_to_teacher.submission_id
    AND (sp.institution_id IS NULL OR sp.institution_id = tp.institution_id)
  )
);

-- =====================================================
-- 6. Create skill_graph_data table
-- =====================================================
CREATE TABLE public.skill_graph_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  category text NOT NULL CHECK (category IN (
    'architectural_thinking',
    'security_awareness',
    'edge_case_handling',
    'code_quality',
    'ui_ux_design',
    'testing_coverage',
    'documentation',
    'performance_optimization'
  )),
  score integer NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(student_id, category)
);

-- Enable RLS
ALTER TABLE public.skill_graph_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skill_graph_data
CREATE POLICY "Students can view own skill graph"
ON public.skill_graph_data FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Students can update own skill graph"
ON public.skill_graph_data FOR UPDATE
USING (auth.uid() = student_id);

CREATE POLICY "System can insert skill graph data"
ON public.skill_graph_data FOR INSERT
WITH CHECK (true);

CREATE POLICY "Companies can view student skill graphs"
ON public.skill_graph_data FOR SELECT
USING (has_role(auth.uid(), 'company'::app_role));

CREATE POLICY "Teachers can view student skill graphs"
ON public.skill_graph_data FOR SELECT
USING (has_role(auth.uid(), 'teacher'::app_role));

-- =====================================================
-- 7. Create indexes for filtering and sorting
-- =====================================================

-- Student profiles indexes
CREATE INDEX IF NOT EXISTS idx_student_profiles_reliability_score ON public.student_profiles(reliability_score DESC);
CREATE INDEX IF NOT EXISTS idx_student_profiles_industry_readiness ON public.student_profiles(industry_readiness_score DESC);
CREATE INDEX IF NOT EXISTS idx_student_profiles_public_slug ON public.student_profiles(public_profile_slug);
CREATE INDEX IF NOT EXISTS idx_student_profiles_pro_badge ON public.student_profiles(pro_badge_earned) WHERE pro_badge_earned = true;

-- Challenges indexes
CREATE INDEX IF NOT EXISTS idx_challenges_tech_stack ON public.challenges USING GIN(tech_stack);
CREATE INDEX IF NOT EXISTS idx_challenges_estimated_hours ON public.challenges(estimated_hours);
CREATE INDEX IF NOT EXISTS idx_challenges_stipend ON public.challenges(stipend_amount) WHERE stipend_amount IS NOT NULL;

-- Teacher vouches indexes
CREATE INDEX IF NOT EXISTS idx_teacher_vouches_student ON public.teacher_vouches(student_id);
CREATE INDEX IF NOT EXISTS idx_teacher_vouches_teacher ON public.teacher_vouches(teacher_id);

-- Skill graph indexes
CREATE INDEX IF NOT EXISTS idx_skill_graph_student ON public.skill_graph_data(student_id);

-- Company feedback indexes
CREATE INDEX IF NOT EXISTS idx_company_feedback_submission ON public.company_feedback_to_teacher(submission_id);

-- =====================================================
-- 8. Trigger to update reliability_score when vouches change
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_student_reliability_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.student_profiles
  SET reliability_score = (
    SELECT COUNT(*) FROM public.teacher_vouches WHERE student_id = NEW.student_id
  )
  WHERE user_id = NEW.student_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_update_reliability_score
AFTER INSERT ON public.teacher_vouches
FOR EACH ROW
EXECUTE FUNCTION public.update_student_reliability_score();

-- =====================================================
-- 9. Trigger to auto-calculate industry_readiness_score
-- =====================================================
CREATE OR REPLACE FUNCTION public.calculate_industry_readiness_score()
RETURNS TRIGGER AS $$
DECLARE
  v_student_id uuid;
  v_avg_grade numeric;
  v_project_count integer;
  v_difficulty_score numeric;
  v_authenticity_avg numeric;
  v_diversity_score numeric;
  v_final_score integer;
BEGIN
  v_student_id := COALESCE(NEW.student_id, OLD.student_id);
  
  -- Calculate average grade (0-100)
  SELECT COALESCE(AVG(grade), 0) INTO v_avg_grade
  FROM public.submissions
  WHERE student_id = v_student_id AND status = 'approved' AND grade IS NOT NULL;
  
  -- Calculate project count and difficulty score
  SELECT 
    COUNT(*),
    COALESCE(AVG(CASE 
      WHEN c.difficulty = 'Easy' THEN 30
      WHEN c.difficulty = 'Medium' THEN 60
      WHEN c.difficulty = 'Hard' THEN 100
      ELSE 50
    END), 0)
  INTO v_project_count, v_difficulty_score
  FROM public.submissions s
  JOIN public.challenges c ON s.challenge_id = c.id
  WHERE s.student_id = v_student_id AND s.status = 'approved';
  
  -- Calculate authenticity average
  SELECT COALESCE(AVG(authenticity_score), 50) INTO v_authenticity_avg
  FROM public.submissions
  WHERE student_id = v_student_id AND status = 'approved' AND authenticity_score IS NOT NULL;
  
  -- Calculate diversity score (unique categories / 5 * 100)
  SELECT LEAST(COUNT(DISTINCT c.category)::numeric / 5 * 100, 100) INTO v_diversity_score
  FROM public.submissions s
  JOIN public.challenges c ON s.challenge_id = c.id
  WHERE s.student_id = v_student_id AND s.status = 'approved';
  
  -- Final formula: weighted average
  v_final_score := LEAST(100, GREATEST(0, (
    (v_difficulty_score * 0.3) +
    (v_avg_grade * 0.3) +
    (v_authenticity_avg * 0.2) +
    (v_diversity_score * 0.2)
  )::integer));
  
  -- Update student profile
  UPDATE public.student_profiles
  SET industry_readiness_score = v_final_score
  WHERE user_id = v_student_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_calculate_industry_readiness
AFTER INSERT OR UPDATE OF status, grade ON public.submissions
FOR EACH ROW
WHEN (NEW.status = 'approved')
EXECUTE FUNCTION public.calculate_industry_readiness_score();

-- =====================================================
-- 10. Trigger to calculate avg_review_time_hours for companies
-- =====================================================
CREATE OR REPLACE FUNCTION public.calculate_company_avg_review_time()
RETURNS TRIGGER AS $$
DECLARE
  v_company_id uuid;
  v_avg_hours numeric;
BEGIN
  -- Get company_id from the challenge
  SELECT c.company_id INTO v_company_id
  FROM public.challenges c
  WHERE c.id = NEW.challenge_id;
  
  IF v_company_id IS NOT NULL THEN
    -- Calculate average review time in hours
    SELECT COALESCE(
      AVG(EXTRACT(EPOCH FROM (s.graded_at - s.submitted_at)) / 3600),
      0
    ) INTO v_avg_hours
    FROM public.submissions s
    JOIN public.challenges c ON s.challenge_id = c.id
    WHERE c.company_id = v_company_id
    AND s.graded_at IS NOT NULL
    AND s.submitted_at IS NOT NULL;
    
    -- Update company profile
    UPDATE public.company_profiles
    SET avg_review_time_hours = ROUND(v_avg_hours::numeric, 1)
    WHERE user_id = v_company_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_calculate_review_time
AFTER UPDATE OF graded_at ON public.submissions
FOR EACH ROW
WHEN (NEW.graded_at IS NOT NULL AND OLD.graded_at IS NULL)
EXECUTE FUNCTION public.calculate_company_avg_review_time();

-- =====================================================
-- 11. Trigger to award Pro Badge when 3+ Excellent grades
-- =====================================================
CREATE OR REPLACE FUNCTION public.check_pro_badge_eligibility()
RETURNS TRIGGER AS $$
DECLARE
  v_excellent_count integer;
BEGIN
  -- Count submissions with grade >= 90 (Excellent)
  SELECT COUNT(*) INTO v_excellent_count
  FROM public.submissions
  WHERE student_id = NEW.student_id
  AND status = 'approved'
  AND grade >= 90;
  
  -- Award pro badge if 3+ excellent grades
  IF v_excellent_count >= 3 THEN
    UPDATE public.student_profiles
    SET pro_badge_earned = true
    WHERE user_id = NEW.student_id AND pro_badge_earned = false;
    
    -- Insert golden notification if badge was just earned
    IF FOUND THEN
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (
        NEW.student_id,
        'achievement',
        '🌟 Pro Badge Earned!',
        'Congratulations! You''ve earned the Pro Badge for completing 3+ projects with Excellent ratings!'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_check_pro_badge
AFTER UPDATE OF grade, status ON public.submissions
FOR EACH ROW
WHEN (NEW.status = 'approved' AND NEW.grade >= 90)
EXECUTE FUNCTION public.check_pro_badge_eligibility();

-- =====================================================
-- 12. Function to generate unique public profile slug
-- =====================================================
CREATE OR REPLACE FUNCTION public.generate_public_profile_slug()
RETURNS TRIGGER AS $$
DECLARE
  v_first_name text;
  v_last_name text;
  v_base_slug text;
  v_final_slug text;
  v_counter integer := 0;
BEGIN
  -- Get user's name from profiles
  SELECT LOWER(first_name), LOWER(last_name)
  INTO v_first_name, v_last_name
  FROM public.profiles
  WHERE id = NEW.user_id;
  
  -- Create base slug
  v_base_slug := REGEXP_REPLACE(
    COALESCE(v_first_name, 'user') || '-' || COALESCE(v_last_name, 'profile'),
    '[^a-z0-9-]', '', 'g'
  );
  
  -- Add random suffix
  v_final_slug := v_base_slug || '-' || SUBSTR(MD5(RANDOM()::text), 1, 4);
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.student_profiles WHERE public_profile_slug = v_final_slug) LOOP
    v_counter := v_counter + 1;
    v_final_slug := v_base_slug || '-' || SUBSTR(MD5(RANDOM()::text || v_counter::text), 1, 4);
  END LOOP;
  
  NEW.public_profile_slug := v_final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_generate_profile_slug
BEFORE INSERT ON public.student_profiles
FOR EACH ROW
WHEN (NEW.public_profile_slug IS NULL)
EXECUTE FUNCTION public.generate_public_profile_slug();

-- Generate slugs for existing students without one
UPDATE public.student_profiles sp
SET public_profile_slug = (
  SELECT LOWER(REGEXP_REPLACE(
    COALESCE(p.first_name, 'user') || '-' || COALESCE(p.last_name, 'profile') || '-' || SUBSTR(MD5(sp.id::text), 1, 4),
    '[^a-z0-9-]', '', 'g'
  ))
  FROM public.profiles p WHERE p.id = sp.user_id
)
WHERE public_profile_slug IS NULL;
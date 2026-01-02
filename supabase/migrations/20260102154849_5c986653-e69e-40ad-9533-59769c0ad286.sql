
-- ============================================
-- 1. OPTIMIZE CREDITS TRIGGER (O(1) instead of SUM)
-- ============================================
CREATE OR REPLACE FUNCTION public.update_student_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Incremental update: O(1) instead of O(n) SUM
  UPDATE public.student_profiles
  SET total_credits = total_credits + NEW.amount
  WHERE user_id = NEW.student_id;
  RETURN NEW;
END;
$$;

-- Create trigger if not exists
DROP TRIGGER IF EXISTS on_credits_ledger_insert ON public.credits_ledger;
CREATE TRIGGER on_credits_ledger_insert
  AFTER INSERT ON public.credits_ledger
  FOR EACH ROW
  EXECUTE FUNCTION public.update_student_credits();

-- ============================================
-- 2. CREATE ATOMIC ONBOARDING RPC
-- ============================================
CREATE OR REPLACE FUNCTION public.complete_student_onboarding(
  p_user_id UUID,
  p_university_name TEXT DEFAULT NULL,
  p_university_program TEXT DEFAULT NULL,
  p_batch TEXT DEFAULT NULL,
  p_graduation_year TEXT DEFAULT NULL,
  p_current_semester TEXT DEFAULT NULL,
  p_current_subjects TEXT[] DEFAULT NULL,
  p_existing_skills TEXT[] DEFAULT NULL,
  p_interests TEXT[] DEFAULT NULL,
  p_career_goals TEXT[] DEFAULT NULL,
  p_preferred_project_types TEXT[] DEFAULT NULL,
  p_linkedin_url TEXT DEFAULT NULL,
  p_github_url TEXT DEFAULT NULL,
  p_portfolio_url TEXT DEFAULT NULL,
  p_hours_per_week TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_profile_id UUID;
BEGIN
  -- Step 1: Upsert student profile
  INSERT INTO student_profiles (
    user_id,
    university_name,
    university_program,
    batch,
    graduation_year,
    current_semester,
    current_subjects,
    existing_skills,
    interests,
    career_goals,
    preferred_project_types,
    linkedin_url,
    github_url,
    portfolio_url,
    hours_per_week
  )
  VALUES (
    p_user_id,
    p_university_name,
    p_university_program,
    p_batch,
    p_graduation_year,
    p_current_semester,
    COALESCE(p_current_subjects, '{}'),
    COALESCE(p_existing_skills, '{}'),
    COALESCE(p_interests, '{}'),
    COALESCE(p_career_goals, '{}'),
    COALESCE(p_preferred_project_types, '{}'),
    p_linkedin_url,
    p_github_url,
    p_portfolio_url,
    p_hours_per_week
  )
  ON CONFLICT (user_id) DO UPDATE SET
    university_name = EXCLUDED.university_name,
    university_program = EXCLUDED.university_program,
    batch = EXCLUDED.batch,
    graduation_year = EXCLUDED.graduation_year,
    current_semester = EXCLUDED.current_semester,
    current_subjects = EXCLUDED.current_subjects,
    existing_skills = EXCLUDED.existing_skills,
    interests = EXCLUDED.interests,
    career_goals = EXCLUDED.career_goals,
    preferred_project_types = EXCLUDED.preferred_project_types,
    linkedin_url = EXCLUDED.linkedin_url,
    github_url = EXCLUDED.github_url,
    portfolio_url = EXCLUDED.portfolio_url,
    hours_per_week = EXCLUDED.hours_per_week,
    updated_at = now()
  RETURNING id INTO v_profile_id;

  -- Step 2: Mark profile as onboarded (atomic with above)
  UPDATE profiles
  SET is_onboarded = true, updated_at = now()
  WHERE id = p_user_id;

  RETURN json_build_object(
    'success', true,
    'student_profile_id', v_profile_id,
    'message', 'Onboarding completed successfully'
  );
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;

-- ============================================
-- 3. CREATE NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('success', 'warning', 'info', 'message')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- ============================================
-- 4. SEED 5 DEFAULT HEURISTIC CHALLENGES
-- ============================================

-- First, ensure we have a system company or use existing one
DO $$
DECLARE
  v_system_company_id UUID;
BEGIN
  -- Check if any company exists, if not create a system placeholder
  SELECT user_id INTO v_system_company_id FROM company_profiles LIMIT 1;
  
  -- If no company exists, we'll create challenges anyway with a placeholder
  -- The company_id will be updated when a company registers
  IF v_system_company_id IS NULL THEN
    -- We need at least one user to be a company, skip seeding for now
    -- Challenges will be seeded when a company is created
    RETURN;
  END IF;

  -- Insert 5 default challenges only if none exist
  IF NOT EXISTS (SELECT 1 FROM challenges LIMIT 1) THEN
    INSERT INTO challenges (company_id, title, description, category, difficulty, credits, required_skills, max_applicants, status, deadline) VALUES
    (
      v_system_company_id,
      'Global Supply Chain Data Cleaning',
      'Clean and normalize a messy dataset of 10,000+ international shipping records. Handle missing values, inconsistent date formats, and duplicate entries. You''ll work with real logistics data containing columns for origin, destination, weight, dimensions, carrier, and timestamps. Deliverable: A clean CSV with comprehensive documentation of your cleaning methodology and Python/Pandas scripts used.',
      'data',
      'Easy',
      50,
      ARRAY['Python', 'Pandas', 'Data Cleaning', 'Excel'],
      100,
      'active',
      NOW() + INTERVAL '30 days'
    ),
    (
      v_system_company_id,
      'E-Commerce REST API Development',
      'Build a production-ready REST API for an e-commerce platform. Implement user authentication (JWT), product CRUD operations, shopping cart functionality, and order processing. The API should include proper error handling, input validation, rate limiting, and comprehensive API documentation using OpenAPI/Swagger. Include unit tests with >80% coverage.',
      'backend',
      'Medium',
      100,
      ARRAY['Node.js', 'Express', 'PostgreSQL', 'REST API', 'JWT'],
      50,
      'active',
      NOW() + INTERVAL '45 days'
    ),
    (
      v_system_company_id,
      'Real-Time Analytics Dashboard',
      'Create an interactive data visualization dashboard that displays real-time metrics. The dashboard should include at least 5 different chart types (line, bar, pie, scatter, heatmap), support filtering by date range and categories, and auto-refresh every 30 seconds. Implement responsive design for mobile and desktop. Use sample financial or social media data.',
      'frontend',
      'Medium',
      80,
      ARRAY['React', 'TypeScript', 'D3.js', 'Recharts', 'Tailwind CSS'],
      75,
      'active',
      NOW() + INTERVAL '35 days'
    ),
    (
      v_system_company_id,
      'ML-Powered Sentiment Analysis API',
      'Develop a machine learning service that analyzes text sentiment. Train a model on the provided dataset of product reviews, achieving minimum 85% accuracy. Deploy as a REST API that accepts text input and returns sentiment classification (positive/negative/neutral) with confidence scores. Include model evaluation metrics and documentation on training approach.',
      'ml',
      'Hard',
      150,
      ARRAY['Python', 'TensorFlow', 'NLP', 'FastAPI', 'Docker'],
      30,
      'active',
      NOW() + INTERVAL '60 days'
    ),
    (
      v_system_company_id,
      'Mobile Banking App UI/UX Redesign',
      'Redesign the user interface and experience for a mobile banking application targeting Gen-Z users. Conduct competitive analysis of 3 leading banking apps, create user personas, design wireframes for key flows (login, transfers, account overview), and produce high-fidelity mockups with a complete design system. Include accessibility considerations and micro-interactions.',
      'design',
      'Medium',
      75,
      ARRAY['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems'],
      60,
      'active',
      NOW() + INTERVAL '40 days'
    );
  END IF;
END $$;

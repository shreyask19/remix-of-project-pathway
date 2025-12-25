-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'company');

-- Create enum for application status
CREATE TYPE public.application_status AS ENUM ('pending', 'approved', 'rejected', 'withdrawn');

-- Create enum for submission status
CREATE TYPE public.submission_status AS ENUM ('draft', 'submitted', 'graded', 'approved', 'disputed');

-- Create enum for challenge status
CREATE TYPE public.challenge_status AS ENUM ('draft', 'active', 'closed', 'archived');

-- Create enum for invitation status
CREATE TYPE public.invitation_status AS ENUM ('pending', 'accepted', 'declined');

-- Create enum for pipeline stage
CREATE TYPE public.pipeline_stage AS ENUM ('shortlisted', 'interviewing', 'offer_sent', 'hired', 'rejected');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  is_onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (critical for security - separate from profiles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create student_profiles table for student-specific data
CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  university_name TEXT DEFAULT '',
  university_program TEXT DEFAULT '',
  batch TEXT DEFAULT '',
  graduation_year TEXT DEFAULT '',
  current_semester TEXT DEFAULT '',
  current_subjects TEXT[] DEFAULT '{}',
  existing_skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  career_goals TEXT[] DEFAULT '{}',
  preferred_project_types TEXT[] DEFAULT '{}',
  linkedin_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  portfolio_url TEXT DEFAULT '',
  hours_per_week TEXT DEFAULT '',
  total_credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teacher_profiles table for teacher-specific data
CREATE TABLE public.teacher_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  designation TEXT DEFAULT '',
  institution_name TEXT DEFAULT '',
  institution_type TEXT DEFAULT '',
  department TEXT DEFAULT '',
  employee_id TEXT DEFAULT '',
  years_of_experience TEXT DEFAULT '',
  subjects_taught TEXT[] DEFAULT '{}',
  specializations TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company_profiles table for company-specific data
CREATE TABLE public.company_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL DEFAULT '',
  industry TEXT DEFAULT '',
  company_size TEXT DEFAULT '',
  website TEXT DEFAULT '',
  headquarters TEXT DEFAULT '',
  description TEXT DEFAULT '',
  contact_role TEXT DEFAULT '',
  hiring_roles TEXT[] DEFAULT '{}',
  required_skills TEXT[] DEFAULT '{}',
  logo_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create challenges table (projects posted by companies)
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'Medium',
  credits INTEGER NOT NULL DEFAULT 50,
  deadline TIMESTAMP WITH TIME ZONE,
  required_skills TEXT[] DEFAULT '{}',
  category TEXT DEFAULT '',
  status challenge_status NOT NULL DEFAULT 'active',
  max_applicants INTEGER DEFAULT 50,
  current_applicants INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_applications table
CREATE TABLE public.project_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  status application_status NOT NULL DEFAULT 'pending',
  cover_letter TEXT DEFAULT '',
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (student_id, challenge_id)
);

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.project_applications(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  files_url TEXT DEFAULT '',
  video_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status submission_status NOT NULL DEFAULT 'draft',
  grade INTEGER,
  company_feedback TEXT DEFAULT '',
  teacher_feedback TEXT DEFAULT '',
  submitted_at TIMESTAMP WITH TIME ZONE,
  graded_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create grade_approvals table (for teacher approval workflow)
CREATE TABLE public.grade_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL UNIQUE,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  dispute_reason TEXT DEFAULT '',
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create credits_ledger table (transaction log for credits)
CREATE TABLE public.credits_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE SET NULL,
  submission_id UUID REFERENCES public.submissions(id) ON DELETE SET NULL,
  awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invitations table (for hiring)
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'interview',
  status invitation_status NOT NULL DEFAULT 'pending',
  message TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE
);

-- Create hiring_pipeline table
CREATE TABLE public.hiring_pipeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stage pipeline_stage NOT NULL DEFAULT 'shortlisted',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (student_id, company_id)
);

-- Create exemption_requests table
CREATE TABLE public.exemption_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  reason TEXT DEFAULT '',
  credits_at_request INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hiring_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exemption_requests ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles policies (users can only see their own role)
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Student profiles policies
CREATE POLICY "Students can view own student profile" ON public.student_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students can update own student profile" ON public.student_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Students can insert own student profile" ON public.student_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Companies can view student profiles" ON public.student_profiles FOR SELECT USING (public.has_role(auth.uid(), 'company'));
CREATE POLICY "Teachers can view student profiles" ON public.student_profiles FOR SELECT USING (public.has_role(auth.uid(), 'teacher'));

-- Teacher profiles policies
CREATE POLICY "Teachers can view own teacher profile" ON public.teacher_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Teachers can update own teacher profile" ON public.teacher_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Teachers can insert own teacher profile" ON public.teacher_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Company profiles policies
CREATE POLICY "Companies can view own company profile" ON public.company_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Companies can update own company profile" ON public.company_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Companies can insert own company profile" ON public.company_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can view company profiles" ON public.company_profiles FOR SELECT USING (true);

-- Challenges policies
CREATE POLICY "Anyone authenticated can view active challenges" ON public.challenges FOR SELECT TO authenticated USING (status = 'active' OR company_id = auth.uid());
CREATE POLICY "Companies can insert challenges" ON public.challenges FOR INSERT WITH CHECK (auth.uid() = company_id AND public.has_role(auth.uid(), 'company'));
CREATE POLICY "Companies can update own challenges" ON public.challenges FOR UPDATE USING (auth.uid() = company_id);
CREATE POLICY "Companies can delete own challenges" ON public.challenges FOR DELETE USING (auth.uid() = company_id);

-- Project applications policies
CREATE POLICY "Students can view own applications" ON public.project_applications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert applications" ON public.project_applications FOR INSERT WITH CHECK (auth.uid() = student_id AND public.has_role(auth.uid(), 'student'));
CREATE POLICY "Students can update own applications" ON public.project_applications FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Companies can view applications to their challenges" ON public.project_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.challenges WHERE challenges.id = challenge_id AND challenges.company_id = auth.uid())
);
CREATE POLICY "Companies can update applications to their challenges" ON public.project_applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.challenges WHERE challenges.id = challenge_id AND challenges.company_id = auth.uid())
);

-- Submissions policies
CREATE POLICY "Students can view own submissions" ON public.submissions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert submissions" ON public.submissions FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own submissions" ON public.submissions FOR UPDATE USING (auth.uid() = student_id AND status IN ('draft', 'submitted'));
CREATE POLICY "Companies can view submissions to their challenges" ON public.submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.challenges WHERE challenges.id = challenge_id AND challenges.company_id = auth.uid())
);
CREATE POLICY "Companies can update submissions to grade" ON public.submissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.challenges WHERE challenges.id = challenge_id AND challenges.company_id = auth.uid())
);
CREATE POLICY "Teachers can view submissions for approval" ON public.submissions FOR SELECT USING (public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Teachers can update submissions for approval" ON public.submissions FOR UPDATE USING (public.has_role(auth.uid(), 'teacher'));

-- Grade approvals policies
CREATE POLICY "Teachers can view grade approvals" ON public.grade_approvals FOR SELECT USING (public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Teachers can update grade approvals" ON public.grade_approvals FOR UPDATE USING (public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "System can insert grade approvals" ON public.grade_approvals FOR INSERT WITH CHECK (true);

-- Credits ledger policies
CREATE POLICY "Students can view own credits" ON public.credits_ledger FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "System can insert credits" ON public.credits_ledger FOR INSERT WITH CHECK (true);

-- Invitations policies
CREATE POLICY "Students can view own invitations" ON public.invitations FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can update own invitations" ON public.invitations FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Companies can view own invitations" ON public.invitations FOR SELECT USING (auth.uid() = company_id);
CREATE POLICY "Companies can insert invitations" ON public.invitations FOR INSERT WITH CHECK (auth.uid() = company_id AND public.has_role(auth.uid(), 'company'));

-- Hiring pipeline policies
CREATE POLICY "Companies can view own pipeline" ON public.hiring_pipeline FOR SELECT USING (auth.uid() = company_id);
CREATE POLICY "Companies can manage own pipeline" ON public.hiring_pipeline FOR ALL USING (auth.uid() = company_id);
CREATE POLICY "Students can view own pipeline status" ON public.hiring_pipeline FOR SELECT USING (auth.uid() = student_id);

-- Exemption requests policies
CREATE POLICY "Students can view own exemption requests" ON public.exemption_requests FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert exemption requests" ON public.exemption_requests FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Teachers can view exemption requests" ON public.exemption_requests FOR SELECT USING (public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Teachers can update exemption requests" ON public.exemption_requests FOR UPDATE USING (public.has_role(auth.uid(), 'teacher'));

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update student credits from ledger
CREATE OR REPLACE FUNCTION public.update_student_credits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.student_profiles
  SET total_credits = (
    SELECT COALESCE(SUM(amount), 0)
    FROM public.credits_ledger
    WHERE student_id = NEW.student_id
  )
  WHERE user_id = NEW.student_id;
  RETURN NEW;
END;
$$;

-- Trigger to auto-update credits
CREATE TRIGGER on_credit_added
  AFTER INSERT ON public.credits_ledger
  FOR EACH ROW EXECUTE FUNCTION public.update_student_credits();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON public.student_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teacher_profiles_updated_at BEFORE UPDATE ON public.teacher_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_company_profiles_updated_at BEFORE UPDATE ON public.company_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON public.challenges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hiring_pipeline_updated_at BEFORE UPDATE ON public.hiring_pipeline FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
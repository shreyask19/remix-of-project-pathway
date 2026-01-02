CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'student',
    'teacher',
    'company'
);


--
-- Name: application_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.application_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'withdrawn'
);


--
-- Name: challenge_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.challenge_status AS ENUM (
    'draft',
    'active',
    'closed',
    'archived'
);


--
-- Name: invitation_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.invitation_status AS ENUM (
    'pending',
    'accepted',
    'declined'
);


--
-- Name: pipeline_stage; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.pipeline_stage AS ENUM (
    'shortlisted',
    'interviewing',
    'offer_sent',
    'hired',
    'rejected'
);


--
-- Name: submission_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.submission_status AS ENUM (
    'draft',
    'submitted',
    'graded',
    'approved',
    'disputed'
);


--
-- Name: approve_grade_and_award_credits(uuid, uuid, integer, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.approve_grade_and_award_credits(p_submission_id uuid, p_teacher_id uuid, p_credits integer, p_challenge_id uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- Name: get_user_role(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_role(_user_id uuid) RETURNS public.app_role
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: update_student_credits(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_student_credits() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: challenges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    title text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    difficulty text DEFAULT 'Medium'::text NOT NULL,
    credits integer DEFAULT 50 NOT NULL,
    deadline timestamp with time zone,
    required_skills text[] DEFAULT '{}'::text[],
    category text DEFAULT ''::text,
    status public.challenge_status DEFAULT 'active'::public.challenge_status NOT NULL,
    max_applicants integer DEFAULT 50,
    current_applicants integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: company_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    company_name text DEFAULT ''::text NOT NULL,
    industry text DEFAULT ''::text,
    company_size text DEFAULT ''::text,
    website text DEFAULT ''::text,
    headquarters text DEFAULT ''::text,
    description text DEFAULT ''::text,
    contact_role text DEFAULT ''::text,
    hiring_roles text[] DEFAULT '{}'::text[],
    required_skills text[] DEFAULT '{}'::text[],
    logo_url text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: credits_ledger; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.credits_ledger (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    amount integer NOT NULL,
    reason text NOT NULL,
    challenge_id uuid,
    submission_id uuid,
    awarded_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: exemption_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exemption_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    teacher_id uuid,
    subject text NOT NULL,
    reason text DEFAULT ''::text,
    credits_at_request integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    reviewed_at timestamp with time zone
);


--
-- Name: grade_approvals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grade_approvals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    submission_id uuid NOT NULL,
    teacher_id uuid,
    status text DEFAULT 'pending'::text NOT NULL,
    dispute_reason text DEFAULT ''::text,
    approved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: hiring_pipeline; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hiring_pipeline (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    company_id uuid NOT NULL,
    stage public.pipeline_stage DEFAULT 'shortlisted'::public.pipeline_stage NOT NULL,
    notes text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: institutions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.institutions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    domain text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT institutions_type_check CHECK ((type = ANY (ARRAY['university'::text, 'college'::text, 'bootcamp'::text, 'corporate'::text])))
);


--
-- Name: invitations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invitations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    company_id uuid NOT NULL,
    role text DEFAULT ''::text NOT NULL,
    type text DEFAULT 'interview'::text NOT NULL,
    status public.invitation_status DEFAULT 'pending'::public.invitation_status NOT NULL,
    message text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    responded_at timestamp with time zone
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    first_name text DEFAULT ''::text NOT NULL,
    last_name text DEFAULT ''::text NOT NULL,
    email text DEFAULT ''::text NOT NULL,
    phone text DEFAULT ''::text,
    avatar_url text DEFAULT ''::text,
    is_onboarded boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    institution_id uuid
);


--
-- Name: project_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    challenge_id uuid NOT NULL,
    status public.application_status DEFAULT 'pending'::public.application_status NOT NULL,
    cover_letter text DEFAULT ''::text,
    applied_at timestamp with time zone DEFAULT now() NOT NULL,
    reviewed_at timestamp with time zone
);


--
-- Name: student_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    university_name text DEFAULT ''::text,
    university_program text DEFAULT ''::text,
    batch text DEFAULT ''::text,
    graduation_year text DEFAULT ''::text,
    current_semester text DEFAULT ''::text,
    current_subjects text[] DEFAULT '{}'::text[],
    existing_skills text[] DEFAULT '{}'::text[],
    interests text[] DEFAULT '{}'::text[],
    career_goals text[] DEFAULT '{}'::text[],
    preferred_project_types text[] DEFAULT '{}'::text[],
    linkedin_url text DEFAULT ''::text,
    github_url text DEFAULT ''::text,
    portfolio_url text DEFAULT ''::text,
    hours_per_week text DEFAULT ''::text,
    total_credits integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    institution_id uuid
);


--
-- Name: submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    student_id uuid NOT NULL,
    challenge_id uuid NOT NULL,
    files_url text DEFAULT ''::text,
    video_url text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    status public.submission_status DEFAULT 'draft'::public.submission_status NOT NULL,
    grade integer,
    company_feedback text DEFAULT ''::text,
    teacher_feedback text DEFAULT ''::text,
    submitted_at timestamp with time zone,
    graded_at timestamp with time zone,
    approved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: teacher_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teacher_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    designation text DEFAULT ''::text,
    institution_name text DEFAULT ''::text,
    institution_type text DEFAULT ''::text,
    department text DEFAULT ''::text,
    employee_id text DEFAULT ''::text,
    years_of_experience text DEFAULT ''::text,
    subjects_taught text[] DEFAULT '{}'::text[],
    specializations text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    institution_id uuid
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL
);


--
-- Name: challenges challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_pkey PRIMARY KEY (id);


--
-- Name: company_profiles company_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_profiles
    ADD CONSTRAINT company_profiles_pkey PRIMARY KEY (id);


--
-- Name: company_profiles company_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_profiles
    ADD CONSTRAINT company_profiles_user_id_key UNIQUE (user_id);


--
-- Name: credits_ledger credits_ledger_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credits_ledger
    ADD CONSTRAINT credits_ledger_pkey PRIMARY KEY (id);


--
-- Name: exemption_requests exemption_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exemption_requests
    ADD CONSTRAINT exemption_requests_pkey PRIMARY KEY (id);


--
-- Name: grade_approvals grade_approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grade_approvals
    ADD CONSTRAINT grade_approvals_pkey PRIMARY KEY (id);


--
-- Name: grade_approvals grade_approvals_submission_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grade_approvals
    ADD CONSTRAINT grade_approvals_submission_id_key UNIQUE (submission_id);


--
-- Name: hiring_pipeline hiring_pipeline_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hiring_pipeline
    ADD CONSTRAINT hiring_pipeline_pkey PRIMARY KEY (id);


--
-- Name: hiring_pipeline hiring_pipeline_student_id_company_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hiring_pipeline
    ADD CONSTRAINT hiring_pipeline_student_id_company_id_key UNIQUE (student_id, company_id);


--
-- Name: institutions institutions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.institutions
    ADD CONSTRAINT institutions_pkey PRIMARY KEY (id);


--
-- Name: invitations invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: project_applications project_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_applications
    ADD CONSTRAINT project_applications_pkey PRIMARY KEY (id);


--
-- Name: project_applications project_applications_student_id_challenge_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_applications
    ADD CONSTRAINT project_applications_student_id_challenge_id_key UNIQUE (student_id, challenge_id);


--
-- Name: student_profiles student_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_pkey PRIMARY KEY (id);


--
-- Name: student_profiles student_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_user_id_key UNIQUE (user_id);


--
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- Name: teacher_profiles teacher_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT teacher_profiles_pkey PRIMARY KEY (id);


--
-- Name: teacher_profiles teacher_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT teacher_profiles_user_id_key UNIQUE (user_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: credits_ledger on_credit_added; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_credit_added AFTER INSERT ON public.credits_ledger FOR EACH ROW EXECUTE FUNCTION public.update_student_credits();


--
-- Name: challenges update_challenges_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON public.challenges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: company_profiles update_company_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_company_profiles_updated_at BEFORE UPDATE ON public.company_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: hiring_pipeline update_hiring_pipeline_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_hiring_pipeline_updated_at BEFORE UPDATE ON public.hiring_pipeline FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: institutions update_institutions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON public.institutions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: student_profiles update_student_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON public.student_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: teacher_profiles update_teacher_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_teacher_profiles_updated_at BEFORE UPDATE ON public.teacher_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: challenges challenges_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_company_id_fkey FOREIGN KEY (company_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: company_profiles company_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_profiles
    ADD CONSTRAINT company_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: credits_ledger credits_ledger_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credits_ledger
    ADD CONSTRAINT credits_ledger_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE SET NULL;


--
-- Name: credits_ledger credits_ledger_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credits_ledger
    ADD CONSTRAINT credits_ledger_student_id_fkey FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: credits_ledger credits_ledger_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credits_ledger
    ADD CONSTRAINT credits_ledger_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE SET NULL;


--
-- Name: exemption_requests exemption_requests_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exemption_requests
    ADD CONSTRAINT exemption_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: exemption_requests exemption_requests_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exemption_requests
    ADD CONSTRAINT exemption_requests_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: grade_approvals grade_approvals_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grade_approvals
    ADD CONSTRAINT grade_approvals_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE;


--
-- Name: grade_approvals grade_approvals_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grade_approvals
    ADD CONSTRAINT grade_approvals_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: hiring_pipeline hiring_pipeline_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hiring_pipeline
    ADD CONSTRAINT hiring_pipeline_company_id_fkey FOREIGN KEY (company_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: hiring_pipeline hiring_pipeline_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hiring_pipeline
    ADD CONSTRAINT hiring_pipeline_student_id_fkey FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: invitations invitations_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_company_id_fkey FOREIGN KEY (company_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: invitations invitations_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_student_id_fkey FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_institution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES public.institutions(id);


--
-- Name: project_applications project_applications_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_applications
    ADD CONSTRAINT project_applications_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;


--
-- Name: project_applications project_applications_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_applications
    ADD CONSTRAINT project_applications_student_id_fkey FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: student_profiles student_profiles_institution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES public.institutions(id);


--
-- Name: student_profiles student_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profiles
    ADD CONSTRAINT student_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: submissions submissions_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.project_applications(id) ON DELETE CASCADE;


--
-- Name: submissions submissions_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;


--
-- Name: submissions submissions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: teacher_profiles teacher_profiles_institution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT teacher_profiles_institution_id_fkey FOREIGN KEY (institution_id) REFERENCES public.institutions(id);


--
-- Name: teacher_profiles teacher_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT teacher_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: challenges Anyone authenticated can view active challenges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone authenticated can view active challenges" ON public.challenges FOR SELECT TO authenticated USING (((status = 'active'::public.challenge_status) OR (company_id = auth.uid())));


--
-- Name: company_profiles Anyone can view company profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view company profiles" ON public.company_profiles FOR SELECT USING (true);


--
-- Name: institutions Anyone can view institutions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view institutions" ON public.institutions FOR SELECT USING (true);


--
-- Name: challenges Companies can delete own challenges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Companies can delete own challenges" ON public.challenges FOR DELETE USING ((auth.uid() = company_id));


--
-- Name: challenges Companies can insert challenges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Companies can insert challenges" ON public.challenges FOR INSERT WITH CHECK (((auth.uid() = company_id) AND public.has_role(auth.uid(), 'company'::public.app_role)));


--
-- Name: invitations Companies can insert invitations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Companies can insert invitations" ON public.invitations FOR INSERT WITH CHECK (((auth.uid() = company_id) AND public.has_role(auth.uid(), 'company'::public.app_role)));


--
-- Name: company_profiles Companies can insert own company profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Companies can insert own company profile" ON public.company_profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: hiring_pipeline Companies can manage own pipeline; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Companies can manage own pipeline" ON public.hiring_pipeline USING ((auth.uid() = company_id));


--
-- Name: project_applications Companies can update applications to their challenges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Companies can update applications to their challenges" ON public.project_applications FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.challenges
  WHERE ((challenges.id = project_applications.challenge_id) AND (challenges.company_id = auth.uid())))));


--
-- Name: challenges Companies can update own challenges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Companies can update own challenges" ON public.challenges FOR UPDATE USING ((auth.uid() = company_id));


--
-- Name: company_profiles Companies can update own company profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Companies can update own company profile" ON public.company_profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: submissions Companies can update submissions to grade; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Companies can update submissions to grade" ON public.submissions FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.challenges
  WHERE ((challenges.id = submissions.challenge_id) AND (challenges.company_id = auth.uid())))));


--
-- Name: project_applications Companies can view applications to their challenges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Companies can view applications to their challenges" ON public.project_applications FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.challenges
  WHERE ((challenges.id = project_applications.challenge_id) AND (challenges.company_id = auth.uid())))));


--
-- Name: company_profiles Companies can view own company profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Companies can view own company profile" ON public.company_profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: invitations Companies can view own invitations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Companies can view own invitations" ON public.invitations FOR SELECT USING ((auth.uid() = company_id));


--
-- Name: hiring_pipeline Companies can view own pipeline; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Companies can view own pipeline" ON public.hiring_pipeline FOR SELECT USING ((auth.uid() = company_id));


--
-- Name: student_profiles Companies can view student profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Companies can view student profiles" ON public.student_profiles FOR SELECT USING (public.has_role(auth.uid(), 'company'::public.app_role));


--
-- Name: submissions Companies can view submissions to their challenges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Companies can view submissions to their challenges" ON public.submissions FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.challenges
  WHERE ((challenges.id = submissions.challenge_id) AND (challenges.company_id = auth.uid())))));


--
-- Name: project_applications Students can insert applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can insert applications" ON public.project_applications FOR INSERT WITH CHECK (((auth.uid() = student_id) AND public.has_role(auth.uid(), 'student'::public.app_role)));


--
-- Name: exemption_requests Students can insert exemption requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can insert exemption requests" ON public.exemption_requests FOR INSERT WITH CHECK ((auth.uid() = student_id));


--
-- Name: student_profiles Students can insert own student profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can insert own student profile" ON public.student_profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: submissions Students can insert submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can insert submissions" ON public.submissions FOR INSERT WITH CHECK ((auth.uid() = student_id));


--
-- Name: project_applications Students can update own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can update own applications" ON public.project_applications FOR UPDATE USING ((auth.uid() = student_id));


--
-- Name: invitations Students can update own invitations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can update own invitations" ON public.invitations FOR UPDATE USING ((auth.uid() = student_id));


--
-- Name: student_profiles Students can update own student profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can update own student profile" ON public.student_profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: submissions Students can update own submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can update own submissions" ON public.submissions FOR UPDATE USING (((auth.uid() = student_id) AND (status = ANY (ARRAY['draft'::public.submission_status, 'submitted'::public.submission_status]))));


--
-- Name: project_applications Students can view own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can view own applications" ON public.project_applications FOR SELECT USING ((auth.uid() = student_id));


--
-- Name: credits_ledger Students can view own credits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can view own credits" ON public.credits_ledger FOR SELECT USING ((auth.uid() = student_id));


--
-- Name: exemption_requests Students can view own exemption requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can view own exemption requests" ON public.exemption_requests FOR SELECT USING ((auth.uid() = student_id));


--
-- Name: invitations Students can view own invitations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can view own invitations" ON public.invitations FOR SELECT USING ((auth.uid() = student_id));


--
-- Name: hiring_pipeline Students can view own pipeline status; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can view own pipeline status" ON public.hiring_pipeline FOR SELECT USING ((auth.uid() = student_id));


--
-- Name: student_profiles Students can view own student profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can view own student profile" ON public.student_profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: submissions Students can view own submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Students can view own submissions" ON public.submissions FOR SELECT USING ((auth.uid() = student_id));


--
-- Name: credits_ledger Teachers can award credits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Teachers can award credits" ON public.credits_ledger FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'teacher'::public.app_role));


--
-- Name: grade_approvals Teachers can create grade approvals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Teachers can create grade approvals" ON public.grade_approvals FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'teacher'::public.app_role));


--
-- Name: teacher_profiles Teachers can insert own teacher profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Teachers can insert own teacher profile" ON public.teacher_profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: exemption_requests Teachers can update exemption requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Teachers can update exemption requests" ON public.exemption_requests FOR UPDATE USING (public.has_role(auth.uid(), 'teacher'::public.app_role));


--
-- Name: grade_approvals Teachers can update grade approvals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Teachers can update grade approvals" ON public.grade_approvals FOR UPDATE USING (public.has_role(auth.uid(), 'teacher'::public.app_role));


--
-- Name: teacher_profiles Teachers can update own teacher profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Teachers can update own teacher profile" ON public.teacher_profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: submissions Teachers can update submissions from same institution; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Teachers can update submissions from same institution" ON public.submissions FOR UPDATE USING ((public.has_role(auth.uid(), 'teacher'::public.app_role) AND (student_id IN ( SELECT sp.user_id
   FROM public.student_profiles sp
  WHERE ((sp.institution_id IS NULL) OR (sp.institution_id IN ( SELECT tp.institution_id
           FROM public.teacher_profiles tp
          WHERE (tp.user_id = auth.uid()))))))));


--
-- Name: exemption_requests Teachers can view exemption requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Teachers can view exemption requests" ON public.exemption_requests FOR SELECT USING (public.has_role(auth.uid(), 'teacher'::public.app_role));


--
-- Name: grade_approvals Teachers can view grade approvals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Teachers can view grade approvals" ON public.grade_approvals FOR SELECT USING (public.has_role(auth.uid(), 'teacher'::public.app_role));


--
-- Name: teacher_profiles Teachers can view own teacher profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Teachers can view own teacher profile" ON public.teacher_profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: student_profiles Teachers can view student profiles from same institution; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Teachers can view student profiles from same institution" ON public.student_profiles FOR SELECT USING ((public.has_role(auth.uid(), 'teacher'::public.app_role) AND ((institution_id IS NULL) OR (institution_id IN ( SELECT tp.institution_id
   FROM public.teacher_profiles tp
  WHERE (tp.user_id = auth.uid()))))));


--
-- Name: submissions Teachers can view submissions from same institution; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Teachers can view submissions from same institution" ON public.submissions FOR SELECT USING ((public.has_role(auth.uid(), 'teacher'::public.app_role) AND (student_id IN ( SELECT sp.user_id
   FROM public.student_profiles sp
  WHERE ((sp.institution_id IS NULL) OR (sp.institution_id IN ( SELECT tp.institution_id
           FROM public.teacher_profiles tp
          WHERE (tp.user_id = auth.uid()))))))));


--
-- Name: profiles Users can insert own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: user_roles Users can insert own role; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own role" ON public.user_roles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: user_roles Users can view own role; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: challenges; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: company_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: credits_ledger; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.credits_ledger ENABLE ROW LEVEL SECURITY;

--
-- Name: exemption_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.exemption_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: grade_approvals; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.grade_approvals ENABLE ROW LEVEL SECURITY;

--
-- Name: hiring_pipeline; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.hiring_pipeline ENABLE ROW LEVEL SECURITY;

--
-- Name: institutions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

--
-- Name: invitations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: project_applications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.project_applications ENABLE ROW LEVEL SECURITY;

--
-- Name: student_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: submissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: teacher_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;
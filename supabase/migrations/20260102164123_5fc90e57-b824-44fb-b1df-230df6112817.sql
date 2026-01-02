-- Phase 1: Database Schema Enhancement & Core Tables

-- 1. Create teacher_settings table
CREATE TABLE public.teacher_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  credit_threshold INTEGER NOT NULL DEFAULT 500,
  min_projects INTEGER NOT NULL DEFAULT 3,
  ia_deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Create activity_logs table
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster activity lookups
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- 3. Add instructions and restrictions columns to challenges
ALTER TABLE public.challenges 
ADD COLUMN IF NOT EXISTS instructions TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS restrictions TEXT[] DEFAULT '{}';

-- 4. Enable RLS on new tables
ALTER TABLE public.teacher_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for teacher_settings
CREATE POLICY "Teachers can view own settings"
ON public.teacher_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Teachers can insert own settings"
ON public.teacher_settings FOR INSERT
WITH CHECK (auth.uid() = user_id AND has_role(auth.uid(), 'teacher'::app_role));

CREATE POLICY "Teachers can update own settings"
ON public.teacher_settings FOR UPDATE
USING (auth.uid() = user_id);

-- 6. RLS Policies for activity_logs
CREATE POLICY "Users can view own activity"
ON public.activity_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity logs"
ON public.activity_logs FOR INSERT
WITH CHECK (true);

-- 7. Update trigger for teacher_settings
CREATE TRIGGER update_teacher_settings_updated_at
BEFORE UPDATE ON public.teacher_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Function to log activity
CREATE OR REPLACE FUNCTION public.log_activity(
  p_user_id UUID,
  p_action_type TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.activity_logs (user_id, action_type, entity_type, entity_id, metadata)
  VALUES (p_user_id, p_action_type, p_entity_type, p_entity_id, p_metadata)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- 9. Trigger function for submission activity logging
CREATE OR REPLACE FUNCTION public.log_submission_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_activity(
      NEW.student_id,
      'submission_created',
      'submission',
      NEW.id,
      jsonb_build_object('challenge_id', NEW.challenge_id, 'status', NEW.status)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    -- Log status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      PERFORM public.log_activity(
        NEW.student_id,
        'submission_' || NEW.status,
        'submission',
        NEW.id,
        jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status, 'grade', NEW.grade)
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- 10. Create trigger on submissions table
CREATE TRIGGER log_submission_changes
AFTER INSERT OR UPDATE ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.log_submission_activity();

-- 11. Trigger function for grade approval activity logging
CREATE OR REPLACE FUNCTION public.log_grade_approval_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    PERFORM public.log_activity(
      NEW.teacher_id,
      'grade_' || NEW.status,
      'grade_approval',
      NEW.id,
      jsonb_build_object('submission_id', NEW.submission_id, 'status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$;

-- 12. Create trigger on grade_approvals table
CREATE TRIGGER log_grade_approval_changes
AFTER INSERT OR UPDATE ON public.grade_approvals
FOR EACH ROW
EXECUTE FUNCTION public.log_grade_approval_activity();
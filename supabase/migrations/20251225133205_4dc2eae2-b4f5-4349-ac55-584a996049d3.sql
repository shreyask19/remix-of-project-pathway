-- Fix overly permissive INSERT policies on credits_ledger and grade_approvals

-- Drop the existing overly permissive policies
DROP POLICY IF EXISTS "System can insert credits" ON public.credits_ledger;
DROP POLICY IF EXISTS "System can insert grade approvals" ON public.grade_approvals;

-- Create restrictive policies that only allow teachers to insert
CREATE POLICY "Teachers can award credits" 
ON public.credits_ledger 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'teacher'::app_role));

CREATE POLICY "Teachers can create grade approvals" 
ON public.grade_approvals 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'teacher'::app_role));
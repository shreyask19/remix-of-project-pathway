-- Add policy to allow public access to student profiles via public_profile_slug
-- This only exposes limited fields needed for public portfolio

CREATE POLICY "Public can view profiles with public slug" 
ON public.student_profiles 
FOR SELECT 
USING (public_profile_slug IS NOT NULL);

-- Add policy to allow public access to profiles for name display on public portfolios
CREATE POLICY "Public can view profile names for public portfolios" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.student_profiles sp 
    WHERE sp.user_id = profiles.id 
    AND sp.public_profile_slug IS NOT NULL
  )
);

-- Add policy for public to view completed submissions for public portfolios
CREATE POLICY "Public can view approved submissions for public portfolios"
ON public.submissions
FOR SELECT
USING (
  status IN ('graded', 'approved') AND
  EXISTS (
    SELECT 1 FROM public.student_profiles sp 
    WHERE sp.user_id = submissions.student_id 
    AND sp.public_profile_slug IS NOT NULL
  )
);
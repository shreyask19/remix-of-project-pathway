-- Create trigger to automatically create profile when user signs up
-- This was missing and causing routing issues

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also create profiles for any existing users that don't have one
INSERT INTO public.profiles (id, first_name, last_name, email, is_onboarded)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data ->> 'first_name', ''),
  COALESCE(u.raw_user_meta_data ->> 'last_name', ''),
  u.email,
  false
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
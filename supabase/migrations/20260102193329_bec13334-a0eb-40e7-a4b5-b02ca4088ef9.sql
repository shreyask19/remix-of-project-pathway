-- Phase 1: Fix user_roles to enforce single role per user

-- Step 1: Add created_at column for auditing
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

-- Step 2: Clean up any duplicate roles (keep one per user)
-- Delete all but the first role for each user (by id, deterministic)
DELETE FROM public.user_roles a
USING public.user_roles b
WHERE a.user_id = b.user_id
  AND a.id > b.id;

-- Step 3: Drop the existing constraint that allows multiple roles per user
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;

-- Step 4: Add unique constraint on user_id only (exactly one role per user)
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);

-- Step 5: Add UPDATE policy so users can change their role (for upsert to work)
CREATE POLICY "Users can update own role"
ON public.user_roles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Phase 3: Remove the unsafe trigger on auth.users (reserved schema)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
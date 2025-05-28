-- ============================================================================
-- SYNC: Supabase Auth Users to User Table
-- ============================================================================
-- This script synchronizes users from auth.users to the public.User table
-- It handles the passwordHash field by using a placeholder since Supabase
-- manages authentication separately from our User table.

-- First, let's see what users exist in auth.users but not in public.User
SELECT 
  au.id,
  au.email,
  au.created_at,
  au.updated_at,
  CASE WHEN u.id IS NULL THEN 'MISSING FROM User TABLE' ELSE 'EXISTS IN User TABLE' END as status
FROM auth.users au
LEFT JOIN public."User" u ON au.id::text = u.id
ORDER BY au.created_at;

-- Insert missing users from auth.users into public.User table
-- We use a placeholder for passwordHash since Supabase handles auth
INSERT INTO public."User" (
  id, 
  email, 
  name, 
  "passwordHash", 
  role, 
  "createdAt", 
  "updatedAt"
)
SELECT 
  au.id::text,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', NULL) as name,
  '$2a$06$SUPABASE_AUTH_MANAGED_PASSWORD_PLACEHOLDER' as "passwordHash", -- Placeholder since Supabase manages auth
  'USER' as role, -- Default role, you can change specific users to ADMIN later
  au.created_at as "createdAt",
  au.updated_at as "updatedAt"
FROM auth.users au
LEFT JOIN public."User" u ON au.id::text = u.id
WHERE u.id IS NULL; -- Only insert users that don't exist in User table

-- Update existing users' email and metadata if changed
UPDATE public."User" 
SET 
  email = au.email,
  name = COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', public."User".name),
  "updatedAt" = au.updated_at
FROM auth.users au
WHERE public."User".id = au.id::text
  AND (
    public."User".email != au.email 
    OR public."User"."updatedAt" < au.updated_at
  );

-- Show final result
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  u."createdAt",
  u."updatedAt",
  CASE WHEN au.id IS NOT NULL THEN 'SYNCED' ELSE 'ORPHANED' END as auth_status
FROM public."User" u
LEFT JOIN auth.users au ON u.id = au.id::text
ORDER BY u."createdAt";

-- ============================================================================
-- MANUAL ADMIN ROLE ASSIGNMENT
-- ============================================================================
-- After running the sync, manually set admin roles for specific users:

-- Set jeffrey@gmail.com as ADMIN
UPDATE public."User" 
SET role = 'ADMIN' 
WHERE email = 'jeffrey@gmail.com';

-- Set jeffrey@jeffdash.com as ADMIN (if you want both to be admin)
UPDATE public."User" 
SET role = 'ADMIN' 
WHERE email = 'jeffrey@jeffdash.com';

-- Verify admin users
SELECT id, email, role, "createdAt" 
FROM public."User" 
WHERE role = 'ADMIN'
ORDER BY "createdAt"; 
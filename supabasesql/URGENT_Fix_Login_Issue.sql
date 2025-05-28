-- =====================================================
-- URGENT FIX: Login Issues Resolution
-- Description: Comprehensive fix for login problems
-- =====================================================

-- =====================================================
-- STEP 1: DIAGNOSE THE PROBLEM
-- =====================================================

SELECT '=== DIAGNOSIS: Current Auth State ===' AS status;

-- Check auth.users
SELECT 'AUTH.USERS' as table_name, COUNT(*) as count FROM auth.users;
SELECT 
  id,
  email,
  email_confirmed_at,
  encrypted_password IS NOT NULL as has_password,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email IN ('jeffrey@gmail.com', 'jeffrey@jeffdash.com')
ORDER BY email;

-- Check public.User
SELECT 'PUBLIC.USER' as table_name, COUNT(*) as count FROM public."User";
SELECT 
  id,
  email,
  role,
  "passwordHash" LIKE '%PLACEHOLDER%' as is_placeholder,
  "createdAt"
FROM public."User" 
WHERE email IN ('jeffrey@gmail.com', 'jeffrey@jeffdash.com')
ORDER BY email;

-- =====================================================
-- STEP 2: RESET PASSWORDS PROPERLY
-- =====================================================

-- For users that exist in auth.users but can't login,
-- we need to reset their passwords properly through Supabase Auth

-- This generates the SQL commands you need to run in Supabase dashboard
SELECT 
  'Password reset needed for: ' || email || ' (User ID: ' || id || ')' as action,
  'Run this in Supabase Auth Dashboard: Send Password Reset Email to ' || email as instruction
FROM auth.users 
WHERE email IN ('jeffrey@gmail.com', 'jeffrey@jeffdash.com');

-- =====================================================
-- STEP 3: SYNC USERS TO PUBLIC.USER TABLE
-- =====================================================

-- Insert missing users from auth.users to public.User
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
  COALESCE(
    au.raw_user_meta_data->>'full_name', 
    au.raw_user_meta_data->>'name', 
    'Admin User'
  ) as name,
  '$2a$06$SUPABASE_AUTH_MANAGED_PASSWORD_PLACEHOLDER' as "passwordHash",
  'ADMIN' as role, -- Setting both as ADMIN
  au.created_at as "createdAt",
  au.updated_at as "updatedAt"
FROM auth.users au
LEFT JOIN public."User" u ON au.id::text = u.id
WHERE u.id IS NULL 
  AND au.email IN ('jeffrey@gmail.com', 'jeffrey@jeffdash.com');

-- Update existing users to ADMIN role
UPDATE public."User" 
SET 
  role = 'ADMIN',
  "updatedAt" = NOW()
WHERE email IN ('jeffrey@gmail.com', 'jeffrey@jeffdash.com')
  AND role != 'ADMIN';

-- =====================================================
-- STEP 4: CREATE FRESH ADMIN USER (IF NEEDED)
-- =====================================================

-- If you want to create a completely new admin user with a known password
-- UNCOMMENT and run this section:

/*
-- First, you'll need to create the user in Supabase Auth Dashboard with email: admin@jeffdash.com
-- Then run this to add them to the User table:

-- INSERT INTO public."User" (
--   id, 
--   email, 
--   name, 
--   "passwordHash", 
--   role, 
--   "createdAt", 
--   "updatedAt"
-- ) VALUES (
--   'NEW_USER_ID_FROM_AUTH_DASHBOARD', -- Replace with actual UUID from auth.users
--   'admin@jeffdash.com',
--   'Fresh Admin User',
--   '$2a$06$SUPABASE_AUTH_MANAGED_PASSWORD_PLACEHOLDER',
--   'ADMIN',
--   NOW(),
--   NOW()
-- );
*/

-- =====================================================
-- STEP 5: VERIFICATION
-- =====================================================

SELECT '=== VERIFICATION: After Fix ===' AS status;

-- Show final sync status
SELECT 
  'FINAL STATUS' as check,
  au.id,
  au.email,
  u.role,
  au.email_confirmed_at IS NOT NULL as email_confirmed,
  au.encrypted_password IS NOT NULL as has_password,
  CASE 
    WHEN u.id IS NOT NULL THEN 'SYNCED' 
    ELSE 'MISSING' 
  END as sync_status
FROM auth.users au
LEFT JOIN public."User" u ON au.id::text = u.id
WHERE au.email IN ('jeffrey@gmail.com', 'jeffrey@jeffdash.com')
ORDER BY au.email;

-- Show all admin users
SELECT 
  'ADMIN USERS' as type,
  id,
  email,
  role,
  "createdAt"
FROM public."User" 
WHERE role = 'ADMIN'
ORDER BY "createdAt";

-- =====================================================
-- STEP 6: NEXT STEPS
-- =====================================================

SELECT '=== NEXT STEPS ===' AS instruction;
SELECT 'After running this script:' AS step;
SELECT '1. Go to Supabase Dashboard > Authentication > Users' AS step;
SELECT '2. For each user that cannot login, click "Send Password Reset Email"' AS step;
SELECT '3. Check your email and reset passwords' AS step;
SELECT '4. Try logging in with the new passwords' AS step;
SELECT '5. If still having issues, check RLS policies' AS step;

-- Show RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'User' 
  AND schemaname = 'public'; 
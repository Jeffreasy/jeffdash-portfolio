-- ============================================================================
-- CREATE TEST USER - COMPREHENSIVE APPROACH
-- ============================================================================
-- This script creates a test user and ensures it exists in both auth.users 
-- and public.User tables properly

-- ============================================================================
-- 1. CLEANUP - Remove existing test users
-- ============================================================================

-- Remove from public.User first (to avoid FK issues)
DELETE FROM "User" WHERE email = 'test@jeffdash.com';

-- Note: We cannot directly delete from auth.users via SQL
-- You'll need to delete the user from Supabase Auth dashboard if it exists

-- ============================================================================
-- 2. CREATE USER IN AUTH.USERS (via Supabase Auth API)
-- ============================================================================

-- This part shows you what to do manually in Supabase Dashboard:
SELECT '=== MANUAL STEPS REQUIRED ===' AS section;
SELECT 'Go to Supabase Dashboard > Authentication > Users' AS step1;
SELECT 'Click "Add User" or use SQL below in a server context' AS step2;
SELECT 'Email: test@jeffdash.com' AS step3;
SELECT 'Password: TestPassword123!' AS step4;
SELECT 'Auto Confirm: YES (check the box)' AS step5;

-- ============================================================================
-- 3. ALTERNATIVE: Create user directly if you have admin access
-- ============================================================================

-- This function can be used if you have proper permissions
-- Run this AFTER creating the user in Supabase Auth dashboard

-- First, let's see what user ID we'll get (you'll need to replace this)
SELECT 'After creating user in Auth dashboard, find the user ID and update this script' AS note;

-- ============================================================================
-- 4. SYNC USER TO PUBLIC.USER TABLE
-- ============================================================================

-- This will sync the user once it exists in auth.users
-- Replace 'USER_ID_FROM_AUTH' with the actual UUID from auth dashboard

-- Example (you'll need to update the ID):
/*
INSERT INTO "User" (
  id,
  email,
  name,
  "passwordHash",
  role,
  "createdAt", 
  "updatedAt"
) VALUES (
  'USER_ID_FROM_AUTH_DASHBOARD', -- Replace with actual UUID
  'test@jeffdash.com',
  'Test User',
  '$2a$06$SUPABASE_AUTH_MANAGED_PASSWORD_PLACEHOLDER',
  'ADMIN',
  NOW(),
  NOW()
);
*/

-- ============================================================================
-- 5. VERIFICATION
-- ============================================================================

-- Check if user exists in auth.users
SELECT 'Checking auth.users:' AS check;
SELECT id, email, email_confirmed_at, created_at
FROM auth.users 
WHERE email = 'test@jeffdash.com';

-- Check if user exists in public.User
SELECT 'Checking public.User:' AS check;
SELECT id, email, role, "createdAt"
FROM "User" 
WHERE email = 'test@jeffdash.com';

-- ============================================================================
-- 6. ALTERNATIVE: AUTOMATED SYNC FOR EXISTING AUTH USERS
-- ============================================================================

-- This syncs ALL auth users to public.User (run if user already exists in auth)
INSERT INTO "User" (
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
  COALESCE(au.raw_user_meta_data->>'full_name', 'Test User') as name,
  '$2a$06$SUPABASE_AUTH_MANAGED_PASSWORD_PLACEHOLDER',
  'ADMIN' as role,
  au.created_at,
  au.updated_at
FROM auth.users au
LEFT JOIN "User" u ON au.id::text = u.id
WHERE au.email = 'test@jeffdash.com'
  AND u.id IS NULL; -- Only insert if not already exists

-- ============================================================================
-- 7. FINAL VERIFICATION
-- ============================================================================

SELECT 'FINAL CHECK - User should exist in both tables:' AS final_check;

-- Auth users
SELECT 'auth.users:' AS table_name, COUNT(*) as count
FROM auth.users 
WHERE email = 'test@jeffdash.com';

-- Public User  
SELECT 'public.User:' AS table_name, COUNT(*) as count
FROM "User" 
WHERE email = 'test@jeffdash.com';

-- Test RLS access
SELECT 'Testing RLS access to User table:' AS test;
SELECT id, email, role FROM "User" WHERE email = 'test@jeffdash.com';

SELECT 'Script completed. Test login with test@jeffdash.com / TestPassword123!' AS instruction; 
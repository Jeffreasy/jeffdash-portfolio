-- ============================================================================
-- COMPLETE AUTHENTICATION DEBUG INVESTIGATION
-- ============================================================================
-- This script investigates every aspect of the auth system to find login issues

-- ============================================================================
-- 1. CHECK AUTH.USERS TABLE (Supabase Auth)
-- ============================================================================

SELECT '=== SUPABASE AUTH.USERS INVESTIGATION ===' AS section;

-- Check if users exist in auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ CONFIRMED'
    ELSE '❌ NOT CONFIRMED'
  END as email_status,
  CASE 
    WHEN encrypted_password IS NOT NULL THEN '✅ HAS PASSWORD'
    ELSE '❌ NO PASSWORD'
  END as password_status
FROM auth.users 
WHERE email IN ('jeffrey@gmail.com', 'jeffrey@jeffdash.com')
ORDER BY email;

-- Check if there are ANY users in auth.users
SELECT 'Total users in auth.users:' AS info, COUNT(*) as total_count FROM auth.users;

-- ============================================================================
-- 2. CHECK PUBLIC.USER TABLE
-- ============================================================================

SELECT '=== PUBLIC.USER TABLE INVESTIGATION ===' AS section;

-- Check if users exist in public.User
SELECT 
  id,
  email,
  name,
  role,
  "createdAt",
  "updatedAt",
  CASE 
    WHEN "passwordHash" LIKE '%PLACEHOLDER%' THEN '⚠️ PLACEHOLDER HASH'
    WHEN "passwordHash" IS NOT NULL THEN '✅ HAS HASH'
    ELSE '❌ NO HASH'
  END as password_status
FROM "User" 
WHERE email IN ('jeffrey@gmail.com', 'jeffrey@jeffdash.com')
ORDER BY email;

-- Check ALL users in public.User
SELECT 'All users in public.User:' AS info;
SELECT id, email, role, "createdAt" FROM "User" ORDER BY "createdAt";

-- ============================================================================
-- 3. CHECK USER SYNC BETWEEN AUTH.USERS AND PUBLIC.USER
-- ============================================================================

SELECT '=== USER SYNC INVESTIGATION ===' AS section;

-- Find users in auth.users but NOT in public.User
SELECT 'Users in auth.users but MISSING from public.User:' AS issue;
SELECT 
  au.id,
  au.email,
  au.created_at,
  'MISSING FROM PUBLIC.USER' as status
FROM auth.users au
LEFT JOIN "User" u ON au.id::text = u.id
WHERE u.id IS NULL;

-- Find users in public.User but NOT in auth.users
SELECT 'Users in public.User but MISSING from auth.users:' AS issue;
SELECT 
  u.id,
  u.email,
  u."createdAt",
  'MISSING FROM AUTH.USERS' as status
FROM "User" u
LEFT JOIN auth.users au ON u.id = au.id::text
WHERE au.id IS NULL;

-- ============================================================================
-- 4. TEST AUTHENTICATION FUNCTIONS
-- ============================================================================

SELECT '=== AUTHENTICATION FUNCTIONS TEST ===' AS section;

-- Test is_admin function
SELECT 'Testing is_admin() function:' AS test;
SELECT is_admin() as is_current_user_admin;

-- Test auth.uid() 
SELECT 'Current auth.uid():' AS test;
SELECT auth.uid() as current_auth_uid;

-- ============================================================================
-- 5. CHECK RLS POLICIES STATUS
-- ============================================================================

SELECT '=== RLS POLICIES INVESTIGATION ===' AS section;

-- Check User table RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  CASE 
    WHEN rowsecurity THEN '✅ RLS ENABLED'
    ELSE '❌ RLS DISABLED'
  END as rls_status
FROM pg_tables 
WHERE tablename = 'User';

-- Check current User table policies
SELECT 'Current User table policies:' AS info;
SELECT 
  policyname,
  cmd,
  permissive,
  SUBSTRING(qual, 1, 50) as using_clause
FROM pg_policies 
WHERE tablename = 'User'
ORDER BY policyname;

-- ============================================================================
-- 6. TEST BASIC USER TABLE ACCESS
-- ============================================================================

SELECT '=== USER TABLE ACCESS TEST ===' AS section;

-- Try to select from User table (simple version)
SELECT 'Testing SELECT access to User table:' AS test;
SELECT COUNT(*) as accessible_users FROM "User";

-- ============================================================================
-- 7. CHECK SUPABASE CONFIGURATION
-- ============================================================================

SELECT '=== SUPABASE CONFIGURATION CHECK ===' AS section;

-- Check if we can access auth schema
SELECT 'Auth schema access test:' AS test;
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ CAN ACCESS AUTH SCHEMA'
    ELSE '❌ CANNOT ACCESS AUTH SCHEMA'
  END as auth_access_status
FROM information_schema.tables 
WHERE table_schema = 'auth';

-- ============================================================================
-- 8. SPECIFIC EMAIL CHECKS
-- ============================================================================

SELECT '=== SPECIFIC EMAIL INVESTIGATION ===' AS section;

-- Check exact email matches in auth.users
SELECT 'Exact email check in auth.users:' AS test;
SELECT 
  email,
  email = 'jeffrey@gmail.com' as gmail_match,
  email = 'jeffrey@jeffdash.com' as jeffdash_match,
  LENGTH(email) as email_length,
  email_confirmed_at IS NOT NULL as is_confirmed
FROM auth.users 
WHERE email LIKE '%jeffrey%';

-- Check exact email matches in public.User
SELECT 'Exact email check in public.User:' AS test;
SELECT 
  email,
  email = 'jeffrey@gmail.com' as gmail_match,
  email = 'jeffrey@jeffdash.com' as jeffdash_match,
  LENGTH(email) as email_length,
  role
FROM "User" 
WHERE email LIKE '%jeffrey%';

-- ============================================================================
-- 9. FINAL SUMMARY
-- ============================================================================

SELECT '=== INVESTIGATION SUMMARY ===' AS section;
SELECT 'Investigation completed. Check results above for issues.' AS summary; 
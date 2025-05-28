-- ============================================================================
-- CHECK: User Authentication Status
-- ============================================================================
-- This script helps you understand the current state of users across
-- Supabase Auth and your public.User table

-- 1. Show all auth.users and their status in public.User table
SELECT 
  'AUTH USER' as source,
  au.id,
  au.email,
  au.created_at,
  au.updated_at,
  au.email_confirmed_at,
  au.last_sign_in_at,
  CASE 
    WHEN u.id IS NOT NULL THEN '✅ EXISTS IN User TABLE'
    ELSE '❌ MISSING FROM User TABLE'
  END as user_table_status,
  u.role as current_role
FROM auth.users au
LEFT JOIN public."User" u ON au.id::text = u.id
ORDER BY au.created_at;

-- 2. Show all public.User records and their auth status
SELECT 
  'USER TABLE' as source,
  u.id,
  u.email,
  u.role,
  u."createdAt",
  u."updatedAt",
  CASE 
    WHEN au.id IS NOT NULL THEN '✅ HAS AUTH ACCOUNT'
    ELSE '❌ ORPHANED (NO AUTH)'
  END as auth_status,
  au.email_confirmed_at,
  au.last_sign_in_at
FROM public."User" u
LEFT JOIN auth.users au ON u.id = au.id::text
ORDER BY u."createdAt";

-- 3. Summary statistics
SELECT 
  'SUMMARY' as type,
  (SELECT COUNT(*) FROM auth.users) as total_auth_users,
  (SELECT COUNT(*) FROM public."User") as total_user_records,
  (SELECT COUNT(*) FROM auth.users au WHERE NOT EXISTS (SELECT 1 FROM public."User" u WHERE u.id = au.id::text)) as missing_from_user_table,
  (SELECT COUNT(*) FROM public."User" u WHERE NOT EXISTS (SELECT 1 FROM auth.users au WHERE au.id::text = u.id)) as orphaned_user_records,
  (SELECT COUNT(*) FROM public."User" WHERE role = 'ADMIN') as admin_users;

-- 4. Show users that need to be synced
SELECT 
  'NEEDS SYNC' as action,
  au.id,
  au.email,
  au.created_at,
  'Will be added to User table with USER role' as note
FROM auth.users au
LEFT JOIN public."User" u ON au.id::text = u.id
WHERE u.id IS NULL;

-- 5. Show current admin users
SELECT 
  'ADMIN USERS' as type,
  u.id,
  u.email,
  u.role,
  u."createdAt",
  CASE 
    WHEN au.id IS NOT NULL THEN '✅ CAN LOGIN'
    ELSE '❌ NO AUTH ACCOUNT'
  END as login_status
FROM public."User" u
LEFT JOIN auth.users au ON u.id = au.id::text
WHERE u.role = 'ADMIN'
ORDER BY u."createdAt"; 
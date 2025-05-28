-- =====================================================
-- EMERGENCY: Create New Admin User
-- Description: Create a fresh admin user when you can't login
-- =====================================================

-- =====================================================
-- METHOD 1: If you have access to Supabase Dashboard
-- =====================================================

-- Step 1: Go to Supabase Dashboard > Authentication > Users
-- Step 2: Click "Add User"
-- Step 3: Use these details:
--   Email: emergency@jeffdash.com
--   Password: TempPassword123!
--   Auto Confirm User: YES
-- Step 4: Copy the generated User ID
-- Step 5: Run the SQL below with the actual User ID

/*
INSERT INTO public."User" (
  id, 
  email, 
  name, 
  "passwordHash", 
  role, 
  "createdAt", 
  "updatedAt"
) VALUES (
  'REPLACE_WITH_ACTUAL_USER_ID_FROM_DASHBOARD', -- Get this from auth.users after creating
  'emergency@jeffdash.com',
  'Emergency Admin',
  '$2a$06$SUPABASE_AUTH_MANAGED_PASSWORD_PLACEHOLDER',
  'ADMIN',
  NOW(),
  NOW()
);
*/

-- =====================================================
-- METHOD 2: Quick Sync Existing Users
-- =====================================================

-- This will automatically sync any auth users to the User table
-- and make them admins if they have the right email

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
  '$2a$06$SUPABASE_AUTH_MANAGED_PASSWORD_PLACEHOLDER',
  CASE 
    WHEN au.email LIKE '%jeffdash.com' OR au.email = 'jeffrey@gmail.com' THEN 'ADMIN'
    ELSE 'USER'
  END as role,
  au.created_at,
  au.updated_at
FROM auth.users au
LEFT JOIN public."User" u ON au.id::text = u.id
WHERE u.id IS NULL;

-- Update existing users to admin if they should be
UPDATE public."User" 
SET role = 'ADMIN', "updatedAt" = NOW()
WHERE (email LIKE '%jeffdash.com' OR email = 'jeffrey@gmail.com')
  AND role != 'ADMIN';

-- =====================================================
-- METHOD 3: Direct Auth User Creation (Advanced)
-- =====================================================

-- If you need to create a user directly in auth.users
-- (This is more complex and should only be used as last resort)

/*
-- WARNING: This bypasses normal Supabase Auth flow
-- Only use if you understand the risks

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'emergency@jeffdash.com',
  crypt('TempPassword123!', gen_salt('bf')), -- This creates a bcrypt hash
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Emergency Admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
*/

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check what users exist in auth.users
SELECT 'AUTH USERS:' as type;
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
ORDER BY created_at;

-- Check what users exist in public.User
SELECT 'PUBLIC USERS:' as type;
SELECT id, email, role, "createdAt"
FROM public."User"
ORDER BY "createdAt";

-- Show admin users specifically
SELECT 'ADMIN USERS:' as type;
SELECT 
  u.id,
  u.email,
  u.role,
  CASE 
    WHEN au.id IS NOT NULL THEN 'CAN LOGIN'
    ELSE 'NO AUTH ACCOUNT'
  END as login_status
FROM public."User" u
LEFT JOIN auth.users au ON u.id = au.id::text
WHERE u.role = 'ADMIN';

-- =====================================================
-- INSTRUCTIONS FOR USING
-- =====================================================

SELECT '=== INSTRUCTIONS ===' AS help;
SELECT '1. Run METHOD 2 first (it is safest)' AS step;
SELECT '2. If users exist in auth.users but cant login, go to Supabase Dashboard' AS step;
SELECT '3. In Dashboard > Authentication > Users, click on each user' AS step;
SELECT '4. Click "Send Password Reset Email"' AS step;
SELECT '5. Check email and reset passwords' AS step;
SELECT '6. If no users exist at all, use METHOD 1 to create one manually' AS step;
SELECT '7. Test login at your app login page' AS step; 
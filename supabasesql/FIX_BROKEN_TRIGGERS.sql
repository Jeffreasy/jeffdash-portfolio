-- =====================================================
-- FIX: Broken Auth Triggers
-- Description: Fix triggers causing "updated_at" field errors
-- =====================================================

-- =====================================================
-- STEP 1: DROP ALL BROKEN TRIGGERS
-- =====================================================

-- Drop any existing auth user triggers that might be broken
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users CASCADE;
DROP TRIGGER IF EXISTS handle_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS handle_auth_user_updated ON auth.users CASCADE;

-- Drop the trigger functions too
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_user_update() CASCADE;

-- =====================================================
-- STEP 2: CHECK AUTH.USERS TABLE STRUCTURE
-- =====================================================

-- Let's see what columns actually exist in auth.users
SELECT 
  'AUTH.USERS COLUMNS:' as info,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_schema = 'auth' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- =====================================================
-- STEP 3: CREATE CORRECT TRIGGER FUNCTIONS
-- =====================================================

-- Create a proper trigger function that uses the correct column names
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  -- Insert new user into public.User table
  -- Using the actual column names from auth.users
  INSERT INTO public."User" (
    id,
    email,
    name,
    "passwordHash",
    role,
    "createdAt",
    "updatedAt"
  )
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name', 
      'New User'
    ),
    '$2a$06$SUPABASE_AUTH_MANAGED_PASSWORD_PLACEHOLDER',
    'USER', -- Default role
    COALESCE(NEW.created_at, NOW()),
    COALESCE(NEW.updated_at, NOW()) -- Use correct column name
  );
  
  RETURN NEW;
EXCEPTION 
  WHEN others THEN
    -- Log the error but don't break the auth flow
    RAISE WARNING 'Error in handle_new_auth_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_auth_user();

-- =====================================================
-- STEP 4: CREATE UPDATE TRIGGER (SAFER VERSION)
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_auth_user_update()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  -- Only update if the user exists in our User table
  UPDATE public."User"
  SET 
    email = NEW.email,
    name = COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name', 
      public."User".name
    ),
    "updatedAt" = COALESCE(NEW.updated_at, NOW())
  WHERE id = NEW.id::text;
  
  RETURN NEW;
EXCEPTION 
  WHEN others THEN
    -- Log the error but don't break the auth flow
    RAISE WARNING 'Error in handle_auth_user_update: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create update trigger
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_auth_user_update();

-- =====================================================
-- STEP 5: SYNC EXISTING USERS SAFELY
-- =====================================================

-- First, let's sync any existing auth users to the User table
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
    'Existing User'
  ) as name,
  '$2a$06$SUPABASE_AUTH_MANAGED_PASSWORD_PLACEHOLDER',
  CASE 
    WHEN au.email LIKE '%jeffdash.com' OR au.email = 'jeffrey@gmail.com' THEN 'ADMIN'
    ELSE 'USER'
  END as role,
  COALESCE(au.created_at, NOW()),
  COALESCE(au.updated_at, NOW())
FROM auth.users au
LEFT JOIN public."User" u ON au.id::text = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING; -- Don't error if user already exists

-- Make sure your accounts are admin
UPDATE public."User" 
SET 
  role = 'ADMIN',
  "updatedAt" = NOW()
WHERE email IN ('jeffrey@gmail.com', 'jeffrey@jeffdash.com');

-- =====================================================
-- STEP 6: VERIFICATION
-- =====================================================

-- Check triggers are working
SELECT 
  'TRIGGERS:' as type,
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers 
WHERE trigger_name LIKE '%auth_user%';

-- Check users
SELECT 'AUTH USERS:' as type;
SELECT id, email, created_at, updated_at
FROM auth.users
ORDER BY created_at;

SELECT 'PUBLIC USERS:' as type;
SELECT id, email, role, "createdAt"
FROM public."User"
ORDER BY "createdAt";

-- Test if we can create a new user (this should work now)
SELECT '=== SYSTEM READY ===' as status;
SELECT 'Try creating a new account now!' as instruction; 
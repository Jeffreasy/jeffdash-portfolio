-- =====================================================
-- NUCLEAR CLEAN: Remove ALL Problematic Triggers
-- Description: Find and remove all triggers causing updated_at errors
-- =====================================================

-- =====================================================
-- STEP 1: FIND ALL TRIGGERS ON AUTH.USERS
-- =====================================================

-- Show ALL triggers on auth.users table
SELECT 
  'CURRENT TRIGGERS ON AUTH.USERS:' as info,
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users'
ORDER BY trigger_name;

-- =====================================================
-- STEP 2: DROP ALL TRIGGERS ON AUTH.USERS
-- =====================================================

-- Drop ALL triggers on auth.users (nuclear option)
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN 
        SELECT trigger_name, event_object_table
        FROM information_schema.triggers 
        WHERE event_object_schema = 'auth' 
          AND event_object_table = 'users'
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.trigger_name) || ' ON auth.users CASCADE';
        RAISE NOTICE 'Dropped trigger: %', r.trigger_name;
    END LOOP;
END $$;

-- =====================================================
-- STEP 3: DROP PROBLEMATIC FUNCTIONS
-- =====================================================

-- Drop the specific problematic function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Drop other potentially problematic functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS handle_user_update() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_user_update() CASCADE;

-- =====================================================
-- STEP 4: CHECK FOR ANY REMAINING TRIGGERS
-- =====================================================

-- Verify no triggers remain on auth.users
SELECT 
  'REMAINING TRIGGERS ON AUTH.USERS:' as info,
  COUNT(*) as trigger_count
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';

-- Show any remaining triggers (should be 0)
SELECT 
  'DETAIL - REMAINING TRIGGERS:' as info,
  trigger_name,
  event_object_table
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';

-- =====================================================
-- STEP 5: CREATE MINIMAL SAFE TRIGGER (OPTIONAL)
-- =====================================================

-- Only create this if you want automatic user sync
-- Comment out this section if you prefer manual user management

/*
CREATE OR REPLACE FUNCTION public.safe_handle_new_auth_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  -- Only try to insert, don't try to update any auth.users fields
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
    CASE 
      WHEN NEW.email LIKE '%jeffdash.com' OR NEW.email = 'jeffrey@gmail.com' THEN 'ADMIN'
      ELSE 'USER'
    END,
    COALESCE(NEW.created_at, NOW()),
    NOW() -- Always use NOW() instead of trying to access NEW.updated_at
  );
  
  -- IMPORTANT: Don't try to modify NEW record at all!
  RETURN NEW;
EXCEPTION 
  WHEN others THEN
    -- Log error but don't break auth
    RAISE WARNING 'Error in safe_handle_new_auth_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create safe trigger
CREATE TRIGGER safe_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.safe_handle_new_auth_user();
*/

-- =====================================================
-- STEP 6: MANUAL USER SYNC
-- =====================================================

-- Sync existing auth users manually (safer approach)
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
    'User'
  ) as name,
  '$2a$06$SUPABASE_AUTH_MANAGED_PASSWORD_PLACEHOLDER',
  CASE 
    WHEN au.email LIKE '%jeffdash.com' OR au.email = 'jeffrey@gmail.com' THEN 'ADMIN'
    ELSE 'USER'
  END as role,
  COALESCE(au.created_at, NOW()),
  NOW()
FROM auth.users au
LEFT JOIN public."User" u ON au.id::text = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO UPDATE SET
  role = CASE 
    WHEN EXCLUDED.email LIKE '%jeffdash.com' OR EXCLUDED.email = 'jeffrey@gmail.com' THEN 'ADMIN'
    ELSE public."User".role
  END;

-- =====================================================
-- STEP 7: VERIFICATION
-- =====================================================

SELECT '=== CLEANUP COMPLETE ===' as status;

-- Verify no triggers on auth.users
SELECT 
  'Triggers on auth.users:' as check,
  COUNT(*) as count
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';

-- Show current users
SELECT 'CURRENT USERS:' as info;
SELECT 
  id,
  email,
  role,
  "createdAt"
FROM public."User"
ORDER BY "createdAt";

SELECT '✅ System should work now - try creating a new account!' as final_status; 
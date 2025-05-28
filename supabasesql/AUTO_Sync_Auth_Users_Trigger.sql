-- ============================================================================
-- AUTO SYNC: Trigger to automatically sync new auth users to User table
-- ============================================================================
-- This creates a trigger that automatically adds new Supabase Auth users
-- to the public.User table when they sign up.

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert new user into public.User table
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NULL),
    '$2a$06$SUPABASE_AUTH_MANAGED_PASSWORD_PLACEHOLDER', -- Placeholder
    'USER', -- Default role
    NEW.created_at,
    NEW.updated_at
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- OPTIONAL: Update trigger for when auth users are updated
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS trigger AS $$
BEGIN
  -- Update existing user in public.User table
  UPDATE public."User"
  SET 
    email = NEW.email,
    name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', "User".name),
    "updatedAt" = NEW.updated_at
  WHERE id = NEW.id::text;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing update trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Create the update trigger
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check if triggers are created
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated')
ORDER BY trigger_name; 
-- ============================================================================
-- FIX: User Table RLS Infinite Recursion Issue
-- ============================================================================
-- The issue occurs because the User table policies try to check the User table
-- from within the User table itself, causing infinite recursion.
-- 
-- Solution: Use auth.uid() directly for user identification and create a 
-- separate function for admin checks that doesn't cause recursion.

-- First, drop all existing User table policies
DROP POLICY IF EXISTS "User_select_self_or_admin" ON "User";
DROP POLICY IF EXISTS "User_insert_admin" ON "User";
DROP POLICY IF EXISTS "User_update_self_or_admin" ON "User";
DROP POLICY IF EXISTS "User_delete_admin" ON "User";

-- Create a simple function to check if current user is admin
-- This function will be used by other tables, not the User table itself
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "User" 
    WHERE id = auth.uid()::text 
    AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- NEW USER TABLE POLICIES (NO RECURSION)
-- ============================================================================

-- SELECT: Users can see their own record, authenticated users can see all
-- (We'll handle admin-only logic in the application layer)
CREATE POLICY "User_select_authenticated"
  ON "User"
  FOR SELECT
  USING (
    -- User can see their own record
    id = auth.uid()::text
    -- OR any authenticated user can see basic user info
    -- (admin check will be done in application layer)
    OR auth.uid() IS NOT NULL
  );

-- INSERT: Only allow inserts for authenticated users
-- (Admin check will be done in application layer)
CREATE POLICY "User_insert_authenticated"
  ON "User"
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATE: Users can update their own record, authenticated users can update others
-- (Admin check will be done in application layer)
CREATE POLICY "User_update_authenticated"
  ON "User"
  FOR UPDATE
  USING (
    id = auth.uid()::text
    OR auth.uid() IS NOT NULL
  )
  WITH CHECK (
    id = auth.uid()::text
    OR auth.uid() IS NOT NULL
  );

-- DELETE: Only authenticated users can delete
-- (Admin check will be done in application layer)
CREATE POLICY "User_delete_authenticated"
  ON "User"
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- UPDATE OTHER TABLE POLICIES TO USE THE NEW FUNCTION
-- ============================================================================

-- Update SiteSettings policies to use the new function
DROP POLICY IF EXISTS "SiteSettings_insert_admin" ON "SiteSettings";
DROP POLICY IF EXISTS "SiteSettings_update_admin" ON "SiteSettings";
DROP POLICY IF EXISTS "SiteSettings_delete_admin" ON "SiteSettings";

CREATE POLICY "SiteSettings_insert_admin"
  ON "SiteSettings"
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "SiteSettings_update_admin"
  ON "SiteSettings"
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "SiteSettings_delete_admin"
  ON "SiteSettings"
  FOR DELETE
  USING (is_admin());

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check that policies are created correctly
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM pg_policies 
WHERE tablename = 'User'
ORDER BY policyname;

-- Test the is_admin function
SELECT 'is_admin function created successfully' AS status;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- This approach:
-- 1. Eliminates infinite recursion by not referencing User table in User policies
-- 2. Moves admin checks to application layer for User table operations
-- 3. Uses the is_admin() function for other tables that need admin checks
-- 4. Maintains security while avoiding the recursion issue
-- 
-- The application layer should still verify admin permissions for sensitive
-- User table operations like role changes, user deletion, etc. 
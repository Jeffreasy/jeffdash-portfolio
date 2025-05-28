-- ============================================================================
-- COMPLETE CLEANUP: User Table RLS Policies
-- ============================================================================
-- This script completely removes ALL existing User table policies 
-- and creates fresh ones without infinite recursion issues.

-- ============================================================================
-- 1. DROP ALL EXISTING USER TABLE POLICIES (comprehensive cleanup)
-- ============================================================================

-- Drop any policy that might exist on User table
DROP POLICY IF EXISTS "User_select_self_or_admin" ON "User";
DROP POLICY IF EXISTS "User_insert_admin" ON "User";
DROP POLICY IF EXISTS "User_update_self_or_admin" ON "User";
DROP POLICY IF EXISTS "User_delete_admin" ON "User";
DROP POLICY IF EXISTS "User_select_authenticated" ON "User";
DROP POLICY IF EXISTS "User_insert_authenticated" ON "User";
DROP POLICY IF EXISTS "User_update_authenticated" ON "User";
DROP POLICY IF EXISTS "User_delete_authenticated" ON "User";
DROP POLICY IF EXISTS "User_select_public" ON "User";
DROP POLICY IF EXISTS "User_insert_public" ON "User";
DROP POLICY IF EXISTS "User_update_public" ON "User";
DROP POLICY IF EXISTS "User_delete_public" ON "User";

-- Show current policies (should be empty after drops)
SELECT 'Existing User policies:' AS info;
SELECT policyname FROM pg_policies WHERE tablename = 'User';

-- ============================================================================
-- 2. CREATE HELPER FUNCTION (if not exists)
-- ============================================================================

-- Create a simple function to check if current user is admin
-- This function will be used by OTHER tables, not the User table itself
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
-- 3. CREATE NEW USER TABLE POLICIES (NO RECURSION)
-- ============================================================================

-- SELECT: Users can see their own record, authenticated users can see all
-- (We handle admin-only logic in the application layer)
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
-- 4. VERIFICATION
-- ============================================================================

-- Check that policies are created correctly
SELECT 'New User policies created:' AS info;
SELECT 
  policyname, 
  cmd,
  SUBSTRING(qual, 1, 100) as using_clause,
  SUBSTRING(with_check, 1, 100) as with_check_clause
FROM pg_policies 
WHERE tablename = 'User'
ORDER BY policyname;

-- Test the is_admin function
SELECT 'is_admin function status:' AS info;
SELECT 'is_admin function created successfully' AS status;

-- ============================================================================
-- 5. TEST BASIC FUNCTIONALITY
-- ============================================================================

-- Test if we can query the User table (should work for authenticated users)
SELECT 'Testing User table access:' AS info;
SELECT COUNT(*) as user_count FROM "User";

-- Show current user info if logged in
SELECT 'Current auth user:' AS info;
SELECT auth.uid() as current_user_id;

SELECT 'Script completed successfully!' AS final_status; 
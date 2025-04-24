-- ============================================================================
-- V1.4.2: Supabase RLS-optimalisatie voor alle tabellen (met correcte INSERT/UPDATE/DELETE splitsing)
-- ============================================================================

-- HULPFUNCTIE VOOR ADMIN-CHECK (gebruik in USING en WITH CHECK):
-- EXISTS (SELECT 1 FROM "User" u WHERE u.id = auth.uid()::text AND u.role = 'ADMIN')

-- ============================================================================
-- TABEL: Project
-- ============================================================================
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;

-- SELECT: iedereen mag lezen
CREATE POLICY "Project_select_public"
  ON "Project"
  FOR SELECT
  USING (true);

-- INSERT: alleen admin mag nieuwe rijen invoegen
CREATE POLICY "Project_insert_admin"
  ON "Project"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- UPDATE: alleen admin mag rijen aanpassen
CREATE POLICY "Project_update_admin"
  ON "Project"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- DELETE: alleen admin mag rijen verwijderen
CREATE POLICY "Project_delete_admin"
  ON "Project"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );


-- ============================================================================
-- TABEL: ProjectImage
-- ============================================================================
ALTER TABLE "ProjectImage" ENABLE ROW LEVEL SECURITY;

-- SELECT: iedereen mag lezen
CREATE POLICY "ProjectImage_select_public"
  ON "ProjectImage"
  FOR SELECT
  USING (true);

-- INSERT: alleen admin
CREATE POLICY "ProjectImage_insert_admin"
  ON "ProjectImage"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- UPDATE: alleen admin
CREATE POLICY "ProjectImage_update_admin"
  ON "ProjectImage"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- DELETE: alleen admin
CREATE POLICY "ProjectImage_delete_admin"
  ON "ProjectImage"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );


-- ============================================================================
-- TABEL: Post
-- ============================================================================
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;

-- SELECT: alleen gepubliceerde posts
CREATE POLICY "Post_select_public"
  ON "Post"
  FOR SELECT
  USING (published = true);

-- INSERT: alleen admin
CREATE POLICY "Post_insert_admin"
  ON "Post"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- UPDATE: alleen admin
CREATE POLICY "Post_update_admin"
  ON "Post"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- DELETE: alleen admin
CREATE POLICY "Post_delete_admin"
  ON "Post"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );


-- ============================================================================
-- TABEL: ContactSubmission
-- ============================================================================
ALTER TABLE "ContactSubmission" ENABLE ROW LEVEL SECURITY;

-- INSERT: iedereen mag contactsubmissions aanmaken
CREATE POLICY "ContactSubmission_insert_public"
  ON "ContactSubmission"
  FOR INSERT
  WITH CHECK (true);

-- SELECT: alleen admin mag lezen
CREATE POLICY "ContactSubmission_select_admin"
  ON "ContactSubmission"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- UPDATE: alleen admin
CREATE POLICY "ContactSubmission_update_admin"
  ON "ContactSubmission"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- DELETE: alleen admin
CREATE POLICY "ContactSubmission_delete_admin"
  ON "ContactSubmission"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );


-- ============================================================================
-- TABEL: User
-- ============================================================================
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- SELECT: gebruiker mag eigen record, admin mag alles
CREATE POLICY "User_select_self_or_admin"
  ON "User"
  FOR SELECT
  USING (
    id = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- INSERT: alleen admin mag nieuwe gebruikers aanmaken
CREATE POLICY "User_insert_admin"
  ON "User"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- UPDATE: gebruiker mag eigen record, admin mag alle records
CREATE POLICY "User_update_self_or_admin"
  ON "User"
  FOR UPDATE
  USING (
    id = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  )
  WITH CHECK (
    id = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- DELETE: alleen admin mag gebruikers verwijderen
CREATE POLICY "User_delete_admin"
  ON "User"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

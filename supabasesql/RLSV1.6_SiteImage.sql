-- Supabase RLS Script V1.6: Policies voor SiteImage
-- Voegt RLS policies toe voor de nieuwe SiteImage tabel.

-- ============================================================================
-- TABEL: SiteImage
-- ============================================================================
ALTER TABLE "SiteImage" ENABLE ROW LEVEL SECURITY;

-- SELECT: iedereen mag lezen
DROP POLICY IF EXISTS "SiteImage_select_public" ON "SiteImage";
CREATE POLICY "SiteImage_select_public"
  ON "SiteImage"
  FOR SELECT
  USING (true);

-- INSERT: alleen admin mag nieuwe afbeeldingen toevoegen
DROP POLICY IF EXISTS "SiteImage_insert_admin" ON "SiteImage";
CREATE POLICY "SiteImage_insert_admin"
  ON "SiteImage"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- UPDATE: alleen admin mag afbeeldingen wijzigen
DROP POLICY IF EXISTS "SiteImage_update_admin" ON "SiteImage";
CREATE POLICY "SiteImage_update_admin"
  ON "SiteImage"
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

-- DELETE: alleen admin mag afbeeldingen verwijderen
DROP POLICY IF EXISTS "SiteImage_delete_admin" ON "SiteImage";
CREATE POLICY "SiteImage_delete_admin"
  ON "SiteImage"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- --- Afronding ---
SELECT 'V1.6 Script voltooid: RLS policies voor SiteImage tabel aangemaakt/bijgewerkt.' AS status; 
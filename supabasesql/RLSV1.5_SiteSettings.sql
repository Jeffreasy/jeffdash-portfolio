-- ============================================================================
-- V1.5: RLS Policies voor SiteSettings tabel
-- ============================================================================

-- ============================================================================
-- TABEL: SiteSettings
-- ============================================================================
ALTER TABLE "SiteSettings" ENABLE ROW LEVEL SECURITY;

-- SELECT: iedereen mag lezen (voor public settings zoals under_construction)
CREATE POLICY "SiteSettings_select_public"
  ON "SiteSettings"
  FOR SELECT
  USING (true);

-- INSERT: alleen admin mag nieuwe instellingen toevoegen
CREATE POLICY "SiteSettings_insert_admin"
  ON "SiteSettings"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- UPDATE: alleen admin mag instellingen aanpassen
CREATE POLICY "SiteSettings_update_admin"
  ON "SiteSettings"
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

-- DELETE: alleen admin mag instellingen verwijderen
CREATE POLICY "SiteSettings_delete_admin"
  ON "SiteSettings"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- ============================================================================
-- Afronding
-- ============================================================================

SELECT 'RLS V1.5 Script voltooid: SiteSettings policies toegepast.' AS status; 
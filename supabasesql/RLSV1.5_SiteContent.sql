-- Supabase RLS Script V1.5: Policies voor SiteContent
-- Voegt RLS policies toe voor de nieuwe SiteContent tabel.

-- ============================================================================
-- TABEL: SiteContent
-- ============================================================================
ALTER TABLE "SiteContent" ENABLE ROW LEVEL SECURITY;

-- SELECT: iedereen mag lezen
DROP POLICY IF EXISTS "SiteContent_select_public" ON "SiteContent";
CREATE POLICY "SiteContent_select_public"
  ON "SiteContent"
  FOR SELECT
  USING (true);

-- INSERT: alleen admin mag nieuwe content toevoegen
DROP POLICY IF EXISTS "SiteContent_insert_admin" ON "SiteContent";
CREATE POLICY "SiteContent_insert_admin"
  ON "SiteContent"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- UPDATE: alleen admin mag content wijzigen
DROP POLICY IF EXISTS "SiteContent_update_admin" ON "SiteContent";
CREATE POLICY "SiteContent_update_admin"
  ON "SiteContent"
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

-- DELETE: alleen admin mag content verwijderen
DROP POLICY IF EXISTS "SiteContent_delete_admin" ON "SiteContent";
CREATE POLICY "SiteContent_delete_admin"
  ON "SiteContent"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()::text AND u.role = 'ADMIN'
    )
  );

-- --- Afronding ---
SELECT 'V1.5 Script voltooid: RLS policies voor SiteContent tabel aangemaakt/bijgewerkt.' AS status; 
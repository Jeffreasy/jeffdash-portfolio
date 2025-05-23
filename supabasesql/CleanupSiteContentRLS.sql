-- Cleanup en fix alle SiteContent RLS policies
-- Dit verwijdert alle bestaande policies en maakt alleen de juiste twee

-- Verwijder ALLE bestaande policies
DROP POLICY IF EXISTS "Admin access for SiteContent" ON "public"."SiteContent";
DROP POLICY IF EXISTS "Public read access for SiteContent" ON "public"."SiteContent";
DROP POLICY IF EXISTS "SiteContent_delete_admin" ON "public"."SiteContent";
DROP POLICY IF EXISTS "SiteContent_insert_admin" ON "public"."SiteContent";
DROP POLICY IF EXISTS "SiteContent_select_public" ON "public"."SiteContent";
DROP POLICY IF EXISTS "SiteContent_update_admin" ON "public"."SiteContent";

-- Maak alleen deze 2 simpele policies die geen User tabel lookup doen

-- 1. Public kan lezen (iedereen)
CREATE POLICY "site_content_public_read" ON "public"."SiteContent"
FOR SELECT
TO public
USING (true);

-- 2. Authenticated users kunnen alles (admin operaties)
CREATE POLICY "site_content_admin_all" ON "public"."SiteContent"
FOR ALL
TO authenticated
USING (true);

-- Controleer dat alleen deze 2 policies bestaan
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'SiteContent'
ORDER BY policyname; 
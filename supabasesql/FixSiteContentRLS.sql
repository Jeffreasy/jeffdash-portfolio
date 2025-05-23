-- Fix RLS Policies voor SiteContent tabel
-- Dit lost de "infinite recursion detected in policy for relation User" error op

-- Verwijder bestaande policies
DROP POLICY IF EXISTS "Public read access for SiteContent" ON "public"."SiteContent";
DROP POLICY IF EXISTS "Admin write access for SiteContent" ON "public"."SiteContent";

-- Nieuwe policies die geen User tabel lookup doen
-- Public read access - iedereen kan site content lezen
CREATE POLICY "Public read access for SiteContent" ON "public"."SiteContent"
FOR SELECT
USING (true);

-- Admin access voor CRUD operaties - alleen authenticated users
CREATE POLICY "Admin access for SiteContent" ON "public"."SiteContent"
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Controleer de nieuwe policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'SiteContent';

-- Test query om te controleren of policies werken
SELECT key, value FROM "public"."SiteContent" WHERE key = 'about_title'; 
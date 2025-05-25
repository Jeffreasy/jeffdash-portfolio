-- RLS Policies voor SiteContent tabel
-- Deze policies geven publieke read access en admin write access

-- Eerst schakel RLS in voor de SiteContent tabel
ALTER TABLE "public"."SiteContent" ENABLE ROW LEVEL SECURITY;

-- Public read access - iedereen kan site content lezen
CREATE POLICY "Public read access for SiteContent" ON "public"."SiteContent"
FOR SELECT
USING (true);

-- Admin write access - alleen authenticated users kunnen site content bewerken
CREATE POLICY "Admin write access for SiteContent" ON "public"."SiteContent"
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Controleer de policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'SiteContent'; 
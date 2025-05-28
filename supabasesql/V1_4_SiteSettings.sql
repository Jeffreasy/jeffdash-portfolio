-- Supabase SQL Script V1.4: SiteSettings Tabel
-- Voegt de SiteSettings tabel toe voor site-brede instellingen zoals under construction mode.

-- --- DEEL 1: Tabel Aanmaken ---

CREATE TABLE IF NOT EXISTS "SiteSettings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'string', -- 'string', 'boolean', 'number', 'json'
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("key")
);

-- --- DEEL 2: Custom Trigger Function voor SiteSettings ---

-- Create a specific trigger function for SiteSettings with camelCase column names
CREATE OR REPLACE FUNCTION update_sitesettings_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger
DROP TRIGGER IF EXISTS update_sitesettings_updated_at ON "SiteSettings";
CREATE TRIGGER update_sitesettings_updated_at
BEFORE UPDATE ON "SiteSettings"
FOR EACH ROW
EXECUTE FUNCTION update_sitesettings_updated_at_column();

-- --- DEEL 3: Seed Data ---

INSERT INTO "SiteSettings" ("key", "value", "description", "type") VALUES
('under_construction', 'false', 'Enable/disable under construction mode for the entire site', 'boolean'),
('maintenance_message', 'We werken hard aan het verbeteren van je ervaring. De website komt binnenkort terug online met geweldige nieuwe features!', 'Custom message to display on under construction page', 'string'),
('maintenance_contact_email', 'contact@jeffdash.com', 'Contact email to display during maintenance', 'string'),
('site_name', 'Jeffrey Lavente Portfolio', 'Site name for branding', 'string'),
('admin_notifications', 'true', 'Enable admin notifications', 'boolean')
ON CONFLICT ("key") DO UPDATE SET
    "description" = EXCLUDED."description",
    "type" = EXCLUDED."type",
    "updatedAt" = CURRENT_TIMESTAMP;

-- --- DEEL 4: Index voor betere performance ---

CREATE INDEX IF NOT EXISTS "SiteSettings_type_idx" ON "SiteSettings"("type");

-- --- DEEL 5: Afronding ---

SELECT 'V1.4 Script voltooid: SiteSettings tabel aangemaakt en geseeded.' AS status; 
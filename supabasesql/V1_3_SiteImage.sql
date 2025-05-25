-- Supabase SQL Script V1.3: SiteImage Tabel
-- Voegt de SiteImage tabel toe voor site-brede afbeeldingen zoals profielfoto.

-- --- DEEL 1: Tabel Aanmaken ---

CREATE TABLE IF NOT EXISTS "SiteImage" (
    "id" TEXT NOT NULL,
    "contentKey" TEXT NOT NULL, -- bv. 'about_profile_picture', 'site_logo'
    "url" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SiteImage_pkey" PRIMARY KEY ("id")
);

-- Index op contentKey voor sneller opzoeken
CREATE INDEX IF NOT EXISTS "SiteImage_contentKey_idx" ON "SiteImage"("contentKey");

-- --- DEEL 2: Trigger Toepassen voor updatedAt ---

-- Gebruik dezelfde functie als gedefinieerd in V1.1
-- Zorg ervoor dat de functie update_updated_at_column() bestaat!
DROP TRIGGER IF EXISTS update_siteimage_updated_at ON "SiteImage";
CREATE TRIGGER update_siteimage_updated_at
BEFORE UPDATE ON "SiteImage"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- --- DEEL 3: Seed Data (Optioneel voorbeeld) ---

-- Voeg een placeholder toe als je wilt, of beheer dit via een admin interface.
-- INSERT INTO "SiteImage" ("id", "contentKey", "url", "altText", "order") VALUES
-- (gen_random_uuid(), 'about_profile_picture', 'https://via.placeholder.com/150', 'Placeholder profielfoto', 0)
-- ON CONFLICT ("id") DO NOTHING; -- Of baseer conflict op contentKey?
-- Overweeg een UNIQUE constraint op contentKey als je maar één afbeelding per key wilt toestaan,
-- of gebruik 'order' om de primaire afbeelding te selecteren.

-- --- DEEL 4: Afronding ---

SELECT 'V1.3 Script voltooid: SiteImage tabel aangemaakt en trigger toegepast.' AS status; 
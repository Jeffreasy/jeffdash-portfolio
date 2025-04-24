-- Supabase SQL Script V1.2: SiteContent Tabel
-- Voegt de SiteContent tabel toe voor dynamische content zoals 'Over Mij'.

-- --- DEEL 1: Tabel Aanmaken ---

CREATE TABLE IF NOT EXISTS "SiteContent" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("key")
);

-- --- DEEL 2: Trigger Toepassen voor updatedAt ---

-- Gebruik dezelfde functie als gedefinieerd in V1.1
-- Zorg ervoor dat de functie update_updated_at_column() bestaat!
DROP TRIGGER IF EXISTS update_sitecontent_updated_at ON "SiteContent";
CREATE TRIGGER update_sitecontent_updated_at
BEFORE UPDATE ON "SiteContent"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- --- DEEL 3: Seed Data --- 

INSERT INTO "SiteContent" ("key", "value") VALUES
('about_title', 'Over Mij'),
('about_intro', 'Welkom op mijn portfolio! Ik ben Jeffrey Lavente, een enthousiaste en gedreven webontwikkelaar met een passie voor het creëren van moderne, gebruiksvriendelijke en performante webapplicaties.'),
('about_focus', 'Mijn focus ligt op het bouwen met cutting-edge technologieën zoals Next.js, React, TypeScript, en Prisma. Ik geniet ervan om complexe problemen om te zetten in elegante, schaalbare oplossingen. Of het nu gaat om het ontwikkelen van een interactieve frontend, het opzetten van een robuuste backend-API, of het optimaliseren van de database interactie, ik streef altijd naar de hoogste kwaliteit.'),
('about_projects', 'Op deze site vind je een selectie van mijn projecten die mijn vaardigheden en interesses weerspiegelen. Ik ben altijd op zoek naar nieuwe uitdagingen en mogelijkheden om te leren en te groeien als ontwikkelaar.'),
('about_contact', 'Bekijk gerust mijn profielen op LinkedIn en GitHub, of neem contact op als je vragen hebt of wilt samenwerken!'),
('linkedin_url', 'https://www.linkedin.com/in/jeffrey-lavente-026a41330/'),
('github_url', 'https://github.com/Jeffreasy')
ON CONFLICT ("key") DO UPDATE SET 
  "value" = EXCLUDED."value", 
  "updatedAt" = NOW();

-- --- DEEL 4: Afronding ---

SELECT 'V1.2 Script voltooid: SiteContent tabel aangemaakt, trigger toegepast en geseed.' AS status; 
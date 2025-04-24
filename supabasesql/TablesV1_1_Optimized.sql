-- Geoptimaliseerd SQL script (V1.2) met DEFAULT-fix voor updatedAt
-- Wijzigingen t.o.v. V1.1:
-- 1) ALTER TABLE om DEFAULT CURRENT_TIMESTAMP op updatedAt te zetten voor bestaande tabellen.
-- 2) Bijwerken van reeds bestaande rijen met NULL updatedAt.
-- 3) Rest is ongewijzigd (triggers, tabellen, indexen, seed).

-- --- DEEL 0: Fix DEFAULT op bestaande updatedAt-kolommen ---

ALTER TABLE "Project"
  ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
UPDATE "Project"
  SET "updatedAt" = now()
  WHERE "updatedAt" IS NULL;

ALTER TABLE "Post"
  ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
UPDATE "Post"
  SET "updatedAt" = now()
  WHERE "updatedAt" IS NULL;

ALTER TABLE "User"
  ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
UPDATE "User"
  SET "updatedAt" = now()
  WHERE "updatedAt" IS NULL;

-- --- DEEL 1: Trigger Functie voor updatedAt ---

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW."updatedAt" = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --- DEEL 2: Tabellen Aanmaken ---

CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT,
    "detailedContent" TEXT NOT NULL,
    "liveUrl" TEXT,
    "githubUrl" TEXT,
    "technologies" TEXT[],
    "category" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ProjectImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Post" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "featuredImageUrl" TEXT,
    "tags" TEXT[],
    "category" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "featuredImageAltText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- --- DEEL 3: Indexen Aanmaken ---

CREATE UNIQUE INDEX IF NOT EXISTS "Project_slug_key" ON "Project"("slug");
CREATE INDEX IF NOT EXISTS "Project_isFeatured_idx" ON "Project"("isFeatured");
CREATE INDEX IF NOT EXISTS "Project_category_idx" ON "Project"("category");

CREATE INDEX IF NOT EXISTS "ProjectImage_projectId_idx" ON "ProjectImage"("projectId");

CREATE UNIQUE INDEX IF NOT EXISTS "Post_slug_key" ON "Post"("slug");
CREATE INDEX IF NOT EXISTS "Post_published_publishedAt_idx" ON "Post"("published", "publishedAt");
CREATE INDEX IF NOT EXISTS "Post_category_idx" ON "Post"("category");

CREATE INDEX IF NOT EXISTS "ContactSubmission_createdAt_idx" ON "ContactSubmission"("createdAt");

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");

-- --- DEEL 4: Foreign Keys Toevoegen ---

ALTER TABLE "ProjectImage" DROP CONSTRAINT IF EXISTS "ProjectImage_projectId_fkey";
ALTER TABLE "ProjectImage"
  ADD CONSTRAINT "ProjectImage_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- --- DEEL 5: Triggers Toepassen voor updatedAt ---

DROP TRIGGER IF EXISTS update_project_updated_at ON "Project";
CREATE TRIGGER update_project_updated_at
  BEFORE UPDATE ON "Project"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_post_updated_at ON "Post";
CREATE TRIGGER update_post_updated_at
  BEFORE UPDATE ON "Post"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_updated_at ON "User";
CREATE TRIGGER update_user_updated_at
  BEFORE UPDATE ON "User"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- --- DEEL 6: Seed Data (Voorbeelden) ---

INSERT INTO "Project" (
    "id","slug","title","shortDescription","detailedContent",
    "liveUrl","githubUrl","technologies","category",
    "isFeatured","order","metaTitle","metaDescription"
) VALUES (
    gen_random_uuid(),
    'whisky-for-charity',
    'Whisky for Charity',
    'Een moderne, interactieve veilingsite.',
    'Uitgebreide beschrijving van het Whisky for Charity project...',
    'https://www.whiskyforcharity.nl',
    'https://github.com/Jeffreasy/whiskyforcharity',
    ARRAY['Next.js','TypeScript','Prisma','TailwindCSS','PostgreSQL'],
    'Web Development',
    TRUE,
    NULL,NULL,NULL
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "shortDescription" = EXCLUDED."shortDescription",
    "detailedContent" = EXCLUDED."detailedContent",
    "liveUrl" = EXCLUDED."liveUrl",
    "githubUrl" = EXCLUDED."githubUrl",
    "technologies" = EXCLUDED."technologies",
    "category" = EXCLUDED."category",
    "isFeatured" = EXCLUDED."isFeatured",
    "order" = EXCLUDED."order",
    "metaTitle" = EXCLUDED."metaTitle",
    "metaDescription" = EXCLUDED."metaDescription",
    "updatedAt" = NOW();

-- (Andere seed-inserts ongewijzigd...)

-- --- DEEL 7: Afronding ---

SELECT 'V1.2 Script voltooid: DEFAULTs ingesteld, NULL-updates uitgevoerd & database klaargezet.' AS status;

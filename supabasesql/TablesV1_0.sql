-- Begin Volledig SQL script voor het aanmaken van tabellen en seeden van Project tabel

-- --- DEEL 1: Tabellen Aanmaken (uit Prisma migraties) ---

-- Migratie: 20250420204946_init
CREATE TABLE "Project" (
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Default toegevoegd
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProjectImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Post" (
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Default toegevoegd
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
CREATE INDEX "Project_isFeatured_idx" ON "Project"("isFeatured");
CREATE INDEX "Project_category_idx" ON "Project"("category");
CREATE INDEX "ProjectImage_projectId_idx" ON "ProjectImage"("projectId");
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
CREATE INDEX "Post_published_publishedAt_idx" ON "Post"("published", "publishedAt");
CREATE INDEX "Post_category_idx" ON "Post"("category");

ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migratie: 20250421181242_add_contact_submission
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Default toegevoegd

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ContactSubmission_createdAt_idx" ON "ContactSubmission"("createdAt");

-- Migratie: 20250422121811_add_user_model
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Default toegevoegd
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- --- DEEL 2: Project Tabel Seeden ---

-- Project: Whisky for Charity
INSERT INTO "Project" (
    "id",
    "slug", "title", "shortDescription", "detailedContent", "liveUrl", "githubUrl",
    "technologies", "category", "isFeatured", "order", "metaTitle", "metaDescription",
    "createdAt", "updatedAt"
) VALUES (
    gen_random_uuid(),
    'whisky-for-charity',
    'Whisky for Charity',
    'Een moderne, interactieve veilingsite.',
    'Uitgebreide beschrijving van het Whisky for Charity project...', -- TODO: Compleet maken
    'https://www.whiskyforcharity.nl',
    'https://github.com/Jeffreasy/whiskyforcharity',
    ARRAY['Next.js', 'TypeScript', 'Prisma', 'TailwindCSS', 'PostgreSQL'],
    'Web Development',
    TRUE,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
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

-- Project: De koninklijke loop
INSERT INTO "Project" (
    "id", "slug", "title", "shortDescription", "detailedContent", "liveUrl", "githubUrl",
    "technologies", "category", "isFeatured", "order", "metaTitle", "metaDescription",
    "createdAt", "updatedAt"
) VALUES (
    gen_random_uuid(),
    'de-koninklijke-loop',
    'De koninklijke loop',
    'De sponsorloop van mensen voor mensen.',
    'Een moderne webapplicatie voor het beheren van sponsorevenementen...', -- TODO: Compleet maken
    'https://www.dekoninklijkeloop.nl',
    'https://github.com/Jeffreasy/koninklijkloop',
    ARRAY['React', 'Node.js', 'Express', 'MongoDB'],
    'Web Development',
    FALSE,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
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

-- Project: DRL & W&C backend Service
INSERT INTO "Project" (
    "id", "slug", "title", "shortDescription", "detailedContent", "liveUrl", "githubUrl",
    "technologies", "category", "isFeatured", "order", "metaTitle", "metaDescription",
    "createdAt", "updatedAt"
) VALUES (
    gen_random_uuid(),
    'drl-wenc-backend',
    'DRL & W&C backend Service',
    'Regelt de achterkant van de mailservice.',
    'Een robuuste en schaalbare backend service gebouwd met...', -- TODO: Compleet maken
    'https://drlemailservice.nl',
    'https://github.com/Jeffreasy/DRLService',
    ARRAY['Node.js', 'Express', 'TypeScript'],
    'Backend',
    FALSE,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
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

-- Melding dat het script klaar is
SELECT 'Tabellen aangemaakt en Project tabel geseed.' AS status;

-- Einde SQL script
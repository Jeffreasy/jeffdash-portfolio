jeffdash-portfolio/
├── .env                  # Lokale environment variabelen (DATABASE_URL, etc.) - NIET IN GIT!
├── .gitignore            # Bestanden/mappen te negeren door Git
├── next.config.mjs       # Next.js configuratie
├── package.json          # Project dependencies en scripts
├── postcss.config.js     # PostCSS configuratie (voor Tailwind)
├── tailwind.config.ts    # Tailwind CSS configuratie
├── tsconfig.json         # TypeScript configuratie
├── README.md             # Project documentatie

├── prisma/                # Prisma ORM configuratie en migraties
│   ├── schema.prisma      # Database schema (incl. SEO velden)
│   ├── migrations/        # Database migratie historie
│   └── seed.ts            # (Optioneel) Database seeding script

├── public/                # Statische bestanden
│   ├── images/            # Statische afbeeldingen (logo, etc.)
│   ├── fonts/             # Lettertype bestanden
│   ├── favicon.ico        # Favicon (standaard)
│   ├── icon.png           # Favicon (Next.js conventie)
│   ├── apple-icon.png     # Favicon voor Apple devices (Next.js conventie)
│   └── manifest.json      # (Optioneel) Web App Manifest voor PWA

└── src/                   # Hoofdmap voor broncode
    ├── app/               # Next.js App Router
    │   ├── (admin)/         # Route group voor admin sectie (optioneel)
    │   │   ├── dashboard/
    │   │   │   └── page.tsx
    │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   └── layout.tsx     # Specifieke layout voor admin (evt. met 'noindex')
    │   │
    │   ├── (pages)/         # Route group voor publieke pagina's
    │   │   ├── page.tsx                  # Homepage (/)
    │   │   ├── about/
    │   │   │   ├── page.tsx              # About page (/about)
    │   │   │   └── opengraph-image.tsx   # (Optioneel) OG image voor /about
    │   │   │
    │   │   ├── blog/
    │   │   │   ├── page.tsx              # Blog lijst (/blog)
    │   │   │   └── [slug]/
    │   │   │       ├── page.tsx          # Individuele blog post (/blog/[slug])
    │   │   │       └── opengraph-image.tsx # Dynamische OG image voor blog posts
    │   │   │
    │   │   ├── contact/
    │   │   │   └── page.tsx              # Contact pagina (/contact)
    │   │   │
    │   │   ├── projects/
    │   │   │   ├── page.tsx              # Project lijst (/projects)
    │   │   │   └── [slug]/
    │   │   │       ├── page.tsx          # Individueel project (/projects/[slug])
    │   │   │       └── opengraph-image.tsx # Dynamische OG image voor projecten
    │   │   │
    │   │   └── layout.tsx                # Gedeelde layout voor publieke pagina's
    │   │
    │   ├── api/             # API Routes (indien nodig naast Server Actions)
    │   │   └── contact/
    │   │       └── route.ts
    │   │
    │   ├── layout.tsx         # Root layout (incl. default metadata, Schema)
    │   ├── globals.css        # Globale CSS / Tailwind base styles
    │   ├── loading.tsx        # Laad UI (Suspense boundary)
    │   ├── error.tsx          # Error UI
    │   ├── not-found.tsx      # 404 Pagina UI
    │   │
    │   ├── sitemap.ts         # Dynamische Sitemap generatie
    │   ├── robots.ts          # Dynamische Robots.txt generatie
    │   └── manifest.ts        # (Optioneel) Dynamisch manifest.json
    │
    ├── components/        # Herbruikbare UI componenten
    │   ├── ui/              # Basis UI elementen (Button, Card, Input, Modal)
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   └── ...
    │   │
    │   ├── layout/          # Layout componenten (Header, Footer)
    │   │   ├── Header.tsx
    │   │   └── Footer.tsx
    │   │
    │   ├── features/        # Feature-specifieke componenten
    │   │   ├── projects/
    │   │   │   ├── ProjectCard.tsx
    │   │   │   ├── ProjectList.tsx
    │   │   │   └── ProjectDetailView.tsx
    │   │   │
    │   │   ├── blog/
    │   │   │   ├── BlogPostCard.tsx
    │   │   │   ├── BlogList.tsx
    │   │   │   └── BlogPostDetailView.tsx
    │   │   │
    │   │   ├── contact/
    │   │   │   └── ContactForm.tsx
    │   │   │
    │   │   └── shared/        # Feature-overstijgende componenten
    │   │       ├── ImageGallery.tsx
    │   │       ├── TestimonialSlider.tsx
    │   │       └── SchemaScript.tsx   # Component voor JSON-LD rendering
    │   │
    │   └── icons/           # (Optioneel) Custom iconen of icon library exports
    │       └── index.ts
    │
    ├── lib/               # Core logic, helpers, types, etc.
    │   ├── prisma.ts        # Prisma client instantie
    │   ├── utils.ts         # Algemene utility functies
    │   ├── config.ts        # Site configuratie & SEO defaults
    │   │
    │   ├── actions/         # Server Actions
    │   │   ├── blog.ts        # Acties voor blog data (getPosts, getPostBySlug)
    │   │   ├── projects.ts    # Acties voor project data
    │   │   ├── contact.ts     # Actie voor contactformulier
    │   │   └── metadata.ts    # (Optioneel) Specifieke acties voor metadata fetching
    │   │
    │   ├── hooks/           # Custom React Hooks
    │   │   └── useScreenSize.ts
    │   │
    │   ├── schema/          # JSON-LD Schema generatie functies
    │   │   ├── website.ts
    │   │   ├── person.ts
    │   │   ├── blogPosting.ts
    │   │   ├── project.ts     # Of SoftwareApplication, CreativeWork etc.
    │   │   └── index.ts       # (Optioneel) Exporteert alle schema functies
    │   │
    │   └── types/           # Gedeelde TypeScript types/interfaces
    │       ├── index.ts
    │       ├── project.ts
    │       └── blog.ts
    │
    └── styles/            # (Optioneel) Extra styling configuratie
        └── theme.ts         # Bv. voor Mantine thema overrides
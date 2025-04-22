# Project Structuur Overzicht

## Configuratie & Root Bestanden

```
jeffdash-portfolio/
├── .env                  # Lokale environment variabelen (DATABASE_URL, etc.) - NIET IN GIT!
├── .gitignore            # Bestanden/mappen te negeren door Git
├── next.config.mjs       # Next.js configuratie
├── package.json          # Project dependencies en scripts (pnpm gebruikt)
├── pnpm-lock.yaml        # Exacte dependency versies voor pnpm
├── postcss.config.js     # PostCSS configuratie (voor Tailwind)
├── tailwind.config.ts    # Tailwind CSS configuratie
├── tsconfig.json         # TypeScript configuratie
├── README.md             # Algemene project documentatie
├── structuur.MD          # Dit bestand (project structuur)
├── SOFTWARE_DEVELOPMENT_GUIDE.md # Richtlijnen voor ontwikkeling
└── # Andere documentatie bestanden (Frontend.MD, backend.MD)
```

## Database (Prisma)

```
├── prisma/                # Prisma ORM configuratie, schema en migraties
│   ├── schema.prisma      # **Database schema definitie** (modellen: Project, Post, ContactSubmission, etc.)
│   ├── migrations/        # Database migratie historie (automatisch beheerd door `prisma migrate`)
│   └── seed.ts            # (Optioneel) Script om testdata in de database te laden
```

## Publieke Assets

```
├── public/                # Statische bestanden direct toegankelijk via de browser
│   ├── images/            # Statische afbeeldingen (bv. logo, fallback images)
│   ├── fonts/             # (Optioneel) Lokale lettertype bestanden
│   ├── favicon.ico        # Standaard favicon
│   ├── icon.png           # App icon (Next.js conventie)
│   ├── apple-icon.png     # App icon voor Apple (Next.js conventie)
│   └── # manifest.json      # (Optioneel) Web App Manifest
```

## Broncode (src)

```
└── src/                   # Hoofdmap voor alle applicatiecode
```

### `src/app/` - Routing & Pagina's (Next.js App Router)

```
    ├── app/               # Implementatie van routes, layouts en pagina's
    │   ├── admin_area/      # Route group voor admin sectie (voorheen: (admin))
    │   │   ├── layout.tsx     # Admin layout (MET authenticatie check, sidebar/navigatie)
    │   │   │
    │   │   ├── dashboard/     # Admin dashboard
    │   │   │   └── page.tsx   #   Overzicht, statistieken, etc.
    │   │   │
    │   │   ├── projects/      # Projecten Beheer
    │   │   │   ├── page.tsx   #   Lijst van alle projecten (met links naar new/edit)
    │   │   │   ├── new/       #   Pagina voor nieuw project formulier
    │   │   │   │   └── page.tsx
    │   │   │   └── [slug]/    #   Pagina voor project bewerken formulier (dynamische route)
    │   │   │       └── page.tsx
    │   │   │
    │   │   ├── posts/         # Blog Posts Beheer
    │   │   │   ├── page.tsx   #   Lijst van alle blog posts (met links naar new/edit)
    │   │   │   ├── new/       #   Pagina voor nieuwe post formulier
    │   │   │   │   └── page.tsx
    │   │   │   └── [slug]/    #   Pagina voor post bewerken formulier (dynamische route)
    │   │   │       └── page.tsx
    │   │   │
    │   │   ├── contacts/      # Contact Formulier Inzendingen
    │   │   │   ├── page.tsx   #   Lijst van alle inzendingen
    │   │   │   └── [id]/      #   Pagina om details van een inzending te bekijken (optioneel)
    │   │   │       └── page.tsx 
    │   │   │
    │   │   └── # Logout functionaliteit wordt waarschijnlijk via een link/knop in de layout afgehandeld,
    │   │     # die een server action aanroept (geen aparte route nodig).
    │   │
    │   ├── login/           # Publieke login route (buiten admin layout)
    │   │   └── page.tsx
    │   │
    │   ├── (pages)/         # Route group voor alle publieke pagina's
    │   │   ├── page.tsx                  # **Homepage (/)**
    │   │   ├── about/ page.tsx           # About pagina (/about)
    │   │   ├── blog/                     # Blog sectie
    │   │   │   ├── page.tsx              #   Blog lijst pagina (/blog)
    │   │   │   └── [slug]/ page.tsx      #   Blog detail pagina (/blog/[slug])
    │   │   ├── contact/ page.tsx         # Contact pagina (/contact)
    │   │   ├── projects/                 # Projecten sectie
    │   │   │   ├── page.tsx              #   Projecten lijst pagina (/projects)
    │   │   │   └── [slug]/ page.tsx      #   Project detail pagina (/projects/[slug])
    │   │   └── layout.tsx                # **Gedeelde layout** voor alle publieke pagina's (bv. met Header/Footer)
    │   │
    │   ├── layout.tsx         # **Root layout** (HTML structuur, MantineProvider, globale metadata)
    │   ├── globals.css        # Globale CSS stijlen / Tailwind base
    │   ├── loading.tsx        # Globale laad UI (voor route navigatie)
    │   ├── error.tsx          # Globale error UI
    │   ├── not-found.tsx      # Globale 404 pagina UI
    │   │
    │   ├── sitemap.ts         # Dynamische sitemap generatie (/sitemap.xml)
    │   └── robots.ts          # Dynamische robots.txt generatie (/robots.txt)
```

### `src/components/` - Herbruikbare UI Componenten

```
    ├── components/        # Map voor alle React componenten
    │   ├── ui/              # Basis, generieke UI elementen (indien nodig naast Mantine)
    │   │   └── ...          # (Momenteel minder relevant door direct Mantine gebruik)
    │   ├── layout/          # Componenten specifiek voor de paginalayout
    │   │   ├── Header.tsx   #   Navigatiebalk bovenaan
    │   │   └── Footer.tsx   #   Voettekst onderaan
    │   │
    │   ├── admin/           # Componenten specifiek voor de admin sectie
    │   │   ├── AdminNavbar.tsx # Navigatiebalk/sidebar voor admin
    │   │   ├── ProjectsTable.tsx # Tabel voor weergave projecten in admin
    │   │   └── ProjectForm.tsx   # Formulier voor aanmaken/bewerken projecten (NIEUW)
    │   │
    │   ├── features/        # Componenten specifiek voor een bepaalde feature/sectie
    │   │   ├── home/        #   Homepage specifieke componenten
    │   │   │   ├── HeroSection.tsx
    │   │   │   ├── FeaturedProjects.tsx  # Server Component (data fetch)
    │   │   │   ├── AnimatedProjectGrid.tsx # Client Component (animatie)
    │   │   │   ├── ShortAboutBlurb.tsx
    │   │   │   └── CallToActionBlock.tsx
    │   │   ├── projects/    #   Projecten specifieke componenten
    │   │   │   ├── ProjectCard.tsx       # Client Component (kaart + animatie)
    │   │   │   ├── ProjectList.tsx
    │   │   │   └── ProjectDetailView.tsx
    │   │   ├── blog/        #   Blog specifieke componenten
    │   │   │   ├── BlogPostCard.tsx      # Client Component (kaart)
    │   │   │   ├── BlogList.tsx
    │   │   │   └── BlogPostDetailView.tsx
    │   │   └── contact/     #   Contact specifieke componenten
    │   │       └── ContactForm.tsx       # Client Component (formulier state)
    │   │
    │   ├── shared/          # Componenten die over meerdere features worden gebruikt
    │   │   ├── MarkdownRenderer.tsx        # Client Component (rendert Markdown)
    │   │   └── MarkdownRenderer.module.css # Styling voor Markdown
    │   │
    │   └── icons/           # (Optioneel) Bundelen van custom iconen
    │       └── index.ts
```

### `src/lib/` - Core Logic, Actions, Utilities & Configuratie

```
    └── lib/               # Centrale plek voor niet-UI code
        ├── prisma.ts        # **Prisma client instantie** (gedeeld over actions)
        ├── utils.ts         # Algemene utility functies (bv. formatDate)
        ├── config.ts        # **Site configuratie** (naam, URL) & SEO defaults
        ├── logger.ts        # Logging setup
        │
        └── actions/         # **Server Actions** (backend logica die direct vanuit componenten aangeroepen wordt)
            ├── auth.ts        #   Acties voor login/logout
            ├── blog.ts        #   Acties voor blog data (getPublishedPosts, getPostBySlug)
            ├── projects.ts    #   Acties voor project data (getFeaturedProjects, getProjects, getProjectBySlug, deleteProjectAction, createProjectAction, updateProjectAction)
            └── contact.ts     #   Actie voor contactformulier (submitContactForm)
```

# Project Structuur Overzicht

## Configuratie & Root Bestanden

```
jeffdash-portfolio/
├── .env                  # Lokale environment variabelen (DATABASE_URL, etc.) - NIET IN GIT!
├── .env.development.local # Lokale dev environment variabelen (SUPABASE_URL, etc.) - NIET IN GIT!
├── .gitignore            # Bestanden/mappen te negeren door Git
├── .npmrc                # Configuratie voor pnpm
├── next-env.d.ts         # Next.js TypeScript declaraties
├── next.config.mjs       # Next.js configuratie
├── package.json          # Project dependencies en scripts (pnpm gebruikt)
├── pnpm-lock.yaml        # Exacte dependency versies voor pnpm
├── .pnpm.builds.json     # pnpm build informatie (automatisch gegenereerd)
├── postcss.config.js     # PostCSS configuratie (voor Tailwind)
├── tailwind.config.ts    # Tailwind CSS configuratie
├── tsconfig.json         # TypeScript configuratie
├── README.md             # Algemene project documentatie
├── structuur.MD          # Dit bestand (project structuur)
├── SOFTWARE_DEVELOPMENT_GUIDE.md # Richtlijnen voor ontwikkeling
├── Frontend.MD           # Documentatie specifiek voor Frontend
├── backend.MD            # Documentatie specifiek voor Backend
└── nextjsdoc.md          # Documentatie specifiek voor Next.js
```

## Scripts

```
├── scripts/               # Hulpscripts voor ontwikkeling
│   └── CreateAccountScript/ # Script(s) voor het aanmaken van accounts
│       └── create-admin.mjs # Script voor het aanmaken van een admin account
```

## Publieke Assets

```
├── public/                # Statische bestanden direct toegankelijk via de browser
│   ├── apple-icon.png     # App icon voor Apple (Next.js conventie)
│   ├── favicon.ico        # Standaard favicon
│   ├── icon.png           # App icon (Next.js conventie)
│   └── manifest.json      # Web App Manifest
```

## Broncode (src)

```
└── src/                   # Hoofdmap voor alle applicatiecode
```

### `src/app/` - Routing & Pagina's (Next.js App Router)

```
    ├── app/               # Implementatie van routes, layouts en pagina's
    │   ├── admin_area/      # Route group voor admin sectie
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
    │   │   │   └── page.tsx   #   Lijst van alle inzendingen
    │   │   │
    │   │   └── # login/       # Admin Login (aparte route)
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
    │   ├── ui/              # Basis, generieke UI elementen
    │   │   ├── Button.tsx   #   (Voorbeeld, kan anders zijn)
    │   │   └── Card.tsx     #   (Voorbeeld, kan anders zijn)
    │   ├── layout/          # Componenten specifiek voor de paginalayout
    │   │   ├── Header.tsx   #   Navigatiebalk bovenaan
    │   │   └── Footer.tsx   #   Voettekst onderaan
    │   │
    │   ├── admin/           # Componenten specifiek voor de admin sectie
    │   │   ├── AdminLayoutClient.tsx # Client-side wrapper voor admin layout
    │   │   ├── AdminNavbar.tsx # Navigatiebalk/sidebar voor admin
    │   │   ├── ContactSubmissionsTable.tsx # Tabel voor contact inzendingen
    │   │   ├── PostForm.tsx    # Formulier voor aanmaken/bewerken posts
    │   │   ├── ProjectForm.tsx   # Formulier voor aanmaken/bewerken projecten
    │   │   └── ProjectsTable.tsx # Tabel voor weergave projecten in admin
    │   │
    │   ├── features/        # Componenten specifiek voor een bepaalde feature/sectie
    │   │   ├── home/        #   Homepage specifieke componenten
    │   │   │   ├── HeroSection.tsx
    │   │   │   ├── FeaturedProjects.tsx
    │   │   │   ├── AnimatedProjectGrid.tsx
    │   │   │   ├── ShortAboutBlurb.tsx
    │   │   │   └── CallToActionBlock.tsx
    │   │   ├── projects/    #   Projecten specifieke componenten
    │   │   │   ├── ProjectCard.tsx
    │   │   │   ├── ProjectList.tsx
    │   │   │   └── ProjectDetailView.tsx
    │   │   ├── blog/        #   Blog specifieke componenten
    │   │   │   ├── BlogPostCard.tsx
    │   │   │   ├── BlogList.tsx
    │   │   │   └── BlogPostDetailView.tsx
    │   │   ├── contact/     #   Contact specifieke componenten
    │   │   │   └── ContactForm.tsx
    │   │   └── shared/      #   Feature-specifieke gedeelde componenten
    │   │       ├── ImageGallery.tsx
    │   │       └── TestimonialSlider.tsx
    │   │
    │   ├── shared/          # Algemeen gedeelde componenten
    │   │   ├── MarkdownRenderer.tsx
    │   │   └── MarkdownRenderer.module.css
    │   │
    │   └── icons/           # Bundelen van custom iconen
    │       └── index.ts
```

### `src/lib/` - Core Logic, Actions, Utilities & Configuratie

```
    └── lib/               # Centrale plek voor niet-UI code
        ├── supabase/        # **Supabase configuratie & clients**
        │   ├── client.ts    #   Client-side Supabase client instantie
        │   └── server.ts    #   Server-side Supabase client instantie (voor Server Actions/Components)
        ├── actions/         # **Server Actions** (backend logica direct vanuit componenten)
        │   ├── auth.ts      #   Acties voor login/logout, sessie validatie
        │   ├── blog.ts      #   Acties voor blog data (CRUD)
        │   ├── projects.ts  #   Acties voor project data (CRUD)
        │   └── contact.ts   #   Acties voor contactformulier (CRUD)
        ├── types/           # Globale TypeScript types/interfaces
        │   ├── blog.ts      #   (Voorbeeld, kan anders zijn)
        │   └── index.ts     #   Centraal export punt voor types
        ├── utils.ts         # Algemene utility functies (bv. formatDate)
        ├── config.ts        # **Site configuratie** (naam, URL) & SEO defaults
        ├── logger.ts        # Logging setup
        └── cloudinary.ts    # Cloudinary configuratie/client
```

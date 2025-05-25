-- Seed Posts voor Test Doeleinden
-- Voeg enkele test blog posts toe aan de Post tabel

INSERT INTO "Post" (
    "id", "slug", "title", "content", "excerpt", "featuredImageUrl", "tags", "category", 
    "published", "publishedAt", "metaTitle", "metaDescription", "featuredImageAltText",
    "createdAt", "updatedAt"
) VALUES 
(
    gen_random_uuid(),
    'mijn-eerste-blog-post',
    'Mijn Eerste Blog Post',
    '# Welkom bij mijn portfolio blog!

Dit is mijn eerste blog post waarin ik vertel over mijn reis als ontwikkelaar. Hier ga ik mijn ervaringen, tips en trucs delen.

## Wat kun je verwachten?

- **Tutorial posts** over moderne web development
- **Project showcases** van mijn werk
- **Tips & trucs** voor andere developers
- **Persoonlijke reflecties** over de tech industrie

Ik hoop dat je mijn content nuttig vindt!',
    'Welkom bij mijn portfolio blog! In deze eerste post vertel ik over wat je kunt verwachten.',
    NULL,
    ARRAY['development', 'portfolio', 'blog'],
    'Persoonlijk',
    TRUE,
    NOW(),
    'Mijn Eerste Blog Post - Jeffrey Dashboard',
    'Ontdek mijn nieuwe portfolio blog waar ik mijn ontwikkeling ervaringen deel.',
    NULL,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'next-js-tips-en-trucs',
    'Next.js Tips en Trucs voor Beginners',
    '# Next.js Tips voor Beginners

Next.js is een krachtig React framework dat ik veel gebruik. Hier zijn enkele tips die ik heb geleerd:

## 1. Server-Side Rendering vs Static Generation

Kies de juiste methode voor je use case:
- **SSG** voor statische content
- **SSR** voor dynamische content
- **ISR** voor het beste van beide werelden

## 2. Optimalisatie Tips

```typescript
// Gebruik dynamic imports voor betere performance
const DynamicComponent = dynamic(() => import("./Heavy"), {
  loading: () => <p>Loading...</p>,
})
```

## 3. API Routes

Maak gebruik van API routes voor serverless functions:

```typescript
// pages/api/hello.ts
export default function handler(req, res) {
  res.status(200).json({ message: "Hello World" })
}
```

Happy coding!',
    'Praktische tips en trucs voor Next.js beginners om betere applicaties te bouwen.',
    NULL,
    ARRAY['nextjs', 'react', 'tutorial', 'tips'],
    'Tutorial',
    TRUE,
    NOW() - INTERVAL '2 days',
    'Next.js Tips voor Beginners - Jeffrey Dashboard',
    'Leer praktische Next.js tips en trucs voor betere React applicaties.',
    NULL,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
),
(
    gen_random_uuid(),
    'waarom-typescript-essentieel-is',
    'Waarom TypeScript Essentieel is voor Moderne Development',
    '# TypeScript: Meer dan alleen types

TypeScript heeft mijn development workflow drastisch verbeterd. Hier is waarom:

## Type Safety

TypeScript vangt fouten tijdens development in plaats van runtime:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function getUser(id: number): User | null {
  // Type-safe functie
  return users.find(user => user.id === id) || null;
}
```

## IntelliSense & Autocomplete

Je IDE wordt veel krachtiger met TypeScript. Autocomplete, refactoring tools, en navigation worden veel beter.

## Beter Team Development

Met TypeScript zijn contracts tussen ontwikkelaars duidelijker:

```typescript
// API contract is duidelijk
async function fetchProjects(): Promise<Project[]> {
  const response = await fetch("/api/projects");
  return response.json();
}
```

## Graduele Adoptie

Je kunt TypeScript geleidelijk introduceren:
1. Start met `.ts` bestanden
2. Voeg types toe waar nodig
3. Maak gebruik van `any` waar je vastloopt
4. Verbeter geleidelijk je types

TypeScript is niet perfect, maar het maakt development veel prettiger!',
    'Ontdek waarom TypeScript een game-changer is voor moderne web development.',
    NULL,
    ARRAY['typescript', 'javascript', 'development', 'best-practices'],
    'Tutorial',
    FALSE, -- Unpublished draft
    NULL,
    'Waarom TypeScript Essentieel is - Jeffrey Dashboard',
    'Ontdek de voordelen van TypeScript voor moderne web development.',
    NULL,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
)
ON CONFLICT ("slug") DO UPDATE SET
    "title" = EXCLUDED."title",
    "content" = EXCLUDED."content",
    "excerpt" = EXCLUDED."excerpt",
    "tags" = EXCLUDED."tags",
    "category" = EXCLUDED."category",
    "published" = EXCLUDED."published",
    "publishedAt" = EXCLUDED."publishedAt",
    "metaTitle" = EXCLUDED."metaTitle",
    "metaDescription" = EXCLUDED."metaDescription",
    "updatedAt" = NOW();

-- Feedback melding
SELECT 'Test blog posts succesvol toegevoegd.' AS status; 
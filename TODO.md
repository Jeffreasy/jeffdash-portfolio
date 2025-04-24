# Project TODO Lijst (Gebaseerd op Code Comments)

Dit document bevat een overzicht van de `// TODO:` comments gevonden in de codebase.

## `src/components/features/projects/ProjectDetailView.tsx`

*   [ ] Line 114: Implement ImageGallery or similar

## `src/lib/actions/auth.ts`

*   [ ] Line 63: Geef specifiekere feedback op basis van error.message indien gewenst

## `src/lib/actions/blog.ts`

*   [ ] Line 83: Autorisatie check? - Aangenomen dat de pagina beveiligd is.
*   [ ] Line 107: Autorisatie check?
*   [ ] Line 149: Revalidate specifieke post pagina

## `src/lib/actions/contact.ts`

*   [ ] Line 77: Stuur eventueel een e-mail notificatie

## `src/lib/actions/projects.ts`

*   [ ] Line 88: Order ProjectImage by 'order' field if needed, requires specific Supabase syntax
*   [ ] Line 208: Verbeter Supabase error afhandeling indien nodig
*   [ ] Line 445: Roep Cloudinary API aan om afbeeldingen te verwijderen (optioneel)
*   [ ] Line 460: Bepaal juiste 'order' voor nieuwe afbeeldingen (bv. laatste + 1)

## `src/middleware.ts`

*   [ ] Line 60: Add role check if needed, similar to validateAdminSession 

## Algemene Verbeterpunten (Analyse `src/app/(pages)/`)

### Layout (`src/app/(pages)/layout.tsx`)
*   [x] Implementeer een gedeelde `Header` en `Footer` component binnen deze layout.

### Homepage (`src/app/(pages)/page.tsx`)
*   [x] Overweeg limiet (`limit(3)`) toe te passen in `getPublishedPosts` i.p.v. `.slice()` op de pagina.


### Blog Lijst (`src/app/(pages)/blog/page.tsx`)
*   [ ] Implementeer paginering of infinite scroll. Pas `getPublishedPosts` en `BlogList` aan.
*   [ ] Overweeg een filter- of zoekfunctie toe te voegen.
*   [ ] Zorg dat `BlogList` een duidelijke "geen posts" melding toont.

### Blog Detail (`src/app/(pages)/blog/[slug]/page.tsx`)
*   [ ] Implementeer een "Gerelateerde Posts" sectie.
*   [ ] Verifieer correcte syntax highlighting voor codefragmenten via `BlogPostDetailView`/`MarkdownRenderer`.

### Project Lijst (`src/app/(pages)/projects/page.tsx`)
*   [ ] Implementeer paginering indien nodig. Pas `getProjects` en `ProjectList` aan.
*   [ ] Overweeg filteropties (bv. op technologie).
*   [ ] Zorg dat `ProjectList` een duidelijke "geen projecten" melding toont.

### Project Detail (`src/app/(pages)/projects/[slug]/page.tsx`)
*   [ ] Implementeer navigatie (links) naar vorig/volgend project.
*   [ ] Zorg dat `ProjectDetailView` een afbeeldingengalerij toont (koppelt aan bestaande TODO).

### Contact Pagina (`src/app/(pages)/contact/page.tsx`)
*   [ ] Overweeg toevoegen van alternatieve contactgegevens.
*   [ ] Verifieer duidelijke succes-/foutmeldingen van `ContactForm` op de pagina.

### Over Mij Pagina (`src/app/(pages)/about/page.tsx` - Content nu dynamisch)
*   [ ] Werk placeholder metadata descriptions bij.
*   [ ] Voeg Open Graph en Twitter afbeeldingen toe (vereist afbeeldingen).
*   [x] Voeg een profielfoto toe (vereist afbeelding). 
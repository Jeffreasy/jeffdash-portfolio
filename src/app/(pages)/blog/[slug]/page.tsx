import React from 'react';
import { getPostBySlug } from '@/lib/actions/blog';
import BlogPostDetailView from '@/components/features/blog/BlogPostDetailView';
import { Metadata, ResolvingMetadata } from 'next';
import { SITE_CONFIG } from '@/lib/config'; // Importeer site config
import { notFound } from 'next/navigation'; // Importeer notFound

// Verwijder of commentarieer de aparte interface (niet strikt nodig hier)
// interface BlogPostPageProps {
//   params: { slug: string };
// }

// Add ISR revalidation (1 hour)
export const revalidate = 3600;

// --- Dynamische Metadata Generatie (SEO) --- //
// Restore explicit type for props
export async function generateMetadata(props: { params: { slug: string } }, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = props.params.slug;
  // Haal de post op specifiek voor metadata
  const post = await getPostBySlug(slug);

  // Fallback metadata als de post niet gevonden wordt
  if (!post) {
    return {
      title: `Post niet gevonden | ${SITE_CONFIG.name}`,
      description: 'Deze blog post kon niet worden gevonden.',
    };
  }

  // Extraheer data voor metadata, met logische fallbacks
  const metaTitle = post.metaTitle || post.title;
  const metaDescription = post.metaDescription || post.excerpt || SITE_CONFIG.description;
  const featuredImageUrl = post.featuredImageUrl; // Kan null zijn
  const canonicalUrl = `${SITE_CONFIG.url}/blog/${slug}`;

  return {
    // Belangrijkste Metadata
    title: `${metaTitle} | ${SITE_CONFIG.name}`, // Paginatitel (zichtbaar in tabblad/zoekresultaten)
    description: metaDescription, // Meta description voor zoekmachines
    keywords: post.tags || [], // Gebruik tags als keywords (optioneel)
    // canonical: canonicalUrl, // Specificeren van de canonieke URL
    alternates: {
        canonical: canonicalUrl, // Aanbevolen manier voor canonical URL
    },

    // Open Graph Metadata (voor social media sharing, vooral Facebook/LinkedIn)
    openGraph: {
      title: `${metaTitle} | ${SITE_CONFIG.name}`, // OG Titel
      description: metaDescription, // OG Beschrijving
      url: canonicalUrl, // De canonieke URL van deze pagina
      siteName: SITE_CONFIG.name, // Naam van de website
      images: featuredImageUrl ? [
        {
          url: featuredImageUrl, // URL van de uitgelichte afbeelding
          // width: 1200, // Optioneel: specificeer breedte voor betere weergave
          // height: 630, // Optioneel: specificeer hoogte (1.91:1 ratio aanbevolen)
          alt: post.featuredImageAltText || metaTitle, // Alt tekst voor de afbeelding
        }
      ] : (await parent).openGraph?.images || [], // Fallback naar afbeeldingen van parent layout
      locale: 'nl_NL', // Locale van de content
      type: 'article', // Type content (artikel is geschikt voor blog posts)
      publishedTime: post.publishedAt?.toISOString(), // Publicatiedatum
      modifiedTime: post.updatedAt?.toISOString(), // Laatste modificatiedatum
      authors: [SITE_CONFIG.url], // URL naar auteurspagina of website (aanpassen indien nodig)
      tags: post.tags || [], // Tags gerelateerd aan het artikel
      // section: post.category, // Optioneel: categorie van het artikel
    },

    // Twitter Card Metadata (voor social media sharing op Twitter)
    twitter: {
      card: featuredImageUrl ? 'summary_large_image' : 'summary', // Type kaart (grote afbeelding indien beschikbaar)
      title: `${metaTitle} | ${SITE_CONFIG.name}`, // Titel voor Twitter
      description: metaDescription, // Beschrijving voor Twitter
      // site: '@jouwTwitterHandle', // Optioneel: Twitter handle van de site
      // creator: '@auteurTwitterHandle', // Optioneel: Twitter handle van de auteur
      images: featuredImageUrl ? [featuredImageUrl] : [], // Afbeelding(en) voor de Twitter card
    },

    // Optioneel: Robots meta tag (standaard is meestal prima)
    // robots: {
    //   index: true,
    //   follow: true,
    //   nocache: true,
    //   googleBot: { ... },
    // },
  };
}

// --- Pagina Component --- //
// Restore explicit type for props/params
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // Haal de volledige post data op voor de pagina weergave
  const post = await getPostBySlug(slug);

  // Als post niet gevonden (of niet gepubliceerd), toon 404 pagina
  if (!post) {
    notFound();
  }

  // Geef de opgehaalde post door aan de view component
  return <BlogPostDetailView post={post} />;
} 
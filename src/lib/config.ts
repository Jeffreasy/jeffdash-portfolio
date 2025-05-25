import { z } from 'zod';
import { logger } from './logger';

// Configuration schema
const SiteConfigSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url(),
  ogImage: z.string().url(),
  author: z.string().min(1),
  twitterHandle: z.string().optional(),
});

// Type inference from schema
export type SiteConfig = z.infer<typeof SiteConfigSchema>;

// Validate environment variables
const requiredEnvVars = ['NEXT_PUBLIC_SITE_URL'] as const;
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  const errorMessage = `Missing required environment variables: ${missingEnvVars.join(', ')}`;
  logger.error(errorMessage);
  throw new Error(errorMessage);
}

// Site configuration with validation
export const SITE_CONFIG: SiteConfig = SiteConfigSchema.parse({
  name: "Jeffdash Portfolio",
  description: "Portfolio van Jeffrey - Web Developer",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/og-default.png`,
  author: "Jeffrey",
  twitterHandle: "@jouwtwitterhandle",
});

// Metadata schema
const MetadataSchema = z.object({
  title: z.object({
    default: z.string(),
    template: z.string(),
  }),
  description: z.string(),
  openGraph: z.object({
    type: z.string(),
    locale: z.string(),
    url: z.string().url(),
    siteName: z.string(),
    title: z.string(),
    description: z.string(),
    images: z.array(z.object({
      url: z.string().url(),
      width: z.number(),
      height: z.number(),
      alt: z.string(),
    })),
  }),
  twitter: z.object({
    card: z.string(),
    title: z.string(),
    description: z.string(),
    images: z.array(z.string().url()),
    creator: z.string().optional(),
  }),
});

// Type inference from schema
export type Metadata = z.infer<typeof MetadataSchema>;

// Default metadata with validation
export const DEFAULT_METADATA: Metadata = MetadataSchema.parse({
  title: { 
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
}); 
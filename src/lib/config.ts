// Placeholder voor site-brede configuratie en SEO defaults

export const SITE_CONFIG = {
  name: "Jeffdash Portfolio",
  description: "Portfolio van Jeffrey - Web Developer",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/og-default.png`, // Voorbeeld pad naar default OG image
  author: "Jeffrey",
  twitterHandle: "@jouwtwitterhandle", // Optioneel
};

// Default metadata object (kan gebruikt worden in root layout)
export const DEFAULT_METADATA = {
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
    // creator: SITE_CONFIG.twitterHandle, // Uncomment als je een handle hebt
  },
  // icons: { // Optioneel, Next.js pakt public/icon.png etc. automatisch
  //   icon: "/favicon.ico", 
  //   apple: "/apple-icon.png", 
  // },
  // manifest: "/manifest.json", // Optioneel
}; 
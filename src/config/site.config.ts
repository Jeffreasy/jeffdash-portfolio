import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    github: string
    linkedin: string
  }
  contact: {
    email: string
    phone?: string
  }
  seo: {
    title: string
    description: string
    ogImage: string
    twitterHandle?: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Jeff Dashwood",
  description: "Full-stack developer met een passie voor moderne web technologieën en gebruiksvriendelijk design.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Projecten",
      href: "/projects",
    },
    {
      title: "Over Mij",
      href: "/about",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
  links: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
  },
  contact: {
    email: "your@email.com",
    phone: "+31 6 12345678", // Optioneel
  },
  seo: {
    title: "Jeff Dashwood - Full-stack Developer",
    description: "Portfolio van Jeff Dashwood, full-stack developer gespecialiseerd in React, Next.js, en moderne web technologieën.",
    ogImage: "/images/og-image.jpg",
    twitterHandle: "@yourusername", // Optioneel
  },
}

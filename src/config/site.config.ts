import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    github: string
    linkedin: string
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
      title: "Blog",
      href: "/blog",
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
    github: "https://github.com/Jeffreasy",
    linkedin: "https://linkedin.com/in/yourusername",
  },
}

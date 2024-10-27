import { siteConfig } from '@/config/site.config'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="text-sm">
            Built by {siteConfig.name}
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground/80"
            >
              GitHub
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground/80"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { Button } from "@/components/common/Button/Button"
import Link from "next/link"
import { siteConfig } from "@/config/site.config"

export function Hero() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-4">{siteConfig.name}</h1>
          <p className="text-xl mb-8">{siteConfig.description}</p>
          <div className="flex gap-4">
            <Link href="/projects">
              <Button>Bekijk projecten</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Neem contact op</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

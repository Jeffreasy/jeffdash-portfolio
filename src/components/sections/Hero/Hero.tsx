import { Button } from "@/components/common/Button/Button"
import Link from "next/link"
import { siteConfig } from "@/config/site.config"

export function Hero() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-4">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
          Full Stack Developer
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          Ik bouw moderne web applicaties met focus op gebruiksvriendelijkheid en performance. 
          Van charity platforms tot event websites, elk project krijgt de aandacht die het verdient.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/projects">Bekijk Projecten</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={siteConfig.links.github}>GitHub</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

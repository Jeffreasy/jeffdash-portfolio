import { Button } from "@/components/common/Button/Button"
import Link from "next/link"

export function About() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold mb-8">Over Mij</h2>
          <p className="text-lg mb-8">
            Ervaren full-stack developer met passie voor het bouwen van moderne web applicaties.
          </p>
          <div className="flex gap-4">
            <Link href="/about">
              <Button>Meer over mij</Button>
            </Link>
            <Link href="https://github.com/yourusername" target="_blank">
              <Button variant="outline">GitHub</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Button } from "@/components/common/Button/Button"
import Link from "next/link"

export function About() {
  return (
    <section className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto flex max-w-[980px] flex-col items-start gap-4">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
          Over Mij
        </h2>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Als full-stack developer specialiseer ik me in het bouwen van websites en web applicaties
          die er niet alleen mooi uitzien, maar ook uitstekend presteren. Met projecten als 
          Whisky For Charity en De Koninklijke Loop laat ik zien hoe technologie en gebruiksgemak 
          samenkomen.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/about">Meer Over Mij</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

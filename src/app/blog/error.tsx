'use client'

import { Button } from "@/components/common/Button/Button"
import { useEffect } from "react"

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <h2 className="text-2xl font-bold mb-4">Er is iets misgegaan!</h2>
      <p className="text-muted-foreground mb-8">
        Sorry, er is een fout opgetreden bij het laden van de blog posts.
      </p>
      <Button onClick={reset}>
        Probeer opnieuw
      </Button>
    </div>
  )
}

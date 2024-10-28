export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        {children}
      </div>
    </div>
  )
}

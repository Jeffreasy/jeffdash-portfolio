export default function BlogLoading() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((n) => (
        <div key={n} className="animate-pulse">
          <div className="h-48 bg-secondary rounded-lg mb-4" />
          <div className="h-8 bg-secondary rounded w-3/4 mb-4" />
          <div className="h-4 bg-secondary rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

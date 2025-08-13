export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Search header skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-slate-200 rounded animate-pulse w-64"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-96"></div>
        </div>

        {/* Search results skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="h-48 bg-slate-200 animate-pulse"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-slate-200 rounded animate-pulse w-20"></div>
                <div className="h-6 bg-slate-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

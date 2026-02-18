export function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6" role="status" aria-label="Loading products">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="skeleton-pulse border border-border bg-surface p-4"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-surface-2" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 bg-surface-2" />
                <div className="h-4 w-1/3 bg-surface-2" />
                <div className="h-3 w-1/2 bg-surface-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

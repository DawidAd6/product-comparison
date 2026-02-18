export function EmptyState() {
  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="empty-state-border flex max-w-md flex-col items-center gap-6 border-2 border-dashed border-accent p-10 text-center">
        <h2 className="font-serif text-3xl text-text">
          Select products to compare
        </h2>
        <p className="font-mono text-sm leading-relaxed text-text-muted">
          Choose up to 3 products from the catalog below to see a
          side-by-side comparison of their specifications.
        </p>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-accent/50"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </div>
  );
}

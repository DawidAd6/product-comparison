import { useEffect, useRef } from 'react';
import { useComparisonStore } from '../store/useComparisonStore';
import { MAX_PRODUCTS } from '../types';

export function ComparisonRail() {
  const { selectedProducts, removeProduct, clearAll } = useComparisonStore();
  const emptySlots = MAX_PRODUCTS - selectedProducts.length;
  const headerRef = useRef<HTMLElement>(null);

  // Keep --rail-h in sync with the actual header height so the sticky
  // table thead always sits exactly below the rail.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () =>
      document.documentElement.style.setProperty('--rail-h', `${el.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-2xl"
      role="banner"
      aria-label="Product comparison bar"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-3 md:px-6">
        <span className="shrink-0 font-serif text-lg text-text-muted" aria-hidden="true">
          Compare
        </span>
        <span className="sr-only">
          {selectedProducts.length} of {MAX_PRODUCTS} products selected for comparison
        </span>

        {selectedProducts.map((product, i) => (
          <div
            key={product.id}
            className="rail-item-enter flex shrink-0 items-center gap-2 border border-accent/40 bg-surface px-3 py-1.5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="text-sm" role="img" aria-label={product.category}>
              {product.image}
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-sm leading-tight text-text">
                {product.name}
              </span>
              <span className="font-mono text-xs text-accent">
                {product.price.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
              </span>
            </div>
            <button
              onClick={() => removeProduct(product.id)}
              className="ml-2 flex h-5 w-5 items-center justify-center rounded text-text-muted transition-colors hover:text-worse focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label={`Remove ${product.brand} ${product.name} from comparison`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M2 2l8 8M10 2l-8 8" />
              </svg>
            </button>
          </div>
        ))}

        {Array.from({ length: emptySlots }, (_, i) => (
          <div
            key={`empty-${i}`}
            className="flex h-10 w-28 shrink-0 items-center justify-center border border-dashed border-accent/30 font-mono text-xs text-accent/50"
            aria-hidden="true"
          >
            + Add product
          </div>
        ))}

        {selectedProducts.length > 0 && (
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <button
              onClick={() => window.print()}
              className="font-mono text-xs text-text-muted transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent print:hidden"
              aria-label="Print comparison"
            >
              Print
            </button>
            <button
              onClick={clearAll}
              className="font-mono text-xs text-text-muted transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Clear all selected products from comparison (or press Escape)"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

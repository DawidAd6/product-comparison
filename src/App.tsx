import { useEffect, useMemo } from 'react';
import { useComparisonStore } from './store/useComparisonStore';
import { getSpecDefinitions } from './data/specDefinitions';
import { ComparisonRail } from './components/ComparisonRail';
import { ProductSelector } from './components/ProductSelector';
import { ComparisonTable } from './components/ComparisonTable';
import { EmptyState } from './components/EmptyState';
import { useUrlSync } from './hooks/useUrlSync';

export function App() {
  useUrlSync();

  const selectedProducts = useComparisonStore((s) => s.selectedProducts);
  const clearAll = useComparisonStore((s) => s.clearAll);

  const specDefinitions = useMemo(
    () => getSpecDefinitions(selectedProducts),
    [selectedProducts],
  );

  // #5 — Escape to clear selection
  useEffect(() => {
    if (selectedProducts.length === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') clearAll();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProducts.length, clearAll]);

  return (
    <div className="min-h-screen">
      <ComparisonRail />

      <main id="main-content">
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {selectedProducts.length === 0
            ? 'No products selected for comparison.'
            : `Comparing ${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''}: ${selectedProducts.map((p) => `${p.brand} ${p.name}`).join(', ')}.`}
        </div>

        {selectedProducts.length > 0 ? (
          <ComparisonTable
            products={selectedProducts}
            specDefinitions={specDefinitions}
          />
        ) : (
          <EmptyState />
        )}

        <div className="border-t border-border">
          <ProductSelector />
        </div>
      </main>
    </div>
  );
}

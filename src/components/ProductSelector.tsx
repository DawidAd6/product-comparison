import { useEffect, useMemo } from 'react';
import type { Product, ProductCategory } from '../types';
import { MAX_PRODUCTS } from '../types';
import { useComparisonStore } from '../store/useComparisonStore';
import { ProductCard } from './ProductCard';

const CATEGORIES: { value: ProductCategory | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'smartphone', label: 'Smartphones' },
  { value: 'laptop', label: 'Laptops' },
  { value: 'monitor', label: 'Monitors' },
];

export function ProductSelector() {
  const {
    allProducts,
    selectedProducts,
    categoryFilter,
    searchQuery,
    addProduct,
    removeProduct,
    setFilter,
    setSearch,
  } = useComparisonStore();

  const selectedIds = useMemo(
    () => new Set(selectedProducts.map((p) => p.id)),
    [selectedProducts],
  );

  const isFull = selectedProducts.length >= MAX_PRODUCTS;
  const lockedCategory = selectedProducts.length > 0 ? selectedProducts[0]!.category : null;

  // #8 — Auto-apply category filter when category is locked
  useEffect(() => {
    if (lockedCategory !== null) {
      setFilter(lockedCategory);
    }
  }, [lockedCategory, setFilter]);

  const filteredProducts = useMemo(() => {
    let result = allProducts;
    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q),
      );
    }
    return result;
  }, [allProducts, categoryFilter, searchQuery]);

  const handleToggle = (product: Product) => {
    if (selectedIds.has(product.id)) {
      removeProduct(product.id);
    } else {
      addProduct(product);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <h2 className="mb-4 font-serif text-xl text-text">Products</h2>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-border bg-surface px-4 py-2 font-mono text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent sm:w-auto"
          aria-label="Search products by name or brand"
        />

        <div className="flex gap-1" role="group" aria-label="Filter by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setFilter(cat.value)}
              aria-pressed={categoryFilter === cat.value}
              disabled={lockedCategory !== null && cat.value !== null && cat.value !== lockedCategory}
              className={`px-3 py-1.5 font-mono text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-30 ${
                categoryFilter === cat.value
                  ? 'bg-accent text-background'
                  : 'border border-border bg-surface text-text-muted hover:text-text'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {lockedCategory && (
        <p className="mb-4 border border-border px-4 py-2 font-mono text-xs text-text-muted" role="status">
          Comparing <span className="text-accent capitalize">{lockedCategory}s</span> — remove all products to switch category.
        </p>
      )}

      {isFull && (
        <p className="mb-4 border border-accent/30 bg-accent/5 px-4 py-2 font-mono text-xs text-accent" role="status">
          Maximum of {MAX_PRODUCTS} products selected. Remove a product to add another.
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Product catalog">
        {filteredProducts.map((product) => {
          const isSelected = selectedIds.has(product.id);
          const isWrongCategory = lockedCategory !== null && product.category !== lockedCategory;
          return (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={isSelected}
              isDisabled={!isSelected && (isFull || isWrongCategory)}
              disabledReason={
                !isSelected && isWrongCategory
                  ? 'different category'
                  : !isSelected && isFull
                    ? 'comparison full'
                    : undefined
              }
              onToggle={handleToggle}
            />
          );
        })}
      </div>

      {/* #10 — Clear search button in empty state */}
      {filteredProducts.length === 0 && (
        <div className="py-12 text-center">
          <p className="font-mono text-sm text-text-muted">No products match your search.</p>
          {searchQuery && (
            <button
              onClick={() => setSearch('')}
              className="mt-3 border border-border px-4 py-1.5 font-mono text-xs text-text-muted transition-colors hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </section>
  );
}

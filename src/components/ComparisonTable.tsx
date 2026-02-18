import { useState, useRef, useCallback } from 'react';
import type { Product, SpecDefinition } from '../types';
import { SpecRow } from './SpecRow';
import { isDifferent } from '../utils/comparison';

interface ComparisonTableProps {
  products: Product[];
  specDefinitions: SpecDefinition[];
}

// --- Winner Summary (#3) ---
function WinnerSummary({ products, specDefinitions }: ComparisonTableProps) {
  if (products.length < 2) return null;

  const winCounts: number[] = products.map(() => 0);
  for (const spec of specDefinitions) {
    if (spec.higherIsBetter === undefined) continue;
    const vals = products.map((p) => p.specs[spec.key]);
    const nums = vals.map((v) => (typeof v === 'number' ? v : null));
    const valids = nums.filter((n): n is number => n !== null);
    if (valids.length < 2) continue;
    const best = spec.higherIsBetter ? Math.max(...valids) : Math.min(...valids);
    if (valids.every((v) => v === best)) continue;
    nums.forEach((v, i) => { if (v !== null && v === best) (winCounts as number[])[i] = ((winCounts as number[])[i] ?? 0) + 1; });
  }

  const maxWins = Math.max(...winCounts);
  if (maxWins === 0) return null;

  return (
    <div className="flex items-center gap-3 border border-border bg-surface px-4 py-3 mb-0">
      <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-text-muted">Overall</span>
      <div className="flex flex-wrap gap-4">
        {products.map((p, i) => (
          <div key={p.id} className="flex items-center gap-2">
            <span className="font-serif text-sm text-text">{p.name}</span>
            <span className={`font-mono text-xs ${winCounts[i] === maxWins ? 'text-accent' : 'text-text-muted'}`}>
              {winCounts[i]}W
            </span>
            {winCounts[i] === maxWins && (
              <span className="border border-accent/40 px-1.5 py-0.5 font-mono text-[10px] text-accent">BEST</span>
            )}
          </div>
        ))}
      </div>
      <span className="ml-auto shrink-0 font-mono text-xs text-text-muted">
        {specDefinitions.filter((s) => s.higherIsBetter !== undefined).length} criteria
      </span>
    </div>
  );
}

// --- Helpers ---
function RatingStars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="inline-flex gap-0.5 text-xs text-accent" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: full }, (_, i) => <span key={`f${i}`}>&#9733;</span>)}
      {half && <span>&#9734;</span>}
      {Array.from({ length: empty }, (_, i) => <span key={`e${i}`} className="text-text-muted">&#9734;</span>)}
    </span>
  );
}

const AVAIL_LABELS: Record<Product['availability'], string> = {
  in_stock: 'In Stock', limited: 'Limited', out_of_stock: 'Out of Stock',
};
const AVAIL_CLASSES: Record<Product['availability'], string> = {
  in_stock: 'border-better/30 bg-better/10 text-better',
  limited: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  out_of_stock: 'border-worse/30 bg-worse/10 text-worse',
};

// --- Main component ---
export function ComparisonTable({ products, specDefinitions }: ComparisonTableProps) {
  if (products.length === 0) return null;

  const [showDiffsOnly, setShowDiffsOnly] = useState(false); // #7
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set()); // #1

  // Refs to sync horizontal scroll between the sticky header table and the body table
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  const syncFromBody = useCallback(() => {
    if (headerScrollRef.current && bodyScrollRef.current) {
      headerScrollRef.current.scrollLeft = bodyScrollRef.current.scrollLeft;
    }
  }, []);

  const syncFromHeader = useCallback(() => {
    if (headerScrollRef.current && bodyScrollRef.current) {
      bodyScrollRef.current.scrollLeft = headerScrollRef.current.scrollLeft;
    }
  }, []);

  const toggleGroup = (name: string) =>
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  const minPrice = Math.min(...products.map((p) => p.price)); // #4

  const visibleSpecs = showDiffsOnly
    ? specDefinitions.filter((spec) => isDifferent(products.map((p) => p.specs[spec.key])))
    : specDefinitions;

  const grouped = visibleSpecs.reduce<Record<string, SpecDefinition[]>>((acc, spec) => {
    const g = spec.group ?? 'Other';
    (acc[g] ??= []).push(spec);
    return acc;
  }, {});

  const colCount = products.length + 1;

  const theadRow = (
    <table className="w-full border-collapse table-fixed" style={{ tableLayout: 'fixed' }} aria-hidden="true">
      <thead>
        <tr className="border-b border-border bg-background">
          <th scope="col" className="sticky left-0 z-10 w-44 bg-background py-4 pl-4 text-left font-mono text-xs font-normal uppercase tracking-wider text-text-muted">
            Specification
          </th>
          {products.map((product) => (
            <th key={product.id} scope="col" className="px-4 py-4 text-center">
              <span className="block text-3xl" role="img" aria-label={product.category}>{product.image}</span>
              <span className="mt-1 block font-serif text-lg text-text">{product.name}</span>
              <span className="block font-mono text-xs text-text-muted">{product.brand}</span>
              <span className="mt-1 block font-mono text-xl font-semibold text-accent">
                {product.price.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
              </span>
              {product.price === minPrice && products.length > 1 && (
                <span className="mt-0.5 inline-block border border-accent/40 px-1.5 py-0.5 font-mono text-[10px] text-accent">
                  Best Price
                </span>
              )}
              <div className="mt-1 flex items-center justify-center gap-2">
                <RatingStars rating={product.rating} />
                <span className="font-mono text-xs text-text-muted">({product.reviewCount})</span>
              </div>
              <span className={`mt-1 inline-block border px-2 py-0.5 font-mono text-xs ${AVAIL_CLASSES[product.availability]}`}>
                {AVAIL_LABELS[product.availability]}
              </span>
            </th>
          ))}
        </tr>
      </thead>
    </table>
  );

  const tbodyTable = (
    <table className="w-full border-collapse" aria-label="Side-by-side product specifications">
      <colgroup>
        <col className="w-44" />
        {products.map((p) => <col key={p.id} />)}
      </colgroup>
      <tbody>
        {Object.entries(grouped).map(([groupName, specs]) => (
          <>
            <tr key={`grp-${groupName}`} className="border-b border-border bg-background">
              <td colSpan={colCount} className="py-0">
                <button
                  onClick={() => toggleGroup(groupName)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left font-mono text-xs uppercase tracking-wider text-text-muted hover:text-text focus:outline-none focus:ring-inset focus:ring-2 focus:ring-accent"
                  aria-expanded={!collapsedGroups.has(groupName)}
                >
                  <span className="text-accent/60">{collapsedGroups.has(groupName) ? '▶' : '▼'}</span>
                  {groupName}
                  <span className="text-[10px] opacity-50">({specs.length})</span>
                </button>
              </td>
            </tr>
            {!collapsedGroups.has(groupName) && specs.map((spec, i) => (
              <SpecRow key={spec.key} spec={spec} products={products} index={i} />
            ))}
          </>
        ))}
        {visibleSpecs.length === 0 && (
          <tr>
            <td colSpan={colCount} className="py-8 text-center font-mono text-xs text-text-muted">
              All specs are identical. Toggle off "Differences only" to see full list.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6" aria-label="Product comparison table">
      <div className="py-4">
        <WinnerSummary products={products} specDefinitions={specDefinitions} />
      </div>

      <div className="flex items-center justify-between py-2">
        <span className="font-mono text-xs text-text-muted">
          {visibleSpecs.length} spec{visibleSpecs.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => setShowDiffsOnly((v) => !v)}
          aria-pressed={showDiffsOnly}
          className={`font-mono text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
            showDiffsOnly ? 'text-accent' : 'text-text-muted hover:text-text'
          }`}
        >
          {showDiffsOnly ? '● Differences only' : '○ Differences only'}
        </button>
      </div>

      {/* Desktop: sticky product header outside overflow container, body scrolls independently */}
      <div className="hidden md:block">
        {/* Sticky header — lives outside overflow-x:auto so sticky works vs the viewport */}
        <div
          ref={headerScrollRef}
          onScroll={syncFromHeader}
          className="sticky z-20 overflow-x-hidden border-b border-border bg-background"
          style={{ top: 'var(--rail-h, 57px)' }}
        >
          {theadRow}
        </div>
        {/* Scrollable body */}
        <div
          ref={bodyScrollRef}
          onScroll={syncFromBody}
          className="overflow-x-auto"
        >
          {tbodyTable}
        </div>
      </div>

      <div className="flex flex-col gap-6 pb-6 md:hidden">
        {products.map((product) => (
          <div key={product.id} className="border border-border bg-surface">
            <div className="border-b border-border p-4 text-center">
              <span className="block text-3xl">{product.image}</span>
              <span className="mt-1 block font-serif text-lg text-text">{product.name}</span>
              <span className="block font-mono text-xs text-text-muted">{product.brand}</span>
              <span className="mt-1 block font-mono text-xl font-semibold text-accent">
                {product.price.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
              </span>
              {product.price === minPrice && products.length > 1 && (
                <span className="mt-0.5 inline-block border border-accent/40 px-1.5 py-0.5 font-mono text-[10px] text-accent">Best Price</span>
              )}
              <div className="mt-1 flex items-center justify-center gap-2">
                <RatingStars rating={product.rating} />
              </div>
            </div>
            <div className="divide-y divide-border/50">
              {visibleSpecs.map((spec) => {
                const value = product.specs[spec.key];
                if (value === undefined) return null;
                return (
                  <div key={spec.key} className="flex items-center justify-between px-4 py-2">
                    <span className="font-mono text-xs uppercase text-text-muted">{spec.label}</span>
                    <span className="font-mono text-sm text-text">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : spec.unit ? `${value} ${spec.unit}` : String(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

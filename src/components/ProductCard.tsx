import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  isDisabled: boolean;
  disabledReason?: 'comparison full' | 'different category';
  onToggle: (product: Product) => void;
}

const AVAILABILITY_LABELS: Record<Product['availability'], string> = {
  in_stock: 'In Stock',
  limited: 'Limited',
  out_of_stock: 'Out of Stock',
};

const AVAILABILITY_CLASSES: Record<Product['availability'], string> = {
  in_stock: 'text-better',
  limited: 'text-yellow-400',
  out_of_stock: 'text-worse',
};

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <span className="inline-flex gap-0.5 text-xs text-accent" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: fullStars }, (_, i) => (
        <span key={`f-${i}`}>&#9733;</span>
      ))}
      {hasHalf && <span>&#9734;</span>}
      {Array.from({ length: emptyStars }, (_, i) => (
        <span key={`e-${i}`} className="text-text-muted">&#9734;</span>
      ))}
    </span>
  );
}

export function ProductCard({ product, isSelected, isDisabled, disabledReason, onToggle }: ProductCardProps) {
  const disabledLabel = disabledReason === 'different category'
    ? ', different category — clear selection to compare this type'
    : disabledReason === 'comparison full'
      ? ', comparison full'
      : '';

  return (
    <button
      disabled={isDisabled}
      onClick={() => onToggle(product)}
      role="listitem"
      aria-pressed={isSelected}
      aria-label={`${product.brand} ${product.name}, ${product.price.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}, ${AVAILABILITY_LABELS[product.availability]}${isSelected ? ', selected' : ''}${disabledLabel}`}
      className={`product-card-enter group relative border p-4 text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background ${
        isSelected
          ? 'border-accent bg-[rgba(200,255,0,0.06)]'
          : isDisabled
            ? 'cursor-not-allowed border-border bg-surface opacity-40'
            : 'border-border bg-surface hover:-translate-y-0.5 hover:border-accent'
      }`}
    >
      {isSelected && (
        <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center bg-accent text-xs font-bold text-background" aria-hidden="true">
          &#10003;
        </div>
      )}
      <div className="flex items-start gap-3">
        <span className="text-3xl" role="img" aria-label={product.category}>{product.image}</span>
        <div className="min-w-0 flex-1">
          <p className="font-serif text-base leading-tight text-text">
            {product.name}
          </p>
          <p className="font-mono text-xs text-text-muted">
            {product.brand}
          </p>
          <p className="mt-1 font-mono text-sm font-semibold text-accent">
            {product.price.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <RatingStars rating={product.rating} />
            <span className="font-mono text-xs text-text-muted">
              ({product.reviewCount})
            </span>
          </div>
          <span className={`mt-1 inline-block font-mono text-xs ${AVAILABILITY_CLASSES[product.availability]}`}>
            {AVAILABILITY_LABELS[product.availability]}
          </span>
        </div>
      </div>
    </button>
  );
}

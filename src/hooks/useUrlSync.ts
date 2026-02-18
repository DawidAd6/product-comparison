import { useEffect } from 'react';
import { useComparisonStore } from '../store/useComparisonStore';

/** Syncs selected product IDs to/from URL search params (?compare=id1,id2,id3) */
export function useUrlSync(): void {
  const { selectedProducts, allProducts, addProduct } = useComparisonStore();

  // On mount: parse URL and preselect products
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const compareParam = params.get('compare');
    if (!compareParam) return;

    const ids = compareParam.split(',').filter(Boolean);
    for (const id of ids) {
      const product = allProducts.find((p) => p.id === id);
      if (product) {
        addProduct(product);
      }
    }
    // Run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On selection change: update URL
  useEffect(() => {
    const ids = selectedProducts.map((p) => p.id);
    const url = new URL(window.location.href);

    if (ids.length > 0) {
      url.searchParams.set('compare', ids.join(','));
    } else {
      url.searchParams.delete('compare');
    }

    window.history.replaceState({}, '', url.toString());
  }, [selectedProducts]);
}

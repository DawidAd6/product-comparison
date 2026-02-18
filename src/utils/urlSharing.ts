import type { Product } from '../types';

/**
 * Encodes an array of products into a comma-separated string of their IDs.
 */
export function encodeProducts(products: Product[]): string {
  return products.map((p) => p.id).join(',');
}

/**
 * Decodes a comma-separated string of IDs back into products.
 * Invalid or unknown IDs are silently skipped.
 */
export function decodeProducts(
  encoded: string,
  allProducts: Product[],
): Product[] {
  if (!encoded || encoded.trim() === '') return [];

  const ids = encoded.split(',').map((id) => id.trim());
  const result: Product[] = [];

  for (const id of ids) {
    const product = allProducts.find((p) => p.id === id);
    if (product) {
      result.push(product);
    }
  }

  return result;
}

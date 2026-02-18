import { describe, it, expect } from 'vitest';
import { encodeProducts, decodeProducts } from '../utils/urlSharing';
import type { Product } from '../types';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'default-id',
    name: 'Default',
    brand: 'Brand',
    category: 'smartphone',
    price: 1000,
    image: 'img',
    rating: 4.0,
    reviewCount: 50,
    availability: 'in_stock',
    specs: { ram: 8 },
    ...overrides,
  };
}

const allProducts: Product[] = [
  makeProduct({ id: 'samsung-s24-ultra', name: 'Galaxy S24 Ultra' }),
  makeProduct({ id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max' }),
  makeProduct({ id: 'pixel-8-pro', name: 'Pixel 8 Pro' }),
  makeProduct({ id: 'xiaomi-14-ultra', name: '14 Ultra' }),
];

describe('encodeProducts', () => {
  it('should encode two products into comma-separated IDs', () => {
    const selected = [allProducts[0]!, allProducts[1]!];
    const encoded = encodeProducts(selected);
    expect(encoded).toBe('samsung-s24-ultra,iphone-15-pro-max');
  });

  it('should encode a single product', () => {
    const encoded = encodeProducts([allProducts[0]!]);
    expect(encoded).toBe('samsung-s24-ultra');
  });

  it('should encode three products', () => {
    const selected = [allProducts[0]!, allProducts[1]!, allProducts[2]!];
    const encoded = encodeProducts(selected);
    expect(encoded).toBe(
      'samsung-s24-ultra,iphone-15-pro-max,pixel-8-pro',
    );
  });

  it('should return an empty string for no products', () => {
    expect(encodeProducts([])).toBe('');
  });
});

describe('decodeProducts', () => {
  it('should decode comma-separated IDs into products', () => {
    const decoded = decodeProducts(
      'samsung-s24-ultra,iphone-15-pro-max',
      allProducts,
    );
    expect(decoded).toHaveLength(2);
    expect(decoded[0]!.id).toBe('samsung-s24-ultra');
    expect(decoded[1]!.id).toBe('iphone-15-pro-max');
  });

  it('should decode a single ID', () => {
    const decoded = decodeProducts('pixel-8-pro', allProducts);
    expect(decoded).toHaveLength(1);
    expect(decoded[0]!.id).toBe('pixel-8-pro');
  });

  it('should handle invalid IDs gracefully by skipping them', () => {
    const decoded = decodeProducts(
      'samsung-s24-ultra,non-existent-id,pixel-8-pro',
      allProducts,
    );
    expect(decoded).toHaveLength(2);
    expect(decoded[0]!.id).toBe('samsung-s24-ultra');
    expect(decoded[1]!.id).toBe('pixel-8-pro');
  });

  it('should return empty array for all invalid IDs', () => {
    const decoded = decodeProducts('fake-1,fake-2,fake-3', allProducts);
    expect(decoded).toHaveLength(0);
  });

  it('should return empty array for empty string', () => {
    expect(decodeProducts('', allProducts)).toHaveLength(0);
  });

  it('should return empty array for whitespace-only string', () => {
    expect(decodeProducts('   ', allProducts)).toHaveLength(0);
  });

  it('should handle IDs with extra whitespace', () => {
    const decoded = decodeProducts(
      ' samsung-s24-ultra , pixel-8-pro ',
      allProducts,
    );
    expect(decoded).toHaveLength(2);
  });
});

describe('encode/decode roundtrip', () => {
  it('should roundtrip encode then decode', () => {
    const selected = [allProducts[0]!, allProducts[2]!];
    const encoded = encodeProducts(selected);
    const decoded = decodeProducts(encoded, allProducts);

    expect(decoded).toHaveLength(2);
    expect(decoded[0]!.id).toBe(selected[0]!.id);
    expect(decoded[1]!.id).toBe(selected[1]!.id);
  });
});

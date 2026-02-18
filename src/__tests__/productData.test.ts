import { describe, it, expect } from 'vitest';
import { products } from '../data/products';
import { getSpecDefinitions } from '../data/specDefinitions';

describe('Product Data Integrity', () => {
  it('should have products across all categories', () => {
    const categories = new Set(products.map((p) => p.category));
    expect(categories.has('smartphone')).toBe(true);
    expect(categories.has('laptop')).toBe(true);
    expect(categories.has('monitor')).toBe(true);
  });

  it('should have all required fields on every product', () => {
    const requiredKeys = [
      'id',
      'name',
      'brand',
      'price',
      'rating',
      'specs',
    ] as const;

    for (const product of products) {
      for (const key of requiredKeys) {
        expect(product).toHaveProperty(key);
        expect(product[key]).toBeDefined();
      }
    }
  });

  it('should have unique product IDs', () => {
    const ids = products.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have positive prices on all products', () => {
    for (const product of products) {
      expect(product.price).toBeGreaterThan(0);
      expect(typeof product.price).toBe('number');
    }
  });

  it('should have ratings between 1 and 5', () => {
    for (const product of products) {
      expect(product.rating).toBeGreaterThanOrEqual(1);
      expect(product.rating).toBeLessThanOrEqual(5);
    }
  });

  it('should have consistent spec keys within the same category', () => {
    const byCategory = new Map<string, typeof products>();
    for (const product of products) {
      const list = byCategory.get(product.category) ?? [];
      list.push(product);
      byCategory.set(product.category, list);
    }

    for (const [, categoryProducts] of byCategory) {
      const referenceKeys = Object.keys(categoryProducts[0]!.specs).sort();
      for (const product of categoryProducts) {
        const productKeys = Object.keys(product.specs).sort();
        expect(productKeys).toEqual(referenceKeys);
      }
    }
  });

  it('should have spec keys that match specDefinitions per category', () => {
    const smartphones = products.filter((p) => p.category === 'smartphone');
    const specDefs = getSpecDefinitions(smartphones);
    const definedKeys = specDefs.map((sd) => sd.key).sort();
    const productSpecKeys = Object.keys(smartphones[0]!.specs).sort();

    expect(productSpecKeys).toEqual(definedKeys);
  });

  it('should have valid category values', () => {
    const validCategories = ['smartphone', 'laptop', 'monitor'];
    for (const product of products) {
      expect(validCategories).toContain(product.category);
    }
  });

  it('should have valid availability values', () => {
    const validAvailability = ['in_stock', 'limited', 'out_of_stock'];
    for (const product of products) {
      expect(validAvailability).toContain(product.availability);
    }
  });

  it('should have non-negative review counts', () => {
    for (const product of products) {
      expect(product.reviewCount).toBeGreaterThanOrEqual(0);
    }
  });
});

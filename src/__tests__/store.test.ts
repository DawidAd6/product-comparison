import { describe, it, expect, beforeEach } from 'vitest';
import { useComparisonStore } from '../store/useComparisonStore';
import type { Product } from '../types';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: `test-${Math.random().toString(36).slice(2, 8)}`,
    name: 'Test Product',
    brand: 'TestBrand',
    category: 'smartphone',
    price: 1000,
    image: 'img',
    rating: 4.0,
    reviewCount: 100,
    availability: 'in_stock',
    specs: { ram: 8, storage: 128 },
    ...overrides,
  };
}

describe('useComparisonStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useComparisonStore.setState({
      selectedProducts: [],
      categoryFilter: null,
      searchQuery: '',
    });
  });

  describe('addProduct', () => {
    it('should add a product to selectedProducts', () => {
      const product = makeProduct({ id: 'p1' });
      useComparisonStore.getState().addProduct(product);

      const { selectedProducts } = useComparisonStore.getState();
      expect(selectedProducts).toHaveLength(1);
      expect(selectedProducts[0]!.id).toBe('p1');
    });

    it('should allow adding up to 3 products', () => {
      const p1 = makeProduct({ id: 'p1' });
      const p2 = makeProduct({ id: 'p2' });
      const p3 = makeProduct({ id: 'p3' });

      const { addProduct } = useComparisonStore.getState();
      addProduct(p1);
      addProduct(p2);
      addProduct(p3);

      expect(useComparisonStore.getState().selectedProducts).toHaveLength(3);
    });

    it('should enforce max 3 limit — 4th product is not added', () => {
      const p1 = makeProduct({ id: 'p1' });
      const p2 = makeProduct({ id: 'p2' });
      const p3 = makeProduct({ id: 'p3' });
      const p4 = makeProduct({ id: 'p4' });

      const store = useComparisonStore.getState();
      store.addProduct(p1);
      store.addProduct(p2);
      store.addProduct(p3);
      // Refresh reference after state changes
      useComparisonStore.getState().addProduct(p4);

      const { selectedProducts } = useComparisonStore.getState();
      expect(selectedProducts).toHaveLength(3);
      expect(selectedProducts.map((p) => p.id)).not.toContain('p4');
    });

    it('should not add a duplicate product', () => {
      const product = makeProduct({ id: 'dup' });
      useComparisonStore.getState().addProduct(product);
      useComparisonStore.getState().addProduct(product);

      expect(useComparisonStore.getState().selectedProducts).toHaveLength(1);
    });
  });

  describe('removeProduct', () => {
    it('should remove the correct product by id', () => {
      const p1 = makeProduct({ id: 'p1' });
      const p2 = makeProduct({ id: 'p2' });
      useComparisonStore.getState().addProduct(p1);
      useComparisonStore.getState().addProduct(p2);

      useComparisonStore.getState().removeProduct('p1');

      const { selectedProducts } = useComparisonStore.getState();
      expect(selectedProducts).toHaveLength(1);
      expect(selectedProducts[0]!.id).toBe('p2');
    });

    it('should do nothing when removing a non-existent id', () => {
      const p1 = makeProduct({ id: 'p1' });
      useComparisonStore.getState().addProduct(p1);

      useComparisonStore.getState().removeProduct('non-existent');

      expect(useComparisonStore.getState().selectedProducts).toHaveLength(1);
    });
  });

  describe('clearAll', () => {
    it('should empty selectedProducts and reset filters', () => {
      const p1 = makeProduct({ id: 'p1' });
      useComparisonStore.getState().addProduct(p1);
      useComparisonStore.getState().setFilter('laptop');
      useComparisonStore.getState().setSearch('test');

      useComparisonStore.getState().clearAll();

      const state = useComparisonStore.getState();
      expect(state.selectedProducts).toHaveLength(0);
      expect(state.categoryFilter).toBeNull();
      expect(state.searchQuery).toBe('');
    });
  });

  describe('setFilter', () => {
    it('should update categoryFilter', () => {
      useComparisonStore.getState().setFilter('laptop');
      expect(useComparisonStore.getState().categoryFilter).toBe('laptop');
    });

    it('should allow setting filter to null', () => {
      useComparisonStore.getState().setFilter('laptop');
      useComparisonStore.getState().setFilter(null);
      expect(useComparisonStore.getState().categoryFilter).toBeNull();
    });
  });

  describe('setSearch', () => {
    it('should update searchQuery', () => {
      useComparisonStore.getState().setSearch('galaxy');
      expect(useComparisonStore.getState().searchQuery).toBe('galaxy');
    });

    it('should allow setting search to empty string', () => {
      useComparisonStore.getState().setSearch('galaxy');
      useComparisonStore.getState().setSearch('');
      expect(useComparisonStore.getState().searchQuery).toBe('');
    });
  });
});

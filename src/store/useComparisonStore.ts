import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ComparisonStore, Product, ProductCategory } from '../types';
import { MAX_PRODUCTS } from '../types';
import { products } from '../data/products';

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set) => ({
      selectedProducts: [],
      allProducts: products,
      categoryFilter: null,
      searchQuery: '',

      addProduct: (product: Product) =>
        set((state) => {
          if (state.selectedProducts.length >= MAX_PRODUCTS) return state;
          if (state.selectedProducts.some((p) => p.id === product.id)) return state;
          if (state.selectedProducts.length > 0 && state.selectedProducts[0]!.category !== product.category) return state;
          return { selectedProducts: [...state.selectedProducts, product] };
        }),

      removeProduct: (productId: string) =>
        set((state) => ({
          selectedProducts: state.selectedProducts.filter((p) => p.id !== productId),
        })),

      setFilter: (category: ProductCategory | null) =>
        set({ categoryFilter: category }),

      setSearch: (query: string) =>
        set({ searchQuery: query }),

      clearAll: () =>
        set({ selectedProducts: [], categoryFilter: null, searchQuery: '' }),
    }),
    {
      name: 'product-comparison',
      partialize: (state) => ({ selectedProducts: state.selectedProducts }),
    },
  ),
);

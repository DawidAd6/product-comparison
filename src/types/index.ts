/** Value types for product specifications */
export type SpecValue = string | number | boolean;

/** Product category enum */
export type ProductCategory = 'smartphone' | 'laptop' | 'monitor';

/** Product availability status */
export type Availability = 'in_stock' | 'limited' | 'out_of_stock';

/** A single product with full metadata and specs */
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number; // PLN
  image: string; // emoji or placeholder URL
  rating: number; // 1-5
  reviewCount: number;
  availability: Availability;
  specs: Record<string, SpecValue>;
}

/** Spec data type for rendering and comparison logic */
export type SpecType = 'string' | 'number' | 'boolean';

/** Definition of a single specification key — drives table rendering and comparison highlights */
export interface SpecDefinition {
  key: string;
  label: string;
  unit?: string;
  type: SpecType;
  /** For numeric values: true means a higher value wins the comparison highlight */
  higherIsBetter?: boolean;
  /** Group label for collapsible sections in the comparison table */
  group?: string;
}

/** Maximum number of products allowed in a comparison */
export const MAX_PRODUCTS = 3;

/** Core comparison state shape */
export interface ComparisonState {
  selectedProducts: Product[];
  allProducts: Product[];
  categoryFilter: ProductCategory | null;
  searchQuery: string;
}

/** Actions exposed by the comparison store */
export interface ComparisonActions {
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  setFilter: (category: ProductCategory | null) => void;
  setSearch: (query: string) => void;
  clearAll: () => void;
}

/** Full store type = state + actions */
export type ComparisonStore = ComparisonState & ComparisonActions;

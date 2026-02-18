import type { ProductCategory, SpecDefinition } from '../types';

const smartphoneSpecs: SpecDefinition[] = [
  { key: 'display_size', label: 'Display Size', unit: '"', type: 'number', group: 'Display' },
  { key: 'display_resolution', label: 'Resolution', type: 'string', group: 'Display' },
  { key: 'display_refresh_rate', label: 'Refresh Rate', unit: 'Hz', type: 'number', higherIsBetter: true, group: 'Display' },
  { key: 'processor', label: 'Processor', type: 'string', group: 'Performance' },
  { key: 'ram', label: 'RAM', unit: 'GB', type: 'number', higherIsBetter: true, group: 'Performance' },
  { key: 'storage', label: 'Storage', unit: 'GB', type: 'number', higherIsBetter: true, group: 'Performance' },
  { key: 'camera_main', label: 'Main Camera', unit: 'MP', type: 'number', higherIsBetter: true, group: 'Camera' },
  { key: 'camera_ultrawide', label: 'Ultrawide', unit: 'MP', type: 'number', higherIsBetter: true, group: 'Camera' },
  { key: 'battery', label: 'Battery', unit: 'mAh', type: 'number', higherIsBetter: true, group: 'Battery' },
  { key: 'weight', label: 'Weight', unit: 'g', type: 'number', higherIsBetter: false, group: 'Physical' },
  { key: 'water_resistance', label: 'Water Resistance', type: 'string', group: 'Physical' },
  { key: 'five_g', label: '5G Support', type: 'boolean', group: 'Physical' },
];

const laptopSpecs: SpecDefinition[] = [
  { key: 'display_size', label: 'Display Size', unit: '"', type: 'number', group: 'Display' },
  { key: 'display_resolution', label: 'Resolution', type: 'string', group: 'Display' },
  { key: 'display_refresh_rate', label: 'Refresh Rate', unit: 'Hz', type: 'number', higherIsBetter: true, group: 'Display' },
  { key: 'processor', label: 'Processor', type: 'string', group: 'Performance' },
  { key: 'ram', label: 'RAM', unit: 'GB', type: 'number', higherIsBetter: true, group: 'Performance' },
  { key: 'storage', label: 'Storage', unit: 'GB', type: 'number', higherIsBetter: true, group: 'Performance' },
  { key: 'gpu', label: 'GPU', type: 'string', group: 'Performance' },
  { key: 'ports', label: 'Ports', type: 'string', group: 'Connectivity' },
  { key: 'wifi', label: 'Wi-Fi', type: 'string', group: 'Connectivity' },
  { key: 'battery', label: 'Battery', unit: 'Wh', type: 'number', higherIsBetter: true, group: 'Battery' },
  { key: 'weight', label: 'Weight', unit: 'g', type: 'number', higherIsBetter: false, group: 'Physical' },
];

const monitorSpecs: SpecDefinition[] = [
  { key: 'display_size', label: 'Display Size', unit: '"', type: 'number', group: 'Display' },
  { key: 'display_resolution', label: 'Resolution', type: 'string', group: 'Display' },
  { key: 'display_refresh_rate', label: 'Refresh Rate', unit: 'Hz', type: 'number', higherIsBetter: true, group: 'Display' },
  { key: 'panel_type', label: 'Panel Type', type: 'string', group: 'Image Quality' },
  { key: 'response_time', label: 'Response Time', unit: 'ms', type: 'number', higherIsBetter: false, group: 'Image Quality' },
  { key: 'brightness', label: 'Brightness', unit: 'nits', type: 'number', higherIsBetter: true, group: 'Image Quality' },
  { key: 'color_gamut', label: 'Color Gamut', type: 'string', group: 'Image Quality' },
  { key: 'hdr', label: 'HDR Support', type: 'boolean', group: 'Image Quality' },
  { key: 'ports_display', label: 'Ports', type: 'string', group: 'Connectivity' },
  { key: 'adjustable_stand', label: 'Adjustable Stand', type: 'boolean', group: 'Physical' },
  { key: 'weight', label: 'Weight', unit: 'g', type: 'number', higherIsBetter: false, group: 'Physical' },
];

const specsByCategory: Record<ProductCategory, SpecDefinition[]> = {
  smartphone: smartphoneSpecs,
  laptop: laptopSpecs,
  monitor: monitorSpecs,
};

export function getSpecDefinitions(products: { category: ProductCategory; specs: Record<string, unknown> }[]): SpecDefinition[] {
  if (products.length === 0) return [];
  const categories = new Set(products.map((p) => p.category));
  if (categories.size === 1) return specsByCategory[[...categories][0]!];

  const allKeys = new Set<string>();
  for (const p of products) Object.keys(p.specs).forEach((k) => allKeys.add(k));

  const seen = new Set<string>();
  const result: SpecDefinition[] = [];
  for (const defs of Object.values(specsByCategory)) {
    for (const def of defs) {
      if (allKeys.has(def.key) && !seen.has(def.key)) {
        seen.add(def.key);
        result.push(def);
      }
    }
  }
  return result;
}

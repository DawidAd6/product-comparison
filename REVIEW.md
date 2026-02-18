# Accessibility & UX Review

## Review Summary

Reviewed all component files in `src/components/`, `src/App.tsx`, `src/index.css`, and `index.html` against WCAG 2.1 AA standards and UX best practices.

## Issues Found and Fixes Applied

### Critical Accessibility Fixes

1. **Skip-to-main-content link missing** (`index.html`)
   - Added a visually hidden skip link that becomes visible on focus, targeting `#main-content`.

2. **No `<main>` landmark** (`App.tsx`)
   - Wrapped core content in `<main id="main-content">` for proper landmark navigation.

3. **No `aria-live` region for dynamic updates** (`App.tsx`)
   - Added `aria-live="polite"` region that announces product selection changes to screen readers.

4. **Table headers missing `scope` attributes** (`ComparisonTable.tsx`, `SpecRow.tsx`)
   - Added `scope="col"` to column headers in `<thead>`.
   - Changed spec label `<td>` to `<th scope="row">` in `SpecRow.tsx` for proper table semantics.

5. **Color-only difference indicators** (`SpecRow.tsx`)
   - Best/worst values now include arrow icons (up/down arrows) in addition to green/red color.
   - Added `sr-only` text "(best)" and "(worst)" for screen readers.
   - Cleaned up dead code block (empty span with empty string content on lines 98-101).

6. **Missing focus indicators** (all interactive components)
   - Added `focus:outline-none focus:ring-2 focus:ring-accent` to all buttons:
     - ComparisonRail remove buttons and "Clear all" button.
     - ProductCard buttons with offset ring.
     - ProductSelector category filter buttons.
     - Search input focus ring.

7. **Missing `role="img"` and `aria-label` on emoji images** (ComparisonRail, ProductCard, ComparisonTable)
   - All product emoji images now have `role="img"` with `aria-label` set to the product category.

8. **No ARIA labels on interactive groups** (ProductSelector)
   - Search input: `aria-label="Search products by name or brand"`, changed `type` to `"search"`.
   - Category filter group: `role="group" aria-label="Filter by category"`.
   - Filter buttons: Added `aria-pressed` to indicate active state.
   - Product grid: `role="list"` with `aria-label="Product catalog"`.

9. **ProductCard missing keyboard context** (ProductCard.tsx)
   - Added `aria-pressed` to indicate selection state.
   - Added comprehensive `aria-label` with product name, price, availability, and selection state.

10. **Comparison full state not communicated** (ProductSelector.tsx)
    - Added visible status message when max products reached: "Maximum of 3 products selected."
    - Uses `role="status"` for screen reader announcement.

11. **ComparisonRail missing screen reader context** (ComparisonRail.tsx)
    - Added `aria-label="Product comparison bar"` on the header.
    - Added `sr-only` text announcing count: "X of 3 products selected for comparison".
    - Empty slot placeholders marked `aria-hidden="true"`.
    - Remove button SVG marked `aria-hidden="true"` (label is on the button).

### UX Fixes

12. **Price formatting** (ComparisonRail, ProductCard, ComparisonTable)
    - Changed from `toLocaleString('pl-PL') + ' PLN'` to `toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })` for proper Polish currency formatting with "zl" symbol.

13. **Decorative SVG in EmptyState** (EmptyState.tsx)
    - Added `aria-hidden="true"` and `focusable="false"` to prevent screen reader announcement.

14. **LoadingSkeleton accessibility** (LoadingSkeleton.tsx)
    - Added `role="status"` and `aria-label="Loading products"` to announce loading state.

### CSS / Motion / Contrast Fixes

15. **`prefers-reduced-motion` not respected** (`index.css`)
    - Added media query that disables all animations and transitions when user prefers reduced motion.
    - Also disables smooth scrolling.

16. **`prefers-contrast: high` not handled** (`index.css`)
    - Added media query that increases border visibility, muted text contrast, and diff background opacity.

17. **ComparisonTable mobile layout** (ComparisonTable.tsx)
    - Mobile cards now use `<article>` element with `aria-label` for proper semantics.

## Checklist Status

### Accessibility
- [x] All interactive elements have ARIA labels
- [x] Table uses proper `<table>`, `<thead>`, `<tbody>`, `<th scope="col/row">` semantics
- [x] `aria-live` on dynamic regions (product count, comparison updates)
- [x] Keyboard navigation: focus rings on all controls
- [x] Focus indicators visible (accent/lime ring)
- [x] Screen reader: product names announced when added/removed
- [x] Color is not the only indicator of difference (arrows + text)
- [x] Images have `role="img"` with `aria-label`
- [x] Skip-to-main-content link

### UX
- [x] Empty state is friendly and instructional
- [x] Max 3 products enforced with clear user feedback (status message)
- [x] Removing a product is easy (X button with focus ring)
- [x] Differences are immediately obvious (accent highlight + arrows)
- [x] Price formatted with Polish locale currency
- [x] Availability shown clearly (colored badge with text)
- [x] Mobile layout works (stacked cards below 768px)
- [x] Loading skeleton has proper status role

### High Contrast
- [x] `prefers-contrast: high` handled
- [x] `prefers-reduced-motion` respected

## Remaining Concerns

1. **Contrast ratios**: The `text-text-muted` color (`#666666`) on `background` (`#0a0a0a`) has a contrast ratio of approximately 4.2:1, which passes WCAG AA for large text but falls just short of the 4.5:1 requirement for normal text. The `prefers-contrast: high` media query raises this to `#aaaaaa` (~9.3:1). Consider bumping the default muted color to `#737373` (~4.95:1) for full AA compliance without relying on the high-contrast media query.

2. **Focus trap on mobile overflow**: The comparison rail uses `overflow-x-auto` which may cause focus to move off-screen on narrow viewports. Consider adding scroll-into-view behavior when a product is focused.

3. **No `aria-describedby` on disabled product cards**: When comparison is full, disabled cards could benefit from an `aria-describedby` pointing to the "maximum products" status message.

4. **The `useUrlSync` hook**: Uses `addProduct` in a loop on mount without batching, which may trigger multiple re-renders. This is a performance concern rather than an accessibility issue.

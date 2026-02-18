import type { Product, SpecDefinition, SpecValue } from '../types';

interface SpecRowProps {
  spec: SpecDefinition;
  products: Product[];
  index: number;
}

function formatValue(value: SpecValue | undefined, unit?: string): string {
  if (value === undefined) return '--';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (unit) return `${value} ${unit}`;
  return String(value);
}

function getHighlights(
  values: (SpecValue | undefined)[],
  higherIsBetter?: boolean,
): { best: Set<number>; worst: Set<number> } {
  const best = new Set<number>();
  const worst = new Set<number>();

  if (higherIsBetter === undefined) return { best, worst };

  const numericValues = values.map((v) =>
    typeof v === 'number' ? v : null,
  );

  const validNumbers = numericValues.filter((n): n is number => n !== null);
  if (validNumbers.length < 2) return { best, worst };

  const maxVal = Math.max(...validNumbers);
  const minVal = Math.min(...validNumbers);

  if (maxVal === minVal) return { best, worst };

  numericValues.forEach((v, i) => {
    if (v === null) return;
    if (higherIsBetter) {
      if (v === maxVal) best.add(i);
      if (v === minVal) worst.add(i);
    } else {
      if (v === minVal) best.add(i);
      if (v === maxVal) worst.add(i);
    }
  });

  return { best, worst };
}

export function SpecRow({ spec, products, index }: SpecRowProps) {
  const values = products.map((p) => p.specs[spec.key]);
  const { best, worst } = getHighlights(values, spec.higherIsBetter);

  const allSame =
    values.length > 1 && values.every((v) => v === values[0]);
  const hasDiff = values.length > 1 && !allSame;
  const isEvenRow = index % 2 === 0;

  return (
    <tr
      className={`spec-row-enter border-b border-border/50 ${
        hasDiff ? 'border-l-2 border-l-accent' : ''
      } ${isEvenRow ? 'bg-[#0f0f0f]' : 'bg-surface'} ${
        hasDiff ? '!bg-[rgba(200,255,0,0.04)]' : ''
      }`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <th scope="row" className="sticky left-0 z-10 w-48 py-3 pl-4 text-left font-mono text-xs font-normal uppercase tracking-wider text-text-muted [background:inherit]">
        {spec.label}
      </th>
      {values.map((value, colIndex) => {
        const isBest = best.has(colIndex);
        const isWorst = worst.has(colIndex);
        // For string/boolean diffs without higherIsBetter, highlight differing values
        const isNonNumericDiff =
          hasDiff &&
          spec.higherIsBetter === undefined &&
          value !== undefined &&
          values.filter((v) => v === value).length < values.length;

        return (
          <td
            key={`${products[colIndex]?.id}-${isBest ? 'b' : isWorst ? 'w' : 'n'}`}
            className={`px-4 py-3 text-center font-mono text-sm ${
              isBest
                ? 'cell-best-flash font-semibold text-better'
                : isWorst
                  ? 'cell-worst-flash text-worse'
                  : allSame
                    ? 'text-text-muted'
                    : 'text-text'
            } ${isNonNumericDiff ? 'bg-[rgba(200,255,0,0.12)]' : ''}`}
          >
            <span className="inline-flex items-center gap-1">
              {formatValue(value, spec.unit)}
              {isBest && spec.higherIsBetter !== undefined && (
                <>
                  <span className="text-xs text-better" aria-hidden="true">&#8593;</span>
                  <span className="sr-only">(best)</span>
                </>
              )}
              {isWorst && spec.higherIsBetter !== undefined && (
                <>
                  <span className="text-xs text-worse" aria-hidden="true">&#8595;</span>
                  <span className="sr-only">(worst)</span>
                </>
              )}
            </span>
          </td>
        );
      })}
    </tr>
  );
}

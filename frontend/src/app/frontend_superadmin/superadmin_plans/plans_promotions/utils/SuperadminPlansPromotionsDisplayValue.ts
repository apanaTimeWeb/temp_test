// RESPONSIBILITY: Normalize nullish or empty display values for plans promotions without mutating source data or inventing business values.
// FLOW: Feature table/cell -> superadmin_plans/plans_promotions/utils/SuperadminPlansPromotionsDisplayValue.ts -> display-value normalization -> rendered cell content.
import type { ReactNode } from 'react';

/** Renders nullable display fields with the design-system en-dash fallback. 
 * @param value - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function displayValue(value: ReactNode | null | undefined): ReactNode {
  return value === null || value === undefined || value === '' ? '—' : value;
}

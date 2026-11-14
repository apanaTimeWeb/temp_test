export interface SuperadminAccountingMonthlyEntry { month: string; income: number; expense: number; }
/**
 * Defines the public SuperadminAccountingCategoryEntry contract for accounting financial reports. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property category Value defined by the existing feature-local contract. Declared type: string.
 * @property amount Monetary or numeric value with units and currency semantics defined by the declared type. Declared type: number.
 * @property pct Value defined by the existing feature-local contract. Declared type: number.
 */
export interface SuperadminAccountingCategoryEntry { category: string; amount: number; pct: number; }
/**
 * Defines the public SuperadminAccountingPeriod contract for accounting financial reports. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminAccountingPeriod = 'monthly' | 'quarterly' | 'yearly';

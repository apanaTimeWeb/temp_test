// RESPONSIBILITY: Define canonical role/module type contracts for billing member payment promises.
// FLOW: Feature UI, fixtures and tests -> canonical type boundary -> compile-time contracts only; runtime input validation remains in schemas.
/** Public module-owned types; exported identifiers remain stable during filename consolidation. */

/** Props for the module-owned empty-state presentation. */
export interface SuperadminBillingOverviewMemberPaymentPromisesEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}

/** Promise sample item used by the local preview table; it is not a backend response schema. */
export interface SuperadminFinancePaymentPromiseSample {
  id: number;
  studentName: string;
  smartId: string;
  promisedAmount: number;
  expectedDate: string;
  daysUntilDue: number;
  timesChanged: number;
  status: 'pending' | 'fulfilled' | 'overdue';
  fulfilledDate?: string;
  /** Last local preview-only extension reason; never submitted to a server. */
  lastExtensionReason?: string;
}

/** Component alias retained for the payment promises table and orchestration state. */
export type PromiseItem = SuperadminFinancePaymentPromiseSample;

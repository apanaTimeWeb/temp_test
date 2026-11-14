// RESPONSIBILITY: Define compile-time types for accounting expenses; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_accounting/accounting_expenses/types/SuperadminAccountingExpensesEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminAccountingExpensesEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}

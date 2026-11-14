// RESPONSIBILITY: Define scenario metadata for accounting expenses; network/auth cases remain non-executable without verified host contracts.
// FLOW: Test harness -> superadmin_accounting/accounting_expenses/mocks/scenarios/SuperadminAccountingExpensesaccounting_expenses.MockScenarios.ts -> declared scenario state -> fixture-backed UI or explicitly deferred contract case.
/** UI-only test scenarios; these names do not imply backend endpoints. */
export const SUPERADMIN_ACCOUNTING_EXPENSES_SCENARIOS = [
  'loading',
  'empty',
  'error',
  'unavailable_mutation',
] as const;

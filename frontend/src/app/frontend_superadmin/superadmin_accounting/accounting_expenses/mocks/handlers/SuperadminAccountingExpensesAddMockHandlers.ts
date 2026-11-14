// RESPONSIBILITY: Define isolated mock handlers for accounting expenses; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_accounting/accounting_expenses/mocks/handlers/SuperadminAccountingExpensesAddMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for accounting_expenses_add; do not invent endpoints or write success. */
export const SUPERADMIN_ACCOUNTING_EXPENSES_ADD_MSW_HANDLERS: never[] = [];

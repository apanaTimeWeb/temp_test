// RESPONSIBILITY: Define isolated mock handlers for accounting expense categories; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_accounting/accounting_expense_categories/mocks/handlers/SuperadminAccountingExpenseCategoriesMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for accounting_expense_categories; do not invent endpoints or write success. */
export const SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES_MSW_HANDLERS: never[] = [];

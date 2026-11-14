// FLOW: Feature consumers -> superadmin_accounting/accounting_expenses/constants/SuperadminAccountingExpensesExpenseConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Accounting Expense Constants; centralizes stable module-owned options and configuration. */
import type { SuperadminAccountingPaymentMode } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/types/SuperadminAccountingExpensesExpenseTypes';
export const SUPERADMIN_ACCOUNTING_EXPENSE_MODE_BADGE: Record<SuperadminAccountingPaymentMode, string> = { cash: 'acct-badge acct-badge--cash', upi: 'acct-badge acct-badge--upi', card: 'acct-badge acct-badge--card', bank: 'acct-badge acct-badge--bank' };

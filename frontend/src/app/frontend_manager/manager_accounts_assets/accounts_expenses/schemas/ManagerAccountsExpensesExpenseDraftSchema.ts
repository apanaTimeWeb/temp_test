import { z } from 'zod';
import { MANAGER_ACCOUNTING_EXPENSE_CATEGORIES, MANAGER_ACCOUNTING_PAYMENT_MODES } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/constants/ManagerAccountsExpensesConstants';

/** Local draft validation only; not a backend request/response contract. */
export const managerAccountingExpenseDraftSchema = z.object({
  date: z.string().trim().min(1),
  category: z.enum(MANAGER_ACCOUNTING_EXPENSE_CATEGORIES),
  description: z.string().trim().min(1),
  amount: z.string().trim().min(1).refine((value) => Number.isFinite(Number(value)) && Number(value) > 0 && /^\d+(?:\.\d{1,2})?$/.test(value), 'enter_valid_amount'),
  paidBy: z.string().trim().min(1),
  mode: z.enum(MANAGER_ACCOUNTING_PAYMENT_MODES),
  notes: z.string().max(2000),
});

export type ManagerAccountsExpensesExpenseDraft = z.infer<typeof managerAccountingExpenseDraftSchema>;

export const managerAccountsExpensesAddExpenseModalSchema = z.object({
  category: z.string().trim().min(1, 'Expense category is required.'),
  description: z.string().trim().min(1, 'Expense description is required.'),
  amount: z.string().trim().min(1, 'Amount is required.').refine((val) => {
    const n = Number(val);
    return Number.isFinite(n) && n > 0;
  }, 'Valid positive expense amount is required.'),
  mode: z.enum(['cash', 'upi', 'card', 'bank']),
  paidBy: z.string().trim().default('Manager Counter'),
  voucherNo: z.string().trim().optional().default(''),
});

export type ManagerAccountsExpensesAddExpenseModalFormData = z.infer<typeof managerAccountsExpensesAddExpenseModalSchema>;

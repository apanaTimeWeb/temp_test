import { z } from 'zod';
import { MANAGER_ACCOUNTING_EXPENSE_CATEGORIES, MANAGER_ACCOUNTING_PAYMENT_MODES } from '@/app/frontend_manager/manager_accounts_assets/assets_register/constants/ManagerAssetsRegisterConstants';

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

export type ManagerAssetsRegisterExpenseDraft = z.infer<typeof managerAccountingExpenseDraftSchema>;

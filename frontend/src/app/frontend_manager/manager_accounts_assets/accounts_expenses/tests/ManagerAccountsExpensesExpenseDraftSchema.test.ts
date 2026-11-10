import { describe, expect, it } from 'vitest';
import {
  managerAccountingExpenseDraftSchema,
  managerAccountsExpensesAddExpenseModalSchema,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/schemas/ManagerAccountsExpensesExpenseDraftSchema';

const validDraft = { date: '2026-10-16', category: 'Electricity', description: 'Meter reading', amount: '1250.00', paidBy: 'Manager', mode: 'upi', notes: '' };

describe('managerAccountingExpenseDraftSchema', () => {
  it('accepts a locally valid draft without implying persistence', () => {
    expect(managerAccountingExpenseDraftSchema.safeParse(validDraft).success).toBe(true);
  });
  it('rejects missing required values and non-positive amounts', () => {
    expect(managerAccountingExpenseDraftSchema.safeParse({ ...validDraft, description: '' }).success).toBe(false);
    expect(managerAccountingExpenseDraftSchema.safeParse({ ...validDraft, amount: '0' }).success).toBe(false);
    expect(managerAccountingExpenseDraftSchema.safeParse({ ...validDraft, amount: 'not-a-number' }).success).toBe(false);
    expect(managerAccountingExpenseDraftSchema.safeParse({ ...validDraft, amount: '1.234' }).success).toBe(false);
    expect(managerAccountingExpenseDraftSchema.safeParse({ ...validDraft, amount: 'Infinity' }).success).toBe(false);
  });
  it('rejects values outside the module-owned options', () => {
    expect(managerAccountingExpenseDraftSchema.safeParse({ ...validDraft, mode: 'crypto' }).success).toBe(false);
  });
});

describe('managerAccountsExpensesAddExpenseModalSchema', () => {
  it('validates add expense modal form data successfully', () => {
    const validModalData = {
      category: 'Utilities',
      description: 'Broadband recharge',
      amount: '1499.00',
      mode: 'upi',
      paidBy: 'Desk Manager',
      voucherNo: 'V-9901',
    };
    expect(managerAccountsExpensesAddExpenseModalSchema.safeParse(validModalData).success).toBe(true);
  });

  it('rejects empty description or non-positive amount', () => {
    expect(managerAccountsExpensesAddExpenseModalSchema.safeParse({
      category: 'Utilities',
      description: '',
      amount: '500',
      mode: 'cash',
    }).success).toBe(false);

    expect(managerAccountsExpensesAddExpenseModalSchema.safeParse({
      category: 'Utilities',
      description: 'Cleaning',
      amount: '-50',
      mode: 'cash',
    }).success).toBe(false);
  });
});

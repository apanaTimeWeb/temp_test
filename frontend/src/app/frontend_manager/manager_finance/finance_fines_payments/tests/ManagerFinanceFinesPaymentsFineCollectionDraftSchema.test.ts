import { describe, expect, it } from 'vitest';
import { managerFinanceFineCollectionDraftSchema } from '@/app/frontend_manager/manager_finance/finance_fines_payments/schemas/ManagerFinanceFinesPaymentsFineCollectionDraftSchema';

const validDraft = { member: 'Sample member', fineId: 'Overdue Book', amount: '150', mode: 'upi', txnId: 'UPI-REF-1' };

describe('managerFinanceFineCollectionDraftSchema', () => {
  it('accepts a locally valid draft without performing a collection', () => {
    expect(managerFinanceFineCollectionDraftSchema.safeParse(validDraft).success).toBe(true);
  });
  it('requires a transaction reference for electronic payment modes using a locale key', () => {
    const result = managerFinanceFineCollectionDraftSchema.safeParse({ ...validDraft, txnId: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((issue) => issue.message === 'transaction_reference_required')).toBe(true);
  });
  it('rejects invalid amounts using a locale key', () => {
    const result = managerFinanceFineCollectionDraftSchema.safeParse({ ...validDraft, amount: '0' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((issue) => issue.message === 'enter_valid_amount')).toBe(true);
  });
});

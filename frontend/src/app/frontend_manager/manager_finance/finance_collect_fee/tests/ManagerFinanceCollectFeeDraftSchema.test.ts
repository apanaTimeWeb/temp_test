import { describe, expect, it } from 'vitest';
import { managerFinanceCollectFeeDraftSchema } from '@/app/frontend_manager/manager_finance/finance_collect_fee/schemas/ManagerFinanceCollectFeeDraftSchema';

const validDraft = { member: 'student-1', amount: '125.50', mode: 'cash' as const, txnId: '', couponCode: '', lateFee: '', monthsToRenew: '1' as const, remark: '' };

describe('managerFinanceCollectFeeDraftSchema', () => {
  it('accepts a valid preview draft without authorizing payment', () => {
    expect(managerFinanceCollectFeeDraftSchema.safeParse(validDraft).success).toBe(true);
  });
  it('rejects malformed, non-finite, and over-precision amounts', () => {
    for (const amount of ['', 'NaN', 'Infinity', '-1', '1.234', '1e3']) {
      expect(managerFinanceCollectFeeDraftSchema.safeParse({ ...validDraft, amount }).success).toBe(false);
    }
  });
  it('requires a transaction reference for non-cash modes', () => {
    expect(managerFinanceCollectFeeDraftSchema.safeParse({ ...validDraft, mode: 'upi' }).success).toBe(false);
    expect(managerFinanceCollectFeeDraftSchema.safeParse({ ...validDraft, mode: 'upi', txnId: 'txn-demo' }).success).toBe(true);
  });
});

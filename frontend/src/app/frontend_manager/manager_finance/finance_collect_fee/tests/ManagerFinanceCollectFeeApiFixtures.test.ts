import { describe, expect, it } from 'vitest';
import {
  MANAGER_FINANCE_API_PAYMENT_FIXTURES,
  MANAGER_FINANCE_EMPTY_PAYMENT_FIXTURE,
} from '@/app/frontend_manager/manager_finance/finance_collect_fee/mocks/manager_finance_collect_fee_fixtures/ManagerFinanceCollectFeeApiFixtures';
import { managerFinancePaymentResponseSchema } from '@/app/frontend_manager/manager_finance/finance_collect_fee/schemas/ManagerFinanceCollectFeeSchema';

describe('ManagerFinanceCollectFeeApiFixtures', () => {
  it('keeps payment fixtures schema-shaped and supports an empty collection', () => {
    expect(managerFinancePaymentResponseSchema.safeParse(MANAGER_FINANCE_API_PAYMENT_FIXTURES).success).toBe(true);
    expect(MANAGER_FINANCE_API_PAYMENT_FIXTURES).toHaveLength(4);
    expect(MANAGER_FINANCE_EMPTY_PAYMENT_FIXTURE).toEqual([]);
  });

  it('covers multiple payment statuses, modes, currencies, and zero amount', () => {
    expect(new Set(MANAGER_FINANCE_API_PAYMENT_FIXTURES.map((row) => row.status)).size).toBeGreaterThanOrEqual(3);
    expect(new Set(MANAGER_FINANCE_API_PAYMENT_FIXTURES.map((row) => row.mode)).size).toBeGreaterThanOrEqual(3);
    expect(new Set(MANAGER_FINANCE_API_PAYMENT_FIXTURES.map((row) => row.currency)).size).toBeGreaterThanOrEqual(2);
    expect(MANAGER_FINANCE_API_PAYMENT_FIXTURES.some((row) => row.amount === 0)).toBe(true);
  });

  it('uses unique synthetic identifiers and non-negative integer minor-unit amounts', () => {
    const rows = MANAGER_FINANCE_API_PAYMENT_FIXTURES;
    expect(new Set(rows.map((row) => String(row.id))).size).toBe(rows.length);
    for (const row of rows) {
      expect(Number.isInteger(row.amount)).toBe(true);
      expect(row.amount).toBeGreaterThanOrEqual(0);
    }
  });
});

import { describe, expect, it } from 'vitest';
import {
  MANAGER_FINANCE_API_PAYMENT_FIXTURES,
  MANAGER_FINANCE_API_REFUND_FIXTURES,
  MANAGER_FINANCE_EMPTY_PAYMENT_FIXTURE,
  MANAGER_FINANCE_EMPTY_REFUND_FIXTURE,
} from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/manager_finance_security_deposits_fixtures/ManagerFinanceSecurityDepositsApiFixtures';
import {
  managerFinancePaymentResponseSchema,
  managerFinanceRefundResponseSchema,
} from '@/app/frontend_manager/manager_finance/finance_security_deposits/schemas/ManagerFinanceSecurityDepositsSchema';

describe('ManagerFinanceSecurityDepositsApiFixtures', () => {
  it('keeps the expanded payment and refund fixtures schema-shaped', () => {
    expect(managerFinancePaymentResponseSchema.safeParse(MANAGER_FINANCE_API_PAYMENT_FIXTURES).success).toBe(true);
    expect(managerFinanceRefundResponseSchema.safeParse(MANAGER_FINANCE_API_REFUND_FIXTURES).success).toBe(true);
    expect(MANAGER_FINANCE_API_PAYMENT_FIXTURES).toHaveLength(4);
    expect(MANAGER_FINANCE_API_REFUND_FIXTURES).toHaveLength(4);
  });

  it('covers multiple payment statuses, modes, and currencies', () => {
    expect(new Set(MANAGER_FINANCE_API_PAYMENT_FIXTURES.map((row) => row.status)).size).toBeGreaterThanOrEqual(3);
    expect(new Set(MANAGER_FINANCE_API_PAYMENT_FIXTURES.map((row) => row.mode)).size).toBeGreaterThanOrEqual(3);
    expect(new Set(MANAGER_FINANCE_API_PAYMENT_FIXTURES.map((row) => row.currency)).size).toBeGreaterThanOrEqual(2);
    expect(MANAGER_FINANCE_API_PAYMENT_FIXTURES.some((row) => row.amount === 0)).toBe(true);
  });

  it('covers refund statuses and valid empty-list states', () => {
    expect(new Set(MANAGER_FINANCE_API_REFUND_FIXTURES.map((row) => row.status)).size).toBeGreaterThanOrEqual(3);
    expect(new Set(MANAGER_FINANCE_API_REFUND_FIXTURES.map((row) => row.currency)).size).toBeGreaterThanOrEqual(2);
    expect(MANAGER_FINANCE_EMPTY_PAYMENT_FIXTURE).toEqual([]);
    expect(MANAGER_FINANCE_EMPTY_REFUND_FIXTURE).toEqual([]);
  });

  it('uses unique synthetic identifiers and non-negative integer minor-unit amounts', () => {
    for (const rows of [MANAGER_FINANCE_API_PAYMENT_FIXTURES, MANAGER_FINANCE_API_REFUND_FIXTURES]) {
      expect(new Set(rows.map((row) => String(row.id))).size).toBe(rows.length);
      for (const row of rows) {
        expect(Number.isInteger(row.amount)).toBe(true);
        expect(row.amount).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

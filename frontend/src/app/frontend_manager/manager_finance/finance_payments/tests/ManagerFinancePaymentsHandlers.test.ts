import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { setupServer } from 'msw/node';
import { managerFinancePaymentResponseSchema } from '@/app/frontend_manager/manager_finance/finance_payments/schemas/ManagerFinancePaymentsSchema';
import { MANAGER_FINANCE_PAYMENTS_TEST_ONLY_PATH, managerPaymentsHandlers } from '@/app/frontend_manager/manager_finance/finance_payments/mocks/manager_finance_payments_handlers/ManagerFinancePaymentsHandlers';
import { fetchManagerFinancePayments, ManagerFinancePaymentsContractMissingError } from '@/app/frontend_manager/manager_finance/finance_payments/api/manager_finance_payments.api';
const server = setupServer(...managerPaymentsHandlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
describe('external backend contract remains blocked', () => {
  it('fails closed without issuing a backend request', async () => {
    await expect(fetchManagerFinancePayments()).rejects.toBeInstanceOf(ManagerFinancePaymentsContractMissingError);
    await expect(fetchManagerFinancePayments()).rejects.toMatchObject({ code: 'CONTRACT_MISSING' });
  });
});

describe('manager_payments isolated GET contract', () => {
  it('serves schema-valid payment rows and empty state only', async () => {
    const populated = await fetch(`http://localhost${MANAGER_FINANCE_PAYMENTS_TEST_ONLY_PATH}`);
    const empty = await fetch(`http://localhost${MANAGER_FINANCE_PAYMENTS_TEST_ONLY_PATH}?__testMode=empty`);
    expect(populated.ok).toBe(true);
    expect(managerFinancePaymentResponseSchema.parse(await populated.json())).toHaveLength(4);
    expect(managerFinancePaymentResponseSchema.parse(await empty.json())).toEqual([]);
    expect(managerPaymentsHandlers).toHaveLength(1);
  });
  it('exposes recoverable API errors and rejects invalid money values', async () => {
    const error = await fetch(`http://localhost${MANAGER_FINANCE_PAYMENTS_TEST_ONLY_PATH}?__testMode=error`);
    expect(error.status).toBe(503);
    const valid = { id: 'p1', date: '2026-10-14', studentName: 'Test', amount: 100, status: 'valid' };
    expect(managerFinancePaymentResponseSchema.safeParse([valid]).success).toBe(true);
    expect(managerFinancePaymentResponseSchema.safeParse([{ ...valid, amount: 12.5 }]).success).toBe(false);
    expect(managerFinancePaymentResponseSchema.safeParse([{ ...valid, amount: -1 }]).success).toBe(false);
  });
});

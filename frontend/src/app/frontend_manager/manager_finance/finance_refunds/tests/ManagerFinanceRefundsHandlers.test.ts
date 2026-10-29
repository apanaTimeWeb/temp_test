import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { setupServer } from 'msw/node';
import { managerFinanceRefundResponseSchema } from '@/app/frontend_manager/manager_finance/finance_refunds/schemas/ManagerFinanceRefundsSchema';
import { MANAGER_FINANCE_REFUNDS_TEST_ONLY_PATH, managerRefundsHandlers } from '@/app/frontend_manager/manager_finance/finance_refunds/mocks/manager_finance_refunds_handlers/ManagerFinanceRefundsHandlers';
import { fetchManagerFinanceRefunds, ManagerFinanceRefundsContractMissingError } from '@/app/frontend_manager/manager_finance/finance_refunds/api/manager_finance_refunds.api';
const server = setupServer(...managerRefundsHandlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
describe('external backend contract remains blocked', () => {
  it('fails closed without issuing a backend request', async () => {
    await expect(fetchManagerFinanceRefunds()).rejects.toBeInstanceOf(ManagerFinanceRefundsContractMissingError);
    await expect(fetchManagerFinanceRefunds()).rejects.toMatchObject({ code: 'CONTRACT_MISSING' });
  });
});

describe('manager_refunds isolated GET contract', () => {
  it('serves schema-valid refund rows and empty state only', async () => {
    const populated = await fetch(`http://localhost${MANAGER_FINANCE_REFUNDS_TEST_ONLY_PATH}`);
    const empty = await fetch(`http://localhost${MANAGER_FINANCE_REFUNDS_TEST_ONLY_PATH}?__testMode=empty`);
    expect(populated.ok).toBe(true);
    expect(managerFinanceRefundResponseSchema.parse(await populated.json())).toHaveLength(4);
    expect(managerFinanceRefundResponseSchema.parse(await empty.json())).toEqual([]);
    expect(managerRefundsHandlers).toHaveLength(1);
  });
  it('exposes recoverable API errors and rejects invalid money values', async () => {
    const error = await fetch(`http://localhost${MANAGER_FINANCE_REFUNDS_TEST_ONLY_PATH}?__testMode=error`);
    expect(error.status).toBe(503);
    const valid = { id: 'r1', name: 'Test', amount: 100, status: 'pending', date: '2026-10-14' };
    expect(managerFinanceRefundResponseSchema.safeParse([valid]).success).toBe(true);
    expect(managerFinanceRefundResponseSchema.safeParse([{ ...valid, amount: 1.5 }]).success).toBe(false);
    expect(managerFinanceRefundResponseSchema.safeParse([{ ...valid, amount: -1 }]).success).toBe(false);
  });
});

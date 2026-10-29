import { describe, expect, it } from 'vitest';
import * as api from '@/app/frontend_manager/manager_finance/finance_payment_promises/api/manager_finance_payment_promises.api';
import { MANAGERPAYMENTPROMISESPAYMENTPROMISES_CONTRACT_GAP_MOCK } from '@/app/frontend_manager/manager_finance/finance_payment_promises/mocks/ManagerFinancePaymentPromisesContractGapMock';

describe('manager_payment_promises fail-closed API contract', () => {
  it('does not make an undocumented network request and exposes a machine-readable gap', async () => {
    expect(MANAGERPAYMENTPROMISESPAYMENTPROMISES_CONTRACT_GAP_MOCK).toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    const calls = [
    api.fetchManagerPaymentPromisesPayments as (...args: never[]) => Promise<unknown>,
    api.fetchManagerPaymentPromisesRefunds as (...args: never[]) => Promise<unknown>,
    ];
    for (const call of calls) {
      await expect(call(...([] as never[]))).rejects.toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    }
  });
});

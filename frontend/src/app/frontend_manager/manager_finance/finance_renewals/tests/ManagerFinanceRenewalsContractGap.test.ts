import { describe, expect, it } from 'vitest';
import * as api from '@/app/frontend_manager/manager_finance/finance_renewals/api/manager_finance_renewals.api.ts';
import { MANAGERRENEWALSRENEWALS_CONTRACT_GAP_MOCK } from '@/app/frontend_manager/manager_finance/finance_renewals/mocks/ManagerFinanceRenewalsContractGapMock.ts';

describe('manager_renewals fail-closed API contract', () => {
  it('does not make an undocumented network request and exposes a machine-readable gap', async () => {
    expect(MANAGERRENEWALSRENEWALS_CONTRACT_GAP_MOCK).toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    const calls = [
    api.fetchManagerRenewalsPayments as (...args: never[]) => Promise<unknown>,
    api.fetchManagerRenewalsRefunds as (...args: never[]) => Promise<unknown>,
    ];
    for (const call of calls) {
      await expect(call(...([] as never[]))).rejects.toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    }
  });
});

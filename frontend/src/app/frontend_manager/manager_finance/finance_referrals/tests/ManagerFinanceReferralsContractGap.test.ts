import { describe, expect, it } from 'vitest';
import * as api from '@/app/frontend_manager/manager_finance/finance_referrals/api/manager_finance_referrals.api';
import { MANAGERREFERRALSREFERRALS_CONTRACT_GAP_MOCK } from '@/app/frontend_manager/manager_finance/finance_referrals/mocks/ManagerFinanceReferralsContractGapMock';

describe('manager_referrals fail-closed API contract', () => {
  it('does not make an undocumented network request and exposes a machine-readable gap', async () => {
    expect(MANAGERREFERRALSREFERRALS_CONTRACT_GAP_MOCK).toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    const calls = [
    api.fetchManagerReferralsPayments as (...args: never[]) => Promise<unknown>,
    api.fetchManagerReferralsRefunds as (...args: never[]) => Promise<unknown>,
    ];
    for (const call of calls) {
      await expect(call(...([] as never[]))).rejects.toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    }
  });
});

import { describe, expect, it } from 'vitest';
import * as api from '@/app/frontend_manager/manager_finance/finance_late_fees/api/manager_finance_late_fees.api.ts';
import { MANAGERLATEFEESLATEFEES_CONTRACT_GAP_MOCK } from '@/app/frontend_manager/manager_finance/finance_late_fees/mocks/ManagerFinanceLateFeesContractGapMock.ts';

describe('manager_late_fees fail-closed API contract', () => {
  it('does not make an undocumented network request and exposes a machine-readable gap', async () => {
    expect(MANAGERLATEFEESLATEFEES_CONTRACT_GAP_MOCK).toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    const calls = [
    api.fetchManagerLateFeesPayments as (...args: never[]) => Promise<unknown>,
    api.fetchManagerLateFeesRefunds as (...args: never[]) => Promise<unknown>,
    ];
    for (const call of calls) {
      await expect(call(...([] as never[]))).rejects.toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    }
  });
});

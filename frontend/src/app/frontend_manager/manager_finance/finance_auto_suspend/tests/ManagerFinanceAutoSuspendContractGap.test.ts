import { describe, expect, it } from 'vitest';
import * as api from '@/app/frontend_manager/manager_finance/finance_auto_suspend/api/manager_finance_auto_suspend.api';
import { MANAGERAUTOSUSPENDAUTOSUSPEND_CONTRACT_GAP_MOCK } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/mocks/ManagerFinanceAutoSuspendContractGapMock';

describe('manager_auto_suspend fail-closed API contract', () => {
  it('does not make an undocumented network request and exposes a machine-readable gap', async () => {
    expect(MANAGERAUTOSUSPENDAUTOSUSPEND_CONTRACT_GAP_MOCK).toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    const calls = [
    api.fetchManagerAutoSuspendPayments as (...args: never[]) => Promise<unknown>,
    api.fetchManagerAutoSuspendRefunds as (...args: never[]) => Promise<unknown>,
    ];
    for (const call of calls) {
      await expect(call(...([] as never[]))).rejects.toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    }
  });
});

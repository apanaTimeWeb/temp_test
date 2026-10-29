import { describe, expect, it } from 'vitest';
import * as api from '@/app/frontend_manager/manager_finance/finance_security_deposits/api/manager_finance_security_deposits.api.ts';
import { MANAGERSECURITYDEPOSITSSECURITYDEPOSITS_CONTRACT_GAP_MOCK } from '@/app/frontend_manager/manager_finance/finance_security_deposits/mocks/ManagerFinanceSecurityDepositsContractGapMock.ts';

describe('manager_security_deposits fail-closed API contract', () => {
  it('does not make an undocumented network request and exposes a machine-readable gap', async () => {
    expect(MANAGERSECURITYDEPOSITSSECURITYDEPOSITS_CONTRACT_GAP_MOCK).toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    const calls = [
    api.fetchManagerSecurityDepositsPayments as (...args: never[]) => Promise<unknown>,
    api.fetchManagerSecurityDepositsRefunds as (...args: never[]) => Promise<unknown>,
    ];
    for (const call of calls) {
      await expect(call(...([] as never[]))).rejects.toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    }
  });
});

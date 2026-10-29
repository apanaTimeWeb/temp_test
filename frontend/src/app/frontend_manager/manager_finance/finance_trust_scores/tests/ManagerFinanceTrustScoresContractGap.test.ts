import { describe, expect, it } from 'vitest';
import * as api from '@/app/frontend_manager/manager_finance/finance_trust_scores/api/manager_finance_trust_scores.api.ts';
import { MANAGERTRUSTSCORESTRUSTSCORES_CONTRACT_GAP_MOCK } from '@/app/frontend_manager/manager_finance/finance_trust_scores/mocks/ManagerFinanceTrustScoresContractGapMock.ts';

describe('manager_trust_scores fail-closed API contract', () => {
  it('does not make an undocumented network request and exposes a machine-readable gap', async () => {
    expect(MANAGERTRUSTSCORESTRUSTSCORES_CONTRACT_GAP_MOCK).toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    const calls = [
    api.fetchManagerTrustScoresPayments as (...args: never[]) => Promise<unknown>,
    api.fetchManagerTrustScoresRefunds as (...args: never[]) => Promise<unknown>,
    ];
    for (const call of calls) {
      await expect(call(...([] as never[]))).rejects.toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    }
  });
});

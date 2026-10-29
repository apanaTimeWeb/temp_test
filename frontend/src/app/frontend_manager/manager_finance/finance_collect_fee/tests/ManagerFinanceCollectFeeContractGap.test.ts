import { describe, expect, it } from 'vitest';
import * as api from '@/app/frontend_manager/manager_finance/finance_collect_fee/api/manager_finance_collect_fee.api.ts';
import { MANAGERCOLLECTFEECOLLECTFEE_CONTRACT_GAP_MOCK } from '@/app/frontend_manager/manager_finance/finance_collect_fee/mocks/ManagerFinanceCollectFeeContractGapMock.ts';

describe('manager_collect_fee fail-closed API contract', () => {
  it('does not make an undocumented network request and exposes a machine-readable gap', async () => {
    expect(MANAGERCOLLECTFEECOLLECTFEE_CONTRACT_GAP_MOCK).toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    await expect(api.fetchManagerCollectFeePayments()).rejects.toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    expect(Object.keys(api)).not.toContain('fetchManagerCollectFeeRefunds');
  });
});

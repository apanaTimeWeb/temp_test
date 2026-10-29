import { describe, expect, it } from 'vitest';
import * as api from '@/app/frontend_manager/manager_finance/finance_fines_payments/api/manager_finance_fines_payments.api';
import { MANAGERFINESPAYMENTSFINESPAYMENTS_CONTRACT_GAP_MOCK } from '@/app/frontend_manager/manager_finance/finance_fines_payments/mocks/ManagerFinanceFinesPaymentsContractGapMock';

describe('manager_fines_payments fail-closed API contract', () => {
  it('does not make an undocumented network request and exposes a machine-readable gap', async () => {
    expect(MANAGERFINESPAYMENTSFINESPAYMENTS_CONTRACT_GAP_MOCK).toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    const calls = [
    api.fetchManagerFinesPaymentsPayments as (...args: never[]) => Promise<unknown>,
    api.fetchManagerFinesPaymentsRefunds as (...args: never[]) => Promise<unknown>,
    ];
    for (const call of calls) {
      await expect(call(...([] as never[]))).rejects.toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    }
  });
});

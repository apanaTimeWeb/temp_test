import { describe, expect, it } from 'vitest';
import { MANAGER_ACCOUNTING_SAMPLE_ASSETS } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';
import { MANAGER_ACCOUNTING_SAMPLE_ASSETS as FIXTURE_SOURCE } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/mocks/manager_accounts_daily_settlement_fixtures/ManagerAccountsDailySettlementAssetSampleFixtures';

describe('ManagerAccountsDailySettlementDemoRepository', () => {
  it('returns a defensive sample snapshot rather than aliasing fixture objects', () => {
    expect(MANAGER_ACCOUNTING_SAMPLE_ASSETS).not.toBe(FIXTURE_SOURCE);
    expect(MANAGER_ACCOUNTING_SAMPLE_ASSETS[0]).not.toBe(FIXTURE_SOURCE[0]);
    expect(MANAGER_ACCOUNTING_SAMPLE_ASSETS[0]).toEqual(FIXTURE_SOURCE[0]);
  });
});

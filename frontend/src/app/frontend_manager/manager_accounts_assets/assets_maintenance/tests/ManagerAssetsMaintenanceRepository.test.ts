import { describe, expect, it } from 'vitest';
import { getManagerAssetsMaintenanceSampleLogs } from '../mocks/ManagerAssetsMaintenanceRepository';

describe('maintenance sample repository', () => {
  it('returns five illustrative records as defensive copies', () => {
    const first = getManagerAssetsMaintenanceSampleLogs();
    expect(first).toHaveLength(5);
    first[0].assetName = 'mutated';
    expect(getManagerAssetsMaintenanceSampleLogs()[0].assetName).toBe('AC Unit — Hall A');
  });
  it('does not claim a write contract', async () => {
    const api = await import('../api/manager_assets_maintenance.api');
    expect(api.MANAGER_ASSETS_MAINTENANCE_API_CONTRACT_STATUS).toBe('EXTERNAL_PRODUCT_DECISION_BLOCKED');
  });
});

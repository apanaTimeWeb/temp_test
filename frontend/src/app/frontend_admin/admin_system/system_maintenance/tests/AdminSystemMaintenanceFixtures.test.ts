import { describe, expect, it } from 'vitest';
import { getAdminSystemMaintenanceFixtures } from '@/app/frontend_admin/admin_system/system_maintenance/mocks/AdminSystemMaintenanceFixtures';

describe('Admin System maintenance demo fixtures', () => {
  it('derives display dates and relative counters from the same reference day', () => {
    const referenceDate = new Date('2026-10-14T12:00:00.000Z');
    const fixtures = getAdminSystemMaintenanceFixtures(referenceDate);

    expect(fixtures.seats[0]).toMatchObject({ lastMaint: '2026-07-17', daysSince: 89 });
    expect(fixtures.assets[0]).toMatchObject({ nextDue: '2026-08-20', daysOverdue: 55 });
    expect(fixtures.assets[1]).toMatchObject({ nextDue: '2026-10-23', daysOverdue: -9 });
    expect(fixtures.assets[2]).toMatchObject({ nextDue: '2026-12-13', daysOverdue: -60 });
    expect(fixtures.lockers[0]?.issueDate).toBe('2026-10-08');
  });

  it('keeps sample maintenance records stable in shape and labels synthetic', () => {
    const fixtures = getAdminSystemMaintenanceFixtures(new Date('2026-10-14T12:00:00.000Z'));
    expect(fixtures.seats).toHaveLength(4);
    expect(fixtures.assets.map((asset) => asset.nameKey)).toEqual(['ASSET_AC_UNIT', 'ASSET_CEILING_FAN', 'ASSET_CCTV']);
    expect(fixtures.lockers.every((locker) => locker.issueKey.length > 0)).toBe(true);
  });
});

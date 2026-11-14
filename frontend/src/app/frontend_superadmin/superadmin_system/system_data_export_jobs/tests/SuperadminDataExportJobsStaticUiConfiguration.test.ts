import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SYSTEM_DATA_EXPORT_QUICK_EXPORTS } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/constants/SuperadminDataExportJobsStaticConstants';

describe('data export quick-export configuration', () => {
  it('keeps stable IDs and explicitly labels manifest-only output', () => {
    expect(SUPERADMIN_SYSTEM_DATA_EXPORT_QUICK_EXPORTS.map(({ id }) => id)).toEqual(['due-fees', 'expiring', 'active', 'full-backup']);
    expect(SUPERADMIN_SYSTEM_DATA_EXPORT_QUICK_EXPORTS.every(({ formatKey }) => formatKey === 'COPY.MANIFEST_CSV')).toBe(true);
  });
});

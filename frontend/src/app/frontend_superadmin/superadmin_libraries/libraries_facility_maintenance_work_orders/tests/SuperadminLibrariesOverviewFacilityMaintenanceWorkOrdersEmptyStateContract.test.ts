// RESPONSIBILITY: Protect per-collection empty-state ownership without claiming an active filter.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(resolve(process.cwd(), 'src/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx'), 'utf8');

describe('facility maintenance work orders empty-state contract', () => {
  it('renders a collection-empty state inside each owning table', () => {
    expect(source).toContain('SEATS.length === 0');
    expect(source).toContain('ASSETS.length === 0');
    expect(source).toContain('LOCKERS.length === 0');
    expect(source).toContain('colSpan={5}');
    expect(source).toContain('colSpan={7}');
    expect(source).toContain('colSpan={4}');
    expect(source).not.toContain('<SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersEmptyState filtered');
  });
});

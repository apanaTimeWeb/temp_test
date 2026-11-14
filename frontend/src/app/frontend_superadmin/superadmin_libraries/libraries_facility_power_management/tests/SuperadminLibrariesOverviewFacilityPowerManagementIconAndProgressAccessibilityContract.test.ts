// RESPONSIBILITY: Protect the facility power-management icon and progress accessibility contracts.
// FLOW: Vitest -> module-local component/type/source contracts -> deterministic static regression assertions.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MODULE_ROOT = resolve(process.cwd(), 'src/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management');

describe('facility power-management icon and progress accessibility contract', () => {
  it('uses the shared 18px Lucide icon size and 2px stroke', () => {
    const page = readFileSync(resolve(MODULE_ROOT, 'components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx'), 'utf8');
    const emptyState = readFileSync(resolve(MODULE_ROOT, 'components/SuperadminLibrariesOverviewFacilityPowerManagementEmptyState.tsx'), 'utf8');
    expect(page).toContain('<ChevronRight aria-hidden="true" size={18} strokeWidth={2} />');
    expect(page).toContain('<Zap aria-hidden="true" size={18} strokeWidth={2}');
    expect(emptyState).toContain('<Inbox aria-hidden="true" size={18} strokeWidth={2}');
    expect(page).not.toMatch(/<(?:ChevronRight|Zap)\b[^>]*size=\{(?:12|16|28)\}/);
    expect(emptyState).not.toContain('h-4 w-4');
  });

  it('requires a contextual localized progress name for each zone', () => {
    const page = readFileSync(resolve(MODULE_ROOT, 'components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx'), 'utf8');
    const progress = readFileSync(resolve(MODULE_ROOT, 'components/SuperadminLibrariesOverviewFacilityPowerManagementProgress.tsx'), 'utf8');
    const types = readFileSync(resolve(MODULE_ROOT, 'types/SuperadminLibrariesOverviewFacilityPowerManagementProgressComponentTypes.ts'), 'utf8');
    expect(page).toContain('ariaLabel={`${tCopy("COPY.OCCUPANCY")}: ${zone.name}`}');
    expect(progress).toContain('aria-label={ariaLabel}');
    expect(types).toContain('ariaLabel: string');
    expect(types).not.toContain('label?: string');
  });

  it('does not classify a collection empty state as an active filter result', () => {
    const page = readFileSync(resolve(MODULE_ROOT, 'components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx'), 'utf8');
    expect(page).toContain('SAMPLE_ALERT_LOG?.length === 0) && <SuperadminLibrariesOverviewFacilityPowerManagementEmptyState />');
    expect(page).not.toContain('SAMPLE_ALERT_LOG?.length === 0) && <SuperadminLibrariesOverviewFacilityPowerManagementEmptyState filtered');
  });
});

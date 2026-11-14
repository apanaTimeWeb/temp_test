import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SYSTEM_POWER_SAVING_SAMPLE_ALERT_LOG, SUPERADMIN_SYSTEM_POWER_SAVING_SAMPLE_ZONES } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/mocks/fixtures/SuperadminLibrariesOverviewFacilityPowerManagementMockFixtures';
import * as scenarioMetadata from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/mocks/scenarios/SuperadminLibrariesOverviewFacilityPowerManagementfacility_power_management.MockScenarios';

const pageClient = readFileSync(new URL('../components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx', import.meta.url), 'utf8');

describe('facility power management illustrative preview provenance', () => {
  it('uses locale keys for every synthetic zone and alert-log label', () => {
    expect(SUPERADMIN_SYSTEM_POWER_SAVING_SAMPLE_ZONES.every((zone) => zone.nameKey.startsWith('COPY.'))).toBe(true);
    expect(SUPERADMIN_SYSTEM_POWER_SAVING_SAMPLE_ALERT_LOG.every((row) => row.shiftKey.startsWith('COPY.') && row.zoneKey.startsWith('COPY.') && row.actionKey.startsWith('COPY.'))).toBe(true);
  });

  it('clearly labels the rendered occupancy and alert examples as illustrative', () => {
    expect(pageClient).toContain('SYNTHETIC_POWER_SAVING_PREVIEW_NOTICE');
    expect(pageClient).toContain('ILLUSTRATIVE_ZONE_OCCUPANCY_SUMMARY');
    expect(pageClient).not.toContain('REAL_TIME_ZONE_OCCUPANCY');
  });

  it('does not expose the obsolete four-state scenario alias', () => {
    expect('SUPERADMIN_SYSTEM_POWER_SAVING_SCENARIOS' in scenarioMetadata).toBe(false);
    expect(scenarioMetadata.SUPERADMIN_FACILITY_POWER_MANAGEMENT_CANONICAL_SCENARIOS).toHaveLength(8);
  });
});

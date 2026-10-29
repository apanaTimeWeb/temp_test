import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRoot = [
  join(process.cwd(), 'src/app/frontend_manager/manager_seats_shifts_lockers/lockers_management'),
  join(process.cwd(), 'app/frontend_manager/manager_seats_shifts_lockers/lockers_management'),
  join(process.cwd(), 'frontend_manager/manager_seats_shifts_lockers/lockers_management'),
].find(existsSync);
if (!moduleRoot) throw new Error('Could not locate manager_seats_shifts_lockers/lockers_management from the test working directory.');
const readSource = (relativePath: string) => readFileSync(join(moduleRoot, relativePath), 'utf8');

describe('Seats/Shifts/Lockers sample fixture ownership', () => {
  it('keeps preview arrays in the module mock folder', () => {
    const fixtures = readSource('mocks/manager_lockers_management_fixtures/ManagerLockersManagementSampleFixtures.ts');
    for (const name of [
      'MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_SHIFTS',
      'MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_LOCKERS',
      'MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_SEATS',
      'MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_SHIFT_GAPS',
      'MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_MIGRATION_STUDENTS',
      'MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_MIGRATION_SHIFTS',
    ]) expect(fixtures).toContain(name);
    expect(readSource('components/manager_lockers_management_views/ManagerLockersManagementClient.tsx')).not.toContain('const INITIAL_SEATS');
    expect(readSource('components/manager_lockers_management_views/ManagerLockersManagementClient.tsx')).not.toContain('const INITIAL_LOCKERS');
  });

  it('keeps matrix and migration capabilities owned by canonical route modules', () => {
    const normalizerPath = 'utils/ManagerLockersManagementMatrixStatus.ts';
    if (existsSync(join(moduleRoot, normalizerPath))) expect(readSource(normalizerPath)).toContain("return 'unknown'");
    expect(existsSync(join(moduleRoot, 'config/manager_lockers_management.url_config.ts'))).toBe(true);
    expect(existsSync(join(moduleRoot, '..', 'seats_matrix', 'config/manager_seats_matrix.url_config.ts'))).toBe(true);
    expect(existsSync(join(moduleRoot, '..', 'lockers_matrix', 'config/manager_lockers_matrix.url_config.ts'))).toBe(true);
    expect(existsSync(join(moduleRoot, '..', 'shifts_migration', 'config/manager_shifts_migration.url_config.ts'))).toBe(true);
    expect(existsSync(join(moduleRoot, 'components/manager_lockers_management_dialogs/ManagerLockersManagementSeatMatrixModal.tsx'))).toBe(false);
    expect(existsSync(join(moduleRoot, 'components/manager_lockers_management_sections/ManagerLockersManagementShiftMigrationSummary.tsx'))).toBe(false);
  });

});

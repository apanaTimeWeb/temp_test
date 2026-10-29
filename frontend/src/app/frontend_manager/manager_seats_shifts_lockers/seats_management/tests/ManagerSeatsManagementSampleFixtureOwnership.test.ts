import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRootCandidates = [
  join(process.cwd(), 'src/app/frontend_manager/manager_seats_shifts_lockers/seats_management'),
  join(process.cwd(), 'app/frontend_manager/manager_seats_shifts_lockers/seats_management'),
  join(process.cwd(), 'frontend_manager/manager_seats_shifts_lockers/seats_management'),
  join(process.cwd(), '..', '..'),
  join(process.cwd(), '..'),
  process.cwd(),
];
const moduleRoot = moduleRootCandidates.find((candidate) =>
  existsSync(join(candidate, 'config/manager_seats_management.url_config.ts')) &&
  existsSync(join(candidate, 'mocks/manager_seats_management_fixtures/ManagerSeatsManagementSampleFixtures.ts')) &&
  existsSync(join(candidate, 'components/manager_seats_management_views/ManagerSeatsManagementSeatManagementClient.tsx'))
);
if (!moduleRoot) throw new Error('Could not locate the canonical seats_management sub-module.');
const readSource = (relativePath: string) => readFileSync(join(moduleRoot, relativePath), 'utf8');

describe('Canonical sample-fixture ownership and unknown-status safety — seats_management', () => {
  it('keeps all six preview collections in this autonomous sub-module', () => {
    const fixtureSource = readSource('mocks/manager_seats_management_fixtures/ManagerSeatsManagementSampleFixtures.ts');
    for (const fixtureName of ['MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_SHIFTS', 'MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_LOCKERS', 'MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_SEATS', 'MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_SHIFT_GAPS', 'MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_MIGRATION_STUDENTS', 'MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_MIGRATION_SHIFTS']) expect(fixtureSource).toContain(fixtureName);
    expect(fixtureSource).toMatch(/SampleFixtures|preview|sample/i);
    const clientSource = readSource('components/manager_seats_management_views/ManagerSeatsManagementSeatManagementClient.tsx');
    expect(clientSource).not.toMatch(/const INITIAL_SEATS\s*=/);
    expect(clientSource).not.toMatch(/const INITIAL_LOCKERS\s*=/);
    const imports = [...clientSource.matchAll(/from ['"]([^'"]+)['"]/g)].map((match) => match[1]);
    const roleModuleImports = imports.filter((path) => path.includes('/app/frontend_manager/manager_seats_shifts_lockers/'));
    expect(roleModuleImports.every((path) => path.includes('/manager_seats_shifts_lockers/seats_management/'))).toBe(true);
    expect(existsSync(join(moduleRoot, 'config/manager_seats_management.url_config.ts'))).toBe(true);
  });

  it('keeps matrix and migration capabilities owned by canonical route modules', () => {
    const normalizerPath = 'utils/ManagerSeatsManagementMatrixStatus.ts';
    if (existsSync(join(moduleRoot, normalizerPath))) expect(readSource(normalizerPath)).toContain("return 'unknown'");
    expect(existsSync(join(moduleRoot, 'config/manager_seats_management.url_config.ts'))).toBe(true);
    expect(existsSync(join(moduleRoot, '..', 'seats_matrix', 'config/manager_seats_matrix.url_config.ts'))).toBe(true);
    expect(existsSync(join(moduleRoot, '..', 'lockers_matrix', 'config/manager_lockers_matrix.url_config.ts'))).toBe(true);
    expect(existsSync(join(moduleRoot, '..', 'shifts_migration', 'config/manager_shifts_migration.url_config.ts'))).toBe(true);
    expect(existsSync(join(moduleRoot, 'components/manager_seats_management_dialogs/ManagerSeatsManagementSeatMatrixModal.tsx'))).toBe(false);
    expect(existsSync(join(moduleRoot, 'components/manager_seats_management_sections/ManagerSeatsManagementShiftMigrationSummary.tsx'))).toBe(false);
  });

});

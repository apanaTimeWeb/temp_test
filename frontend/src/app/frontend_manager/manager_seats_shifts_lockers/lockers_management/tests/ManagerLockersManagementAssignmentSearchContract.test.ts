import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRootCandidates = [
  join(process.cwd(), 'src/app/frontend_manager/manager_seats_shifts_lockers/lockers_management'),
  join(process.cwd(), 'app/frontend_manager/manager_seats_shifts_lockers/lockers_management'),
  join(process.cwd(), 'frontend_manager/manager_seats_shifts_lockers/lockers_management')
];
const moduleRoot = moduleRootCandidates.find((candidate) => existsSync(join(candidate, 'components/manager_lockers_management_views/ManagerLockersManagementClient.tsx')));
if (!moduleRoot) throw new Error('Could not locate canonical source for search contract verification.');
const source = readFileSync(join(moduleRoot, 'components/manager_lockers_management_views/ManagerLockersManagementClient.tsx'), 'utf8');

describe('disabled locker assignment search contract', () => {
  it('does not expose an inert student search before assignment contract exists', () => {
    expect(source).toMatch(/id="rbg4-managerseatsshiftslockerslockersclient-175"[\s\S]*?disabled/);
    expect(source).toContain('locker_assignment_unavailable_host_mutation_contract_not_e5fc07');
  });
});

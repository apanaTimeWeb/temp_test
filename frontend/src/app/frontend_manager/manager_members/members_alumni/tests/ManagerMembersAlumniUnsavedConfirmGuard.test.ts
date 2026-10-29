import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRoot = [
  join(process.cwd(), 'src/app/frontend_manager/manager_members/members_alumni'),
  join(process.cwd(), 'app/frontend_manager/manager_members/members_alumni'),
  join(process.cwd(), 'frontend_manager/manager_members/members_alumni'),
].find(existsSync);
if (!moduleRoot) throw new Error('Could not locate manager_members/members_alumni from the test working directory.');

describe('alumni lifecycle boundary', () => {
  it('does not wire admission unsaved-draft controls to the alumni route', () => {
    const main = readFileSync(join(moduleRoot, 'components/ManagerMembersAlumniMain.tsx'), 'utf8');
    const page = readFileSync(join(moduleRoot, 'page.tsx'), 'utf8');
    expect(main).not.toMatch(/AdmissionForm|useManagerMembersAlumniAdmission/);
    expect(page).not.toMatch(/AdmissionForm|useManagerMembersAlumniAdmission/);
    expect(existsSync(join(moduleRoot, 'components/manager_members_alumni_forms/ManagerMembersAlumniAdmissionForm.tsx'))).toBe(false);
  });
});

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const moduleRoot = [
  join(process.cwd(), 'src/app/frontend_manager/manager_members/members_group_admission'),
  join(process.cwd(), 'app/frontend_manager/manager_members/members_group_admission'),
  join(process.cwd(), 'frontend_manager/manager_members/members_group_admission'),
].find(existsSync);
if (!moduleRoot) throw new Error('Could not locate manager_members/members_group_admission from the test working directory.');

describe('group admission lifecycle boundary', () => {
  it('routes through GroupPage and avoids blocking browser confirm dialogs in group modals', () => {
    const main = readFileSync(join(moduleRoot, 'components/ManagerMembersGroupAdmissionMain.tsx'), 'utf8');
    const page = readFileSync(join(moduleRoot, 'page.tsx'), 'utf8');
    const bulkModal = readFileSync(
      join(moduleRoot, 'components/manager_members_group_admission_dialogs/ManagerMembersGroupAdmissionBulkModal.tsx'),
      'utf8',
    );
    const manualModal = readFileSync(
      join(moduleRoot, 'components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionManualModal.tsx'),
      'utf8',
    );
    expect(main).not.toMatch(/AdmissionForm|useManagerMembersGroupAdmissionAdmission/);
    expect(page).not.toMatch(/AdmissionForm|useManagerMembersGroupAdmissionAdmission/);
    expect(bulkModal).not.toContain('window.confirm(');
    expect(manualModal).not.toContain('window.confirm(');
  });
});

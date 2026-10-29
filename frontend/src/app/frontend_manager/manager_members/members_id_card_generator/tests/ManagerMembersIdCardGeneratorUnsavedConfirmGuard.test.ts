import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRoot = [
  join(process.cwd(), 'src/app/frontend_manager/manager_members/members_id_card_generator'),
  join(process.cwd(), 'app/frontend_manager/manager_members/members_id_card_generator'),
  join(process.cwd(), 'frontend_manager/manager_members/members_id_card_generator'),
].find(existsSync);
if (!moduleRoot) throw new Error('Could not locate manager_members/members_id_card_generator from the test working directory.');
const readSource = (relativePath: string) => readFileSync(join(moduleRoot, relativePath), 'utf8');

describe('ID-card and admission lifecycle separation', () => {
  it('does not mount an admission draft guard on the ID-card route', () => {
    expect(readSource('components/ManagerMembersIdCardGeneratorMain.tsx')).not.toMatch(/AdmissionForm|useManagerMembersIdCardGeneratorConfirm/);
    expect(existsSync(join(moduleRoot, 'components/manager_members_id_card_generator_forms/ManagerMembersIdCardGeneratorAdmissionForm.tsx'))).toBe(false);
  });

  it('preserves old admission URLs by redirecting rather than losing the workflow', () => {
    const page = readSource('page.tsx');
    expect(page).toContain("requestedView === 'admission'");
    expect(page).toContain('redirect(MANAGER_MEMBERS_ID_CARD_GENERATOR_ROUTES.ADMISSION_PREVIEW)');
    expect(readSource('config/manager_members_id_card_generator.url_config.ts')).toContain("'/frontend_manager/manager_members/members_new_admission'");
  });
});

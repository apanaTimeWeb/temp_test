import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRoot = [
  join(process.cwd(), 'src/app/frontend_manager/manager_members/members_id_card_generator'),
  join(process.cwd(), 'app/frontend_manager/manager_members/members_id_card_generator'),
  join(process.cwd(), 'frontend_manager/manager_members/members_id_card_generator'),
].find(existsSync);
if (!moduleRoot) throw new Error('Could not locate manager_members/members_id_card_generator from the test working directory.');
const source = (relativePath: string) => readFileSync(join(moduleRoot, relativePath), 'utf8');

describe('legacy admission confirmation ownership', () => {
  it('keeps admission confirmation UI out of the ID-card feature', () => {
    expect(existsSync(join(moduleRoot, 'hooks/useManagerMembersIdCardGeneratorConfirm.tsx'))).toBe(false);
    expect(existsSync(join(moduleRoot, 'tests/ManagerMembersIdCardGeneratorUnsavedConfirmGuard.test.ts'))).toBe(true);
    expect(source('page.tsx')).toContain("requestedView === 'admission'");
    expect(source('config/manager_members_id_card_generator.url_config.ts')).toContain('members_new_admission');
  });
});

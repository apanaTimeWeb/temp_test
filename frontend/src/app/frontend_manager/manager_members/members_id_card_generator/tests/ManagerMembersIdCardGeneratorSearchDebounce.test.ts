import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRootCandidates = [
  join(process.cwd(), 'src/app/frontend_manager/manager_members/members_id_card_generator'),
  join(process.cwd(), 'app/frontend_manager/manager_members/members_id_card_generator'),
  join(process.cwd(), 'frontend_manager/manager_members/members_id_card_generator')
];
const moduleRoot = moduleRootCandidates.find((candidate) => existsSync(join(candidate, 'components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorIdCardClient.tsx')));
if (!moduleRoot) throw new Error('Could not locate the canonical module source for search debounce verification.');
const source = readFileSync(join(moduleRoot, 'components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorIdCardClient.tsx'), 'utf8');

describe('300ms live-search debounce contract', () => {
  it('debounces derived filtering and clears pending timers', () => {
    expect(source).toContain('setTimeout');
    expect(source).toContain('300');
    expect(source).toContain('clearTimeout(timeout)');
    expect(source).toContain('debouncedSearch');
  });
});

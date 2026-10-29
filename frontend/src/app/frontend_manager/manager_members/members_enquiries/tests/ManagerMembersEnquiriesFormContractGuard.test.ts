import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRoot = [
  join(process.cwd(), 'src/app/frontend_manager/manager_members/members_enquiries'),
  join(process.cwd(), 'app/frontend_manager/manager_members/members_enquiries'),
  join(process.cwd(), 'frontend_manager/manager_members/members_enquiries'),
  join(process.cwd(), '..', '..'),
  join(process.cwd(), '..'),
  process.cwd(),
].find((candidate) => existsSync(join(candidate, 'config/manager_members_enquiries.url_config.ts')) && existsSync(join(candidate, 'components/manager_members_enquiries_views/ManagerMembersEnquiriesAddPage.tsx')));
if (!moduleRoot) throw new Error('Could not locate the canonical members_enquiries module from the test working directory.');
const readSource = (relativePath: string) => readFileSync(join(moduleRoot, relativePath), 'utf8');

describe('CRM form contract guard', () => {
  it('does not silently discard a valid follow-up form submission', () => {
    const source = readSource('components/manager_members_enquiries_forms/ManagerMembersEnquiriesFollowUpFormPanel.tsx');
    expect(source).not.toMatch(/handleSubmit\(\(\)\s*=>\s*undefined\)/);
    expect(source).toContain('manager-crm-followup-contract-warning');
    expect(source).toContain('onSubmit={(event) => event.preventDefault()}');
    expect(source).toMatch(/type="submit"[^>]*disabled[^>]*title=\{unavailableTitle\}/);
  });

  it('keeps CRM enquiry creation disabled and gives keyboard validation a visible contract response', () => {
    const source = readSource('components/manager_members_enquiries_views/ManagerMembersEnquiriesAddPage.tsx');
    expect(source).toContain('setDraftFeedback(tManagerUi(\'crm_mutations_unavailable_host_contract\'))');
    expect(source).toContain('manager-crm-create-draft-feedback');
    expect(source).toMatch(/type="submit"[^>]*disabled[^>]*title=\{tManagerUi\('crm_mutations_unavailable_host_contract'\)\}/);
  });
});

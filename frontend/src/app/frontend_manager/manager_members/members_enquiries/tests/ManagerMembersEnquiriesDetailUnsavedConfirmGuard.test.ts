import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const detailSource = readFileSync(new URL('../components/manager_members_enquiries_views/ManagerMembersEnquiriesDetailPage.tsx', import.meta.url), 'utf8');

describe('enquiry detail unsaved-changes confirmation', () => {
  it('awaits the module-local accessible confirmation before routing away from a dirty follow-up', () => {
    expect(detailSource).not.toContain('window.confirm(');
    expect(detailSource).toContain('useManagerMembersEnquiriesConfirm');
    expect(detailSource).toContain('if (!followUpDirty) { router.push(href); return; }');
    expect(detailSource).toContain('.then((confirmed) => {');
    expect(detailSource).toContain('if (confirmed) router.push(href);');
    expect(detailSource).toContain('{unsavedConfirmDialog}');
  });
});

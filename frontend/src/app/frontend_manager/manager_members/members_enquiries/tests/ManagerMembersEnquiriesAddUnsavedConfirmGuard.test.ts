import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const addPageSource = readFileSync(new URL('../components/manager_members_enquiries_views/ManagerMembersEnquiriesAddPage.tsx', import.meta.url), 'utf8');
const followUpSource = readFileSync(new URL('../components/manager_members_enquiries_forms/ManagerMembersEnquiriesFollowUpFormPanel.tsx', import.meta.url), 'utf8');

describe('enquiries add and follow-up unsaved-changes confirmation', () => {
  it('uses async module-local confirmation before routing away from a dirty add draft', () => {
    expect(addPageSource).not.toContain('window.confirm(');
    expect(addPageSource).toContain('useManagerMembersEnquiriesConfirm');
    expect(addPageSource).toContain('useManagerMembersEnquiriesUnsavedChangesGuard');
    expect(addPageSource).not.toContain("window.addEventListener('beforeunload'");
    expect(addPageSource).toContain('{unsavedConfirmDialog}');
  });
  it('uses async module-local confirmation before routing away from a dirty follow-up draft', () => {
    expect(followUpSource).not.toContain('window.confirm(');
    expect(followUpSource).toContain('useManagerMembersEnquiriesConfirm');
    expect(followUpSource).toContain('useManagerMembersEnquiriesUnsavedChangesGuard');
    expect(followUpSource).not.toContain("window.addEventListener('beforeunload'");
    expect(readFileSync(new URL('../hooks/useManagerMembersEnquiriesUnsavedChangesGuard.ts', import.meta.url), 'utf8')).toContain('if (confirmed) router.push(`${destination.pathname}${destination.search}${destination.hash}`);');
    expect(followUpSource).toContain('{unsavedConfirmDialog}');
  });
});

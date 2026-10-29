import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const formSource = readFileSync(new URL('../components/manager_members_new_admission_forms/ManagerMembersNewAdmissionAdmissionForm.tsx', import.meta.url), 'utf8');
const hookSource = readFileSync(new URL('../hooks/useManagerMembersNewAdmissionConfirm.tsx', import.meta.url), 'utf8');

describe('unsaved draft confirmation guard', () => {
  it('uses accessible async confirmation and gives the dialog a meaningful accessible name', () => {
    expect(formSource).not.toContain('window.confirm(');
    expect(formSource).toContain('useManager');
    expect(hookSource).toContain('role="alertdialog"');
    expect(hookSource).toContain('aria-labelledby={titleId}');
    expect(hookSource).toContain('<h2 id={titleId} className="text-lg font-semibold text-foreground">{pending.message}</h2>');
    expect(hookSource).not.toContain('{pending.cancelLabel}</h2>');
  });
});

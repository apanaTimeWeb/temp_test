import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const formSource = readFileSync(join(__dirname, '../components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionAdmissionForm.tsx'), 'utf8');
const summarySource = readFileSync(join(__dirname, '../components/manager_members_group_admission_sections/ManagerMembersGroupAdmissionAdmissionSummary.tsx'), 'utf8');
const confirmSource = readFileSync(join(__dirname, '../hooks/useManagerMembersGroupAdmissionConfirm.tsx'), 'utf8');

describe('group admission unsaved-changes confirmation', () => {
  it('uses the feature-local asynchronous dialog rather than the blocking browser confirm', () => {
    expect(formSource).not.toContain('window.confirm(');
    expect(confirmSource).toContain('<h2 id={titleId} className="text-lg font-semibold text-foreground">{pending.message}</h2>');
    expect(summarySource).not.toContain('window.confirm(');
    expect(formSource).toContain('useManagerMembersGroupAdmissionConfirm');
    expect(formSource).toContain('event.stopImmediatePropagation()');
    expect(formSource).toContain('pendingAnchor.click()');
  });

  it('exposes an accessible modal and fails closed when a confirmation is already pending', () => {
    expect(confirmSource).toContain('role="alertdialog"');
    expect(confirmSource).toContain('aria-modal="true"');
    expect(confirmSource).toContain('if (pendingRef.current) return Promise.resolve(false)');
    expect(confirmSource).toContain('settle(false)');
  });
});

// Dialog accessibility regression: the accessible name must describe the unsaved-change decision, not the Cancel action.

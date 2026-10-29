import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const formSource = readFileSync(new URL('../components/manager_settings_help_support_forms/ManagerSettingsHelpSupportTicketForm.tsx', import.meta.url), 'utf8');
const confirmSource = readFileSync(new URL('../hooks/useManagerSettingsHelpSupportConfirm.tsx', import.meta.url), 'utf8');

describe('help and support unsaved ticket confirmation', () => {
  it('waits for confirmation before cancelling a dirty ticket draft or routing away', () => {
    expect(formSource).not.toContain('window.confirm(');
    expect(formSource).toContain('useManagerSettingsHelpSupportConfirm');
    expect(formSource).toContain('if (confirmed) onCancel();');
    expect(formSource).toContain('useManagerSettingsHelpSupportUnsavedChangesGuard');
    expect(formSource).not.toContain("window.addEventListener('beforeunload'");
    const guardSource = readFileSync(new URL('../hooks/useManagerSettingsHelpSupportUnsavedChangesGuard.ts', import.meta.url), 'utf8');
    expect(guardSource).toContain('if (confirmed) router.push(`${destination.pathname}${destination.search}${destination.hash}`);');
    expect(formSource).toContain('{unsavedConfirmDialog}');
    expect(confirmSource).toContain('role="alertdialog"');
    expect(confirmSource).toContain('aria-modal="true"');
    expect(confirmSource).toContain('<h2 id={titleId} className="text-lg font-semibold text-foreground">{pending.message}</h2>');
    expect(confirmSource).toContain("event.key === 'Escape'");
  });
});

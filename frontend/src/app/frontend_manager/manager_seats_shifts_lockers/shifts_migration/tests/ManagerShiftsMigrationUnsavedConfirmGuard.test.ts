import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const pageSource = readFileSync(new URL('../components/manager_shifts_migration_views/ManagerShiftsMigrationClient.tsx', import.meta.url), 'utf8');
const confirmSource = readFileSync(new URL('../hooks/useManagerShiftsMigrationConfirm.tsx', import.meta.url), 'utf8');

describe('shift migration unsaved-changes confirmation', () => {
  it('waits for the accessible module-local dialog before routing away', () => {
    expect(pageSource).not.toContain('window.confirm(');
    expect(pageSource).toContain('useManagerShiftsMigrationConfirm');
    expect(pageSource).toContain('useManagerShiftsMigrationUnsavedChangesGuard');
    expect(pageSource).not.toContain("window.addEventListener('beforeunload'");
    const guardSource = readFileSync(new URL('../hooks/useManagerShiftsMigrationUnsavedChangesGuard.ts', import.meta.url), 'utf8');
    expect(guardSource).toContain('if (confirmed) router.push(`${destination.pathname}${destination.search}${destination.hash}`);');
    expect(pageSource).toContain('{unsavedConfirmDialog}');
    expect(confirmSource).toContain('role="alertdialog"');
    expect(confirmSource).toContain('aria-modal="true"');
    expect(confirmSource).toContain('<h2 id={titleId} className="text-lg font-semibold text-foreground">{pending.message}</h2>');
  });
});

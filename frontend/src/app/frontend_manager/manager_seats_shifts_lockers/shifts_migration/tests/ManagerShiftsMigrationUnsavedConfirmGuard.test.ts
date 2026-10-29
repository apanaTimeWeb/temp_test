import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const pageSource = readFileSync(join(__dirname, '../components/manager_shifts_migration_views/ManagerShiftsMigrationClient.tsx'), 'utf8');
const confirmSource = readFileSync(join(__dirname, '../hooks/useManagerShiftsMigrationConfirm.tsx'), 'utf8');

describe('shift migration unsaved-changes confirmation', () => {
  it('waits for the accessible module-local dialog before routing away', () => {
    expect(pageSource).not.toContain('window.confirm(');
    expect(pageSource).toContain('useManagerShiftsMigrationConfirm');
    expect(pageSource).toContain('useManagerShiftsMigrationUnsavedChangesGuard');
    expect(pageSource).not.toContain("window.addEventListener('beforeunload'");
    const guardSource = readFileSync(join(__dirname, '../hooks/useManagerShiftsMigrationUnsavedChangesGuard.ts'), 'utf8');
    expect(guardSource).toContain('if (confirmed) router.push(`${destination.pathname}${destination.search}${destination.hash}`);');
    expect(pageSource).toContain('{unsavedConfirmDialog}');
    expect(confirmSource).toContain('role="alertdialog"');
    expect(confirmSource).toContain('aria-modal="true"');
    expect(confirmSource).toContain('<h2 id={titleId} className="text-lg font-semibold text-foreground">{pending.message}</h2>');
  });
});

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const pageSource = readFileSync(join(__dirname, '../components/manager_finance_collect_fee_views/ManagerFinanceCollectFeePage.tsx'), 'utf8');
const confirmSource = readFileSync(join(__dirname, '../hooks/useManagerFinanceCollectFeeConfirm.tsx'), 'utf8');

describe('collect fee unsaved-changes confirmation', () => {
  it('waits for the accessible module-local dialog before routing away', () => {
    expect(pageSource).not.toContain('window.confirm(');
    expect(pageSource).toContain('useManagerFinanceCollectFeeConfirm');
    expect(pageSource).toContain('if (confirmed) router.push(`${next.pathname}${next.search}${next.hash}`);');
    expect(pageSource).toContain('{unsavedConfirmDialog}');
    expect(confirmSource).toContain('role="alertdialog"');
    expect(confirmSource).toContain('aria-modal="true"');
    expect(confirmSource).toContain('<h2 id={titleId} className="text-lg font-semibold text-foreground">{pending.message}</h2>');
  });
});

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const frontendManagerRoot = [
  join(process.cwd(), 'src/app/frontend_manager'),
  join(process.cwd(), 'app/frontend_manager'),
  join(process.cwd(), 'frontend_manager'),
].find(existsSync);
if (!frontendManagerRoot) throw new Error('Could not locate frontend_manager from the test working directory.');
const readSource = (relativePath: string) => readFileSync(join(frontendManagerRoot, relativePath), 'utf8');

describe('Collect Fee accessible controls', () => {
  it('provides a keyboard-operable student combobox and listbox', () => {
    const source = readSource('manager_finance/finance_collect_fee/components/manager_finance_collect_fee_views/ManagerFinanceCollectFeePage.tsx');
    expect(source).toContain('role="combobox"');
    expect(source).toContain('role="listbox"');
    expect(source).toContain('aria-activedescendant=');
    expect(source).toContain('handleStudentSearchKeyDown');
    expect(source).toContain("event.key === 'Escape'");
    expect(source).toContain("event.key === 'ArrowDown'");
    expect(source).toContain("event.key === 'ArrowUp'");
  });

  it('exposes payment-mode selection through aria-pressed', () => {
    const source = readSource('manager_finance/finance_collect_fee/components/manager_finance_collect_fee_views/ManagerFinanceCollectFeePage.tsx');
    expect(source).toContain('aria-pressed={mode === m}');
  });
});

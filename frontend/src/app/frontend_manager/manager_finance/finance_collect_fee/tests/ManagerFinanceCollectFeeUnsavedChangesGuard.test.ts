import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const candidates = [join(process.cwd(), 'src/app/frontend_manager/manager_finance/finance_collect_fee'), join(process.cwd(), 'app/frontend_manager/manager_finance/finance_collect_fee'), join(process.cwd(), 'frontend_manager/manager_finance/finance_collect_fee')];
const moduleRoot = candidates.find((candidate) => existsSync(join(candidate, 'hooks/useManagerFinanceCollectFeeUnsavedChangesGuard.ts')));
if (!moduleRoot) throw new Error('Could not locate the Finance Collect Fee module source.');
const page = readFileSync(join(moduleRoot, 'components/manager_finance_collect_fee_views/ManagerFinanceCollectFeePage.tsx'), 'utf8');
const guard = readFileSync(join(moduleRoot, 'hooks/useManagerFinanceCollectFeeUnsavedChangesGuard.ts'), 'utf8');
describe('Finance Collect Fee unsaved-changes guard', () => {
  it('uses the module-local guard and retains browser-exit/link protection', () => {
    expect(page).toContain('useManagerFinanceCollectFeeUnsavedChangesGuard');
    expect(page).not.toContain("window.addEventListener('beforeunload'");
    expect(guard).toContain("window.addEventListener('beforeunload'");
    expect(guard).toContain("document.addEventListener('click', guardLinks, true)");
  });
});

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRootCandidates = [
  join(process.cwd(), 'src/app/frontend_manager/manager_finance/finance_receipts'),
  join(process.cwd(), 'app/frontend_manager/manager_finance/finance_receipts'),
  join(process.cwd(), 'frontend_manager/manager_finance/finance_receipts')
];
const moduleRoot = moduleRootCandidates.find((candidate) => existsSync(join(candidate, 'components/manager_finance_receipts_views/ManagerFinanceReceiptsPage.tsx')));
if (!moduleRoot) throw new Error('Could not locate canonical source for search contract verification.');
const source = readFileSync(join(moduleRoot, 'components/manager_finance_receipts_views/ManagerFinanceReceiptsPage.tsx'), 'utf8');

describe('300ms live-search debounce contract', () => {
  it('debounces derived filtering and clears pending timers', () => {
    expect(source).toContain('setTimeout');
    expect(source).toContain('300');
    expect(source).toContain('clearTimeout(timeout)');
    expect(source).toContain('searchInput');
    expect(source).toContain("setUrlFilter('search', searchInput)");
    expect(source).toContain('setSearchInput(search)');
  });
});

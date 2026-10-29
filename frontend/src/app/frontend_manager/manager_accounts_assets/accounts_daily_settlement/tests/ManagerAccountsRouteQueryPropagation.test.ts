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

describe('route query context propagation', () => {
  it('forwards view/id explicitly into the owning leaf screen without sibling dispatch', () => {
    const main = readSource('manager_accounts_assets/accounts_daily_settlement/components/ManagerAccountsDailySettlementMain.tsx');
    const leaf = readSource('manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_views/ManagerAccountsDailySettlementPage.tsx');
    expect(main).toMatch(/return\s*<\w+\s+view=\{props\.view\}\s+id=\{props\.id\}\s*\/>/);
    expect(leaf).toContain('data-route-view={view}');
    expect(leaf).toContain('data-route-id={id}');
  });
});

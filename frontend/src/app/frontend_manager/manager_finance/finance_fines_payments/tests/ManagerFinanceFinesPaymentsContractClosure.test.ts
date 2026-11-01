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

describe('Finance contract-dependent interaction closure — fines payments', () => {
  it('keeps policy editing unavailable at the entry point while no write contract exists', () => {
    const file = 'manager_finance/finance_auto_suspend/components/manager_finance_auto_suspend_views/ManagerFinanceAutoSuspendPage.tsx';
    const source = readSource(file);
    expect(source, file).toMatch(/<button[^>]*disabled[^>]*title=\{tManagerUi\('save_unavailable_verified_api_contract_not_supplied'\)\}/s);
  });
});

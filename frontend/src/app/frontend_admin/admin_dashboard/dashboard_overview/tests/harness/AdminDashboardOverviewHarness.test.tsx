import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe,expect,it } from 'vitest';

const here = path.dirname(fileURLToPath(import.meta.url));
describe('Dashboard overview test harness', () => {
  it('is available as a local harness entry', () => {
    const source = readFileSync(path.join(here, 'AdminDashboardOverviewHarness.tsx'), 'utf8');
    expect(source).toContain('admin-dashboard-dashboard-overview-harness');
  });
});

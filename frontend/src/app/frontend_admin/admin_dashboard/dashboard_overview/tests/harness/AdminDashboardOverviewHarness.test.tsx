import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
describe('Dashboard overview test harness', () => {
  it('is available as a local harness entry', () => {
    const source = readFileSync(path.join(here, 'AdminDashboardOverviewHarness.tsx'), 'utf8');
    expect(source).toContain('admin-dashboard-dashboard-overview-harness');
  });
});

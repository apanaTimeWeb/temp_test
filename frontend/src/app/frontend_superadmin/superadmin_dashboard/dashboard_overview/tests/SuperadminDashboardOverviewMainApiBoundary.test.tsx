// RESPONSIBILITY: Protect the dashboard production API boundary from fixture-backed rendering.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SUPERADMINDASHBOARDOVERVIEW_API_CONTRACT_STATUS } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/api/superadmin_dashboard_overview.api';
import { useSuperadminDashboardOverviewAvailability } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/hooks/useSuperadminDashboardOverviewAvailability';

const mainSource = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../components/SuperadminDashboardOverviewMain.tsx'), 'utf8');

describe('dashboard overview production data boundary', () => {
  it('keeps the supplied API contract unavailable and performs no network calls', () => {
    expect(SUPERADMINDASHBOARDOVERVIEW_API_CONTRACT_STATUS.status).toBe('unavailable');
    expect(SUPERADMINDASHBOARDOVERVIEW_API_CONTRACT_STATUS.networkCallsEnabled).toBe(false);
    expect(useSuperadminDashboardOverviewAvailability().available).toBe(false);
  });
  it('does not import preview fixtures into the production Main route', () => {
    expect(mainSource).not.toMatch(/mocks\/fixtures/);
    expect(mainSource).toContain('useSuperadminDashboardOverviewAvailability');
    expect(mainSource).toContain('dashboard-overview-api-unavailable');
  });
});

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, screen, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import AdminDashboardOverviewMain from '@/app/frontend_admin/admin_dashboard/dashboard_overview/components/AdminDashboardOverviewMain';
import en from '@/app/frontend_admin/admin_dashboard/dashboard_overview/locales/admin_dashboard_overview_en.json';

const here = path.dirname(fileURLToPath(import.meta.url));
function renderOverview() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <AdminDashboardOverviewMain />
    </NextIntlClientProvider>,
  );
}

describe('Admin dashboard overview canonical route and behavior', () => {
  it('renders the overview and only routes into the requested active domains', () => {
    renderOverview();

    expect(screen.getByRole('heading', { name: 'Library overview' })).toBeTruthy();
    const destinations = screen.getByRole('region', { name: 'Library destinations' });
    const links = within(destinations).getAllByRole('link', { name: 'Open workspace' });
    expect(links).toHaveLength(3);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/admin/admin_members/members_directory',
      '/admin/admin_seats_shifts_lockers/seats_matrix',
      '/admin/admin_finance/finance_dashboard',
    ]);
    expect(screen.getByRole('status').textContent).toContain('No live Library KPI endpoint');
    expect(screen.queryByText('Catalog')).toBeNull();
    expect(screen.queryByText('Circulation')).toBeNull();
  });

  it('uses the canonical leaf route config and the domain redirect', () => {
    const routeConfig = readFileSync(
      path.join(here, '../config/admin_dashboard_overview.url_config'),
      'utf8',
    );
    const domainRoute = readFileSync(path.join(here, '../../page'), 'utf8');
    expect(routeConfig).toContain("route: '/admin/admin_dashboard/dashboard_overview'");
    expect(domainRoute).toContain('redirect(ADMIN_DASHBOARD_OVERVIEW_CANONICAL_ROUTE)');
  });
});

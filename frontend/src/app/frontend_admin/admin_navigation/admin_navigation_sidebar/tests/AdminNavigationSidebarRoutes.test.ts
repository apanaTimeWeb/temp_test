import { describe, expect, it } from 'vitest';
import { ADMIN_NAVIGATION_URLS } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/config/admin_navigation_sidebar.url_config';
import { ADMIN_SIDEBAR_NAV } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/config/admin_navigation_sidebar_navigation_constants';
import type { AdminNavItem } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/types/AdminNavigationSidebarTypes';

const EXPECTED_DOMAIN_DESTINATIONS = [
  ['DASHBOARD', '/admin/admin_dashboard'],
  ['MEMBERS', '/admin/admin_members'],
  ['SEATS_SHIFTS_LOCKERS', '/admin/admin_seats_shifts_lockers'],
  ['FINANCE', '/admin/admin_finance'],
  ['ACCOUNTS_ASSETS', '/admin/admin_accounts_assets'],
  ['STAFF', '/admin/admin_staff'],
  ['SYSTEM', '/admin/admin_system'],
  ['COMMUNICATION', '/admin/admin_communication'],
  ['SETTINGS', '/admin/admin_settings'],
] as const;

describe('Admin nine-domain primary navigation', () => {
  it('exposes exactly one clickable destination for each approved domain', () => {
    const clickable = ADMIN_SIDEBAR_NAV.filter((item) => 'href' in item) as Array<Extract<AdminNavItem, { href: string }> & { labelKey: string }>;
    expect(clickable.map((item) => item.labelKey)).toEqual(EXPECTED_DOMAIN_DESTINATIONS.map(([key]) => key));
    expect(clickable).toHaveLength(9);
    expect(new Set(clickable.map((item) => item.href)).size).toBe(9);
    expect(clickable.map((item) => item.href)).toEqual(EXPECTED_DOMAIN_DESTINATIONS.map(([, href]) => href));
    expect(clickable.every((item) => Object.values(ADMIN_NAVIGATION_URLS).includes(item.href as never))).toBe(true);
  });

  it('keeps all 66 requested destinations in the canonical central route registry', async () => {
    const { ADMIN_ROUTES } = await import('@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes');
    const values = Object.values(ADMIN_ROUTES).filter((value): value is Extract<(typeof ADMIN_ROUTES)[keyof typeof ADMIN_ROUTES], string> => typeof value === 'string' && /^\/admin\/admin_[a-z0-9_]+\/[a-z0-9_]+$/.test(value));
    expect(new Set(values).size).toBe(66);
    expect(values.every((value) => !value.includes('?view='))).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import { ADMIN_SIDEBAR_NAV } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/config/admin_navigation_sidebar_navigation_constants';
import type { AdminNavItem } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/types/AdminNavigationSidebarTypes';

describe('Admin canonical route rebuild', () => {
  it('uses direct target URLs and does not preserve legacy route aliases', () => {
    expect(ADMIN_ROUTES.SEATS_MATRIX).toBe('/admin/admin_seats_shifts_lockers/seats_matrix');
    expect(ADMIN_ROUTES.MEMBERS_STUDENT_DETAIL('student/42')).toBe('/admin/admin_members/members_students?view=detail&id=student%2F42');
    expect(ADMIN_ROUTES.DASHBOARD_REPORTS).toBe('/admin/admin_dashboard/dashboard_reports');
    expect(ADMIN_SIDEBAR_NAV).toHaveLength(9);
    const primaryLinks = ADMIN_SIDEBAR_NAV.filter((item) => 'href' in item) as Array<Extract<AdminNavItem, { href: string }>>;
    expect(primaryLinks.map((item) => item.href)).toEqual(expect.arrayContaining([
      '/admin/admin_dashboard','/admin/admin_members','/admin/admin_seats_shifts_lockers',
      '/admin/admin_finance','/admin/admin_accounts_assets','/admin/admin_staff',
      '/admin/admin_system','/admin/admin_communication','/admin/admin_settings',
    ]));
  });
});

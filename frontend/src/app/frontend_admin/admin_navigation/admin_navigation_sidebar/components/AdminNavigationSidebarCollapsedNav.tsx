'use client';
// Responsibility: AdminNavigationSidebarCollapsedNav component owned by admin_navigation_sidebar.

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ADMIN_SIDEBAR_NAV } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/config/admin_navigation_sidebar_navigation_constants';
import { isSidebarLinkActive } from '../utils/AdminNavigationSidebarPathUtils';

interface AdminNavigationSidebarCollapsedNavProps {
  pathname: string | null;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminNavigationSidebarCollapsedNav({
  pathname,
  mobileOpen,
  onMobileClose,
}: AdminNavigationSidebarCollapsedNavProps) {
  const t = useTranslations('ADMIN_NAVIGATION');

  return (
    <>
      {ADMIN_SIDEBAR_NAV.map((item) => {
        if ('group' in item) return null;
        const Icon = item.icon;
        const active = pathname ? isSidebarLinkActive(pathname, item.href) : false;
        return (
          <Link
            data-testid={`admin_sidebar-AdminNavigationSidebar-link-${item.href
              .replace(/[^a-zA-Z0-9]+/g, '-')
              .replace(/^-|-$/g, '')}`}
            aria-current={active ? 'page' : undefined}
            key={item.href}
            href={item.href}
            title={t(item.labelKey ?? item.label)}
            onClick={mobileOpen ? onMobileClose : undefined}
            className={`admin-sidebar-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              active ? 'admin-sidebar-link-active' : ''
            }`}
          >
            <Icon
              size={18}
              strokeWidth={2}
              className={active ? 'text-primary' : 'text-text-secondary'}
              aria-hidden="true"
            />
          </Link>
        );
      })}
    </>
  );
}

export default AdminNavigationSidebarCollapsedNav;


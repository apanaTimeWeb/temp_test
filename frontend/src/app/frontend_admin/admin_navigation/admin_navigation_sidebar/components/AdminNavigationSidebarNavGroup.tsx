'use client';

import {
ADMIN_NAV_GROUP_COLORS,
ADMIN_NAV_SUBMODULE_COLORS,
DEFAULT_ADMIN_NAV_COLOR,
} from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/config/admin_navigation_sidebar_colors';
import type { AdminNavigationGroup } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/config/admin_navigation_sidebar_navigation_constants';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface AdminNavigationSidebarNavGroupProps {
  group: AdminNavigationGroup;
  isGroupOpen: boolean;
  activeGroup: boolean;
  pathname: string | null;
  onToggleGroup: (id: string) => void;
  onLinkClick: () => void;
  isSubmoduleActive: (currentPath: string, subHref: string) => boolean;
}

export function AdminNavigationSidebarNavGroup({
  group,
  isGroupOpen,
  activeGroup,
  pathname,
  onToggleGroup,
  onLinkClick,
  isSubmoduleActive,
}: AdminNavigationSidebarNavGroupProps) {
  const t = useTranslations('ADMIN_NAVIGATION');
  const groupLabel = t(group.labelKey) ?? group.label;
  const groupColor = ADMIN_NAV_GROUP_COLORS[group.id] ?? DEFAULT_ADMIN_NAV_COLOR;

  return (
    <div className="admin-sidebar-group-block">
      <button
        type="button"
        aria-expanded={isGroupOpen}
        aria-controls={`admin-sidebar-sublinks-${group.id}`}
        onClick={() => onToggleGroup(group.id)}
        data-testid={
          group.id === 'dashboard'
            ? 'admin_sidebar-AdminShellSidebar-link-admin-admin-dashboard'
            : `admin_sidebar-AdminNavigationSidebar-group-${group.id}`
        }
        className={`admin-sidebar-group-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          activeGroup ? 'is-active' : ''
        }`}
      >
        <span className="admin-sidebar-group-label">{groupLabel}</span>
        <ChevronDown
          size={13}
          strokeWidth={2}
          className={`admin-sidebar-group-chevron ${isGroupOpen ? 'is-expanded' : ''}`}
          aria-hidden="true"
        />
      </button>

      <div
        id={`admin-sidebar-sublinks-${group.id}`}
        hidden={!isGroupOpen}
        className="admin-sidebar-sublinks"
      >
        {group.submodules.map((sub) => {
          const subActive = isSubmoduleActive(pathname ?? '', sub.href);
          const SubIcon = sub.icon;
          const subLabel = t(sub.labelKey) ?? sub.label;
          const subColor = ADMIN_NAV_SUBMODULE_COLORS[sub.labelKey] ?? groupColor;

          return (
            <Link
              key={sub.href}
              href={sub.href}
              onClick={onLinkClick}
              aria-current={subActive ? 'page' : undefined}
              data-testid={`admin_sidebar-AdminNavigationSidebar-link-${sub.href
                .replace(/[^a-zA-Z0-9]+/g, '-')
                .replace(/^-|-$/g, '')}`}
              className={`admin-sidebar-sublink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                subActive ? 'admin-sidebar-sublink-active' : ''
              }`}
            >
              <span
                className="admin-nav-icon-badge-sub"
                style={{
                  color: subColor.iconColor,
                  backgroundColor: subActive ? `${subColor.iconColor}33` : subColor.bg,
                  boxShadow: subActive ? `0 0 12px ${subColor.iconColor}50` : undefined,
                }}
              >
                <SubIcon
                  size={15}
                  strokeWidth={2.2}
                  className="admin-sidebar-sublink-icon"
                  aria-hidden="true"
                />
              </span>
              <span className="admin-sidebar-sublink-label">{subLabel}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default AdminNavigationSidebarNavGroup;

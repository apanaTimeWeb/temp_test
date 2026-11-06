'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import type { AdminNavigationGroup } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/config/admin_navigation_sidebar_navigation_constants';

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
  const GroupIcon = group.icon;
  const groupLabel = t(group.labelKey) ?? group.label;

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
        className={`admin-sidebar-group-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          activeGroup ? 'is-active' : ''
        }`}
      >
        <div className="admin-sidebar-group-btn-content">
          <GroupIcon
            size={17}
            strokeWidth={2}
            className="admin-sidebar-group-icon"
            aria-hidden="true"
          />
          <span className="admin-sidebar-group-label">{groupLabel}</span>
        </div>
        <ChevronDown
          size={14}
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
          return (
            <Link
              key={sub.href}
              href={sub.href}
              onClick={onLinkClick}
              aria-current={subActive ? 'page' : undefined}
              data-testid={`admin_sidebar-AdminNavigationSidebar-link-${sub.href
                .replace(/[^a-zA-Z0-9]+/g, '-')
                .replace(/^-|-$/g, '')}`}
              className={`admin-sidebar-sublink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                subActive ? 'admin-sidebar-sublink-active' : ''
              }`}
            >
              <SubIcon
                size={14}
                strokeWidth={2}
                className="admin-sidebar-sublink-icon"
                aria-hidden="true"
              />
              <span className="admin-sidebar-sublink-label">{subLabel}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default AdminNavigationSidebarNavGroup;


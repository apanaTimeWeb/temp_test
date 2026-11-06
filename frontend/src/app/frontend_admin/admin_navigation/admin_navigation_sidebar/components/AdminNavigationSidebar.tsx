'use client';
// Responsibility: responsive admin sidebar presentation, search filtering, and accordion submodule navigation.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  LogOut,
  Menu,
  X,
  BookOpen,
  Search,
} from 'lucide-react';
import {
  ADMIN_NAVIGATION_GROUPS,
} from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/config/admin_navigation_sidebar_navigation_constants';
import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import type { AdminNavigationSidebarProps } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/types/AdminNavigationSidebarComponentTypes';
import { AdminNavigationSidebarLogoutModal } from './AdminNavigationSidebarLogoutModal';
import { AdminNavigationSidebarSearch } from './AdminNavigationSidebarSearch';
import { AdminNavigationSidebarNavGroup } from './AdminNavigationSidebarNavGroup';
import { AdminNavigationSidebarCollapsedNav } from './AdminNavigationSidebarCollapsedNav';
import {
  isGroupActive,
  isSubmoduleActive,
} from '../utils/AdminNavigationSidebarPathUtils';

/**
 * @description Renders role-owned navigation, interactive search, expandable submodule accordions, responsive drawer behavior, and the admin logout confirmation.
 * @dependencies Consumes only role navigation configuration and zero-business dialog primitives.
 * @edge-case Nested routes auto-expand their parent domain group; mobile drawer closes after navigation.
 */
export function AdminNavigationSidebar({
  collapsed: controlledCollapsed,
  onToggle,
  mobileOpen: controlledMobileOpen,
  onMobileClose,
}: AdminNavigationSidebarProps) {
  const t = useTranslations('ADMIN_NAVIGATION');
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  // Default all navigation domain accordion groups to expanded
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() =>
    ADMIN_NAVIGATION_GROUPS.map((g) => g.id)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const collapsed = controlledCollapsed ?? internalCollapsed;
  const mobileOpen = controlledMobileOpen ?? internalMobileOpen;
  const closeMobile = useCallback(() => {
    if (onMobileClose) onMobileClose();
    else setInternalMobileOpen(false);
  }, [onMobileClose]);
  const toggle = onToggle ?? (() => setInternalCollapsed(v => !v));
  const sidebarRef = useRef<HTMLElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Focus trap and accessibility for mobile drawer
  useEffect(() => {
    if (!mobileOpen) {
      previouslyFocusedRef.current?.focus();
      previouslyFocusedRef.current = null;
      return;
    }
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () =>
      sidebarRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
    const first = focusable()?.[0];
    (first ?? sidebarRef.current)?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMobile();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = Array.from(focusable() ?? []);
      if (!items.length) {
        event.preventDefault();
        sidebarRef.current?.focus();
        return;
      }
      const firstItem = items[0],
        lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen, closeMobile]);

  // Determine active group based on current pathname
  const activeGroupId = useMemo(() => {
    for (const group of ADMIN_NAVIGATION_GROUPS) {
      if (isGroupActive(pathname, group)) {
        return group.id;
      }
    }
    return null;
  }, [pathname]);

  // Auto-expand active group when navigating
  useEffect(() => {
    if (activeGroupId) {
      setExpandedGroups((prev) => (prev.includes(activeGroupId) ? prev : [...prev, activeGroupId]));
    }
  }, [activeGroupId]);

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId],
    );
  }, []);

  const isSearching = searchQuery.trim().length > 0;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    if (!isSearching) return ADMIN_NAVIGATION_GROUPS;
    return ADMIN_NAVIGATION_GROUPS.map((group) => {
      const groupLabel = (t(group.labelKey) ?? group.label).toLowerCase();
      const groupMatches = groupLabel.includes(normalizedQuery);
      const matchingSubmodules = group.submodules.filter((sub) => {
        const subLabel = (t(sub.labelKey) ?? sub.label).toLowerCase();
        const href = sub.href.toLowerCase();
        return groupMatches || subLabel.includes(normalizedQuery) || href.includes(normalizedQuery);
      });
      return {
        ...group,
        submodules: matchingSubmodules,
      };
    }).filter((group) => group.submodules.length > 0);
  }, [isSearching, normalizedQuery, t]);

  const handleLinkClick = useCallback(() => {
    if (mobileOpen) closeMobile();
    if (isSearching) setSearchQuery('');
  }, [mobileOpen, closeMobile, isSearching]);

  const expanded = !collapsed || mobileOpen;

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          onClick={closeMobile}
          aria-label={t('CLOSE_NAVIGATION')}
        />
      )}
      <aside
        ref={sidebarRef}
        tabIndex={mobileOpen ? -1 : undefined}
        role={mobileOpen ? 'dialog' : undefined}
        aria-modal={mobileOpen ? true : undefined}
        aria-label={mobileOpen ? t('ADMIN_NAVIGATION') : undefined}
        data-testid="admin-sidebar"
        className={`admin-sidebar ${collapsed ? 'admin-sidebar-collapsed' : 'admin-sidebar-expanded'} ${
          mobileOpen ? 'admin-sidebar-mobile-open' : ''
        }`}
      >
        <div className="admin-sidebar-logo-row">
          <button
            data-testid="admin_sidebar-AdminNavigationSidebar-control-001"
            type="button"
            className="admin-sidebar-toggle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={mobileOpen ? closeMobile : toggle}
            aria-label={mobileOpen ? t('CLOSE_SIDEBAR') : t('TOGGLE_SIDEBAR')}
          >
            {mobileOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
          </button>
          {expanded && (
            <Link
              href="/admin/admin_dashboard"
              className="flex items-center gap-2 text-decoration-none"
              onClick={mobileOpen ? closeMobile : undefined}
            >
              <div className="admin-sidebar-brand-mark">
                <BookOpen size={18} strokeWidth={2} />
              </div>
              <span className="admin-sidebar-brand text-primary">
                {ADMIN_BRAND_CONFIG.name} <span className="text-primary">{ADMIN_BRAND_CONFIG.suffix}</span>
              </span>
            </Link>
          )}
        </div>

        <AdminNavigationSidebarSearch
          expanded={expanded}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCollapsedToggle={() => {
            toggle();
            setTimeout(() => searchInputRef.current?.focus(), 150);
          }}
          searchInputRef={searchInputRef}
        />

        <nav className="admin-sidebar-nav" aria-label={t('ADMIN_NAVIGATION')} data-testid="admin-navigation">
          {!expanded ? (
            <AdminNavigationSidebarCollapsedNav
              pathname={pathname}
              mobileOpen={mobileOpen}
              onMobileClose={closeMobile}
            />
          ) : filteredGroups.length === 0 ? (
            <div className="admin-sidebar-search-empty" role="status" data-testid="admin-sidebar-search-empty">
              <Search size={24} className="admin-sidebar-search-empty-icon" aria-hidden="true" />
              <p className="admin-sidebar-search-empty-title">{t('NO_MATCHING_MODULES') ?? 'No matching modules'}</p>
              <p className="admin-sidebar-search-empty-sub">
                {t('NO_RESULTS_FOR') ?? 'No results for'} &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="admin-sidebar-search-empty-btn"
                data-testid="admin-sidebar-search-empty-clear"
              >
                {t('CLEAR_SEARCH') ?? 'Clear search'}
              </button>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <AdminNavigationSidebarNavGroup
                key={group.id}
                group={group}
                isGroupOpen={isSearching ? true : expandedGroups.includes(group.id)}
                activeGroup={isGroupActive(pathname, group)}
                pathname={pathname}
                onToggleGroup={toggleGroup}
                onLinkClick={handleLinkClick}
                isSubmoduleActive={isSubmoduleActive}
              />
            ))
          )}
        </nav>

        <div
          className={`admin-sidebar-footer ${
            expanded ? 'admin-sidebar-footer-expanded' : 'admin-sidebar-footer-collapsed'
          }`}
        >
          {expanded && (
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{t('ADMIN_GREETING')}</p>
              <p className="text-caption text-text-secondary truncate">{t('ADMINISTRATOR')}</p>
            </div>
          )}
          <button
            data-testid="admin_sidebar-AdminNavigationSidebar-control-003"
            type="button"
            className="admin-sidebar-logout focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={t('LOG_OUT')}
            onClick={() => setShowLogout(true)}
          >
            <LogOut size={expanded ? 18 : 20} />
          </button>
        </div>
      </aside>

      <AdminNavigationSidebarLogoutModal
        open={showLogout}
        onOpenChange={setShowLogout}
      />
    </>
  );
}

export type { AdminNavigationSidebarProps };

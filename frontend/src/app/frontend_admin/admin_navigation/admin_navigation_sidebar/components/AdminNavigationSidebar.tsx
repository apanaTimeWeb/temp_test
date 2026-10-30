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
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import {
  ADMIN_SIDEBAR_NAV,
  ADMIN_NAVIGATION_GROUPS,
  type AdminNavigationGroup,
} from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/config/admin_navigation_sidebar_navigation_constants';
import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import type { AdminNavigationSidebarProps } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/types/AdminNavigationSidebarComponentTypes';

const ALL_HREFS = ADMIN_SIDEBAR_NAV.filter((n): n is { href: string; icon: LucideIcon; label: string } => 'href' in n).map(n => n.href);

function normalizePath(p: string | null | undefined): string {
  if (!p) return '';
  return p.replace(/^\/frontend_admin(\/|$)/, '/admin$1').split('?')[0].split('#')[0].replace(/\/$/, '');
}

function isSubmoduleActive(currentPath: string, subHref: string): boolean {
  const normCurrent = normalizePath(currentPath);
  const normSub = normalizePath(subHref);
  if (!normSub) return false;
  return normCurrent === normSub || normCurrent.startsWith(normSub + '/');
}

function isGroupActive(currentPath: string, group: AdminNavigationGroup): boolean {
  const normCurrent = normalizePath(currentPath);
  const normPrimary = normalizePath(group.primaryHref);
  if (normCurrent === normPrimary || normCurrent.startsWith(normPrimary + '/')) return true;
  return group.submodules.some((sub) => isSubmoduleActive(currentPath, sub.href));
}

function isSidebarLinkActive(currentPath: string, href: string): boolean {
  const normCurrent = normalizePath(currentPath);
  const normHref = normalizePath(href);
  if (normCurrent === normHref) return true;
  if (!normHref || normHref === '/' || !normCurrent.startsWith(normHref + '/')) return false;
  return !ALL_HREFS.some(other => {
    const normOther = normalizePath(other);
    return normOther !== normHref && normOther.startsWith(normHref) && normCurrent.startsWith(normOther);
  });
}

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
  // Default only the active domain accordion group to expanded
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    if (!pathname) return [];
    const matched = ADMIN_NAVIGATION_GROUPS.find((g) => isGroupActive(pathname, g));
    return matched ? [matched.id] : [];
  });
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

        {expanded ? (
          <div className="admin-sidebar-search">
            <div className="admin-sidebar-search-wrap">
              <Search size={14} className="admin-sidebar-search-icon" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    setSearchQuery('');
                  }
                }}
                placeholder={t('SEARCH_NAVIGATION') ?? 'Search modules...'}
                aria-label={t('SEARCH_NAVIGATION') ?? 'Search modules'}
                data-testid="admin-sidebar-search-input"
                className="admin-sidebar-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="admin-sidebar-search-clear"
                  data-testid="admin-sidebar-search-clear"
                  aria-label={t('CLEAR_SEARCH') ?? 'Clear search'}
                >
                  <X size={13} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="admin-sidebar-search-collapsed">
            <button
              type="button"
              onClick={() => {
                toggle();
                setTimeout(() => searchInputRef.current?.focus(), 150);
              }}
              className="admin-sidebar-search-collapsed-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              title={t('SEARCH_NAVIGATION') ?? 'Search modules'}
              aria-label={t('SEARCH_NAVIGATION') ?? 'Search modules'}
              data-testid="admin-sidebar-search-collapsed-toggle"
            >
              <Search size={16} strokeWidth={2} />
            </button>
          </div>
        )}

        <nav className="admin-sidebar-nav" aria-label={t('ADMIN_NAVIGATION')} data-testid="admin-navigation">
          {!expanded ? (
            // Collapsed view: Show domain icons with tooltips
            ADMIN_SIDEBAR_NAV.map((item) => {
              if ('group' in item) return null;
              const Icon = item.icon;
              const active = isSidebarLinkActive(pathname, item.href);
              return (
                <Link
                  data-testid={`admin_sidebar-AdminNavigationSidebar-link-${item.href
                    .replace(/[^a-zA-Z0-9]+/g, '-')
                    .replace(/^-|-$/g, '')}`}
                  aria-current={active ? 'page' : undefined}
                  key={item.href}
                  href={item.href}
                  title={t(item.labelKey ?? item.label)}
                  onClick={mobileOpen ? closeMobile : undefined}
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
            })
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
            filteredGroups.map((group) => {
              const isGroupOpen = isSearching ? true : expandedGroups.includes(group.id);
              const activeGroup = isGroupActive(pathname, group);
              const GroupIcon = group.icon;
              const groupLabel = t(group.labelKey) ?? group.label;

              return (
                <div key={group.id} className="admin-sidebar-group-block">
                  <button
                    type="button"
                    aria-expanded={isGroupOpen}
                    aria-controls={`admin-sidebar-sublinks-${group.id}`}
                    onClick={() => toggleGroup(group.id)}
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
                      const subActive = isSubmoduleActive(pathname, sub.href);
                      const SubIcon = sub.icon;
                      const subLabel = t(sub.labelKey) ?? sub.label;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={handleLinkClick}
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
            })
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

      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent className="max-w-sm bg-overlay border-border">
          <DialogHeader>
            <DialogTitle>{t('LOG_OUT_TITLE')}</DialogTitle>
            <DialogDescription>{t('LOG_OUT_DESCRIPTION')}</DialogDescription>
            <p id="admin-logout-unavailable" role="status" className="text-sm text-text-secondary">
              {t('LOG_OUT_UNAVAILABLE')}
            </p>
          </DialogHeader>
          <DialogFooter>
            <button
              data-testid="admin_sidebar-AdminNavigationSidebar-control-004"
              type="button"
              onClick={() => setShowLogout(false)}
              className="border border-border rounded-md px-4 py-2 text-primary"
            >
              {t('CANCEL')}
            </button>
            <button
              data-testid="admin_sidebar-AdminNavigationSidebar-control-005"
              type="button"
              disabled
              title={t('LOG_OUT_UNAVAILABLE')}
              aria-describedby="admin-logout-unavailable"
              className="bg-danger text-on-danger rounded-md px-4 py-2 opacity-60 cursor-not-allowed"
            >
              {t('LOG_OUT')}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export type { AdminNavigationSidebarProps };

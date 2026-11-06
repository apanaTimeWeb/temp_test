'use client';
// RESPONSIBILITY: Render the navigation navigation sidebar navigation UI for navigation. It does not own backend persistence or cross-feature business logic.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { BookOpen, LogOut, Menu, Search, X } from 'lucide-react';

import { MANAGER_NAVIGATION_HREFS, MANAGER_NAVIGATION_ITEMS } from '@/app/frontend_manager/manager_navigation/navigation/constants/ManagerNavigationNavigationConstants';
import { MANAGER_NAVIGATION_NAVIGATION_ROUTES } from '@/app/frontend_manager/manager_navigation/navigation/config/manager_navigation_navigation.url_config';
import type { ManagerNavigationSidebarProps } from '@/app/frontend_manager/manager_navigation/navigation/types/ManagerNavigationNavigationComponentTypes';
import { ManagerNavigationSidebarLogoutModal } from './ManagerNavigationSidebarLogoutModal';
import { ManagerNavigationSidebarSearch } from './ManagerNavigationSidebarSearch';
import { ManagerNavigationSidebarNavSection } from './ManagerNavigationSidebarNavSection';

export type { ManagerNavigationSidebarProps };

export default function ManagerNavigationSidebar({
  collapsed, onToggle, mobileOpen, onMobileClose,
}: ManagerNavigationSidebarProps) {
  const tManagerUi = useTranslations('manager.manager_navigation.ui');
  const getNavLabel = (key: string) => {
    const text = tManagerUi(key);
    if (!text || text.startsWith('manager.manager_nav')) {
      if (key === 'nav_help_support' || key === 'group_help_support') return 'Help & Support';
    }
    return text;
  };
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showLogout, setShowLogout] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() =>
    MANAGER_NAVIGATION_ITEMS.filter((item) => item.kind === 'group').map((item) => item.labelKey)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileDrawerRef = useRef<HTMLElement>(null);

  // Dependency rationale: mobileOpen controls the body lock, focus hand-off, and Escape listener lifetime.
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    const focusable = (): HTMLElement[] =>
      Array.from(
        mobileDrawerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true');
    (focusable()[0] ?? mobileTriggerRef.current)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onMobileClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) {
        event.preventDefault();
        mobileDrawerRef.current?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const isOutside = !mobileDrawerRef.current?.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || isOutside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || isOutside)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [mobileOpen, onMobileClose]);

  const isActive = (href: string) => {
    const target = new URL(href, 'https://manager.invalid');
    if (pathname !== target.pathname) return false;
    const targetView = target.searchParams.get('view');
    const currentView = searchParams.get('view');
    if (targetView !== currentView) return false;
    return !MANAGER_NAVIGATION_HREFS.some((other) => {
      if (other === href) return false;
      const otherUrl = new URL(other, 'https://manager.invalid');
      return otherUrl.pathname === pathname && otherUrl.searchParams.get('view') === currentView;
    });
  };

  const activeGroupKey = (() => {
    let currentGroup: string | null = null;
    for (const item of MANAGER_NAVIGATION_ITEMS) {
      if (item.kind === 'group') currentGroup = item.labelKey;
      else if (isActive(item.href)) return currentGroup;
    }
    return null;
  })();

  // Expand the active group on route transition or initial mount without wiping manual toggles
  useEffect(() => {
    if (activeGroupKey) {
      setExpandedGroups((prev) => (prev.includes(activeGroupKey) ? prev : [...prev, activeGroupKey]));
    }
  }, [activeGroupKey, pathname]);

  const isSearching = searchQuery.trim().length > 0;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const navigationSections = MANAGER_NAVIGATION_ITEMS.reduce<
    Array<{
      key: string;
      labelKey?: string;
      items: Array<Extract<(typeof MANAGER_NAVIGATION_ITEMS)[number], { kind: 'link' }>>;
    }>
  >((sections, item) => {
    if (item.kind === 'group') {
      sections.push({ key: item.labelKey, labelKey: item.labelKey, items: [] });
    } else {
      if (sections.length === 0) sections.push({ key: 'primary', items: [] });
      const destinationSection = sections[sections.length - 1];
      if (destinationSection) destinationSection.items.push(item);
    }
    return sections;
  }, []);

  const filteredSections = isSearching
    ? navigationSections
        .map((section) => {
          const sectionLabel = section.labelKey ? (getNavLabel(section.labelKey) ?? '').toLowerCase() : '';
          const groupMatches = sectionLabel.includes(normalizedQuery);
          const matchingItems = section.items.filter((item) => {
            const itemLabel = (getNavLabel(item.labelKey) ?? '').toLowerCase();
            const href = item.href.toLowerCase();
            return groupMatches || itemLabel.includes(normalizedQuery) || href.includes(normalizedQuery);
          });
          return {
            ...section,
            items: matchingItems,
          };
        })
        .filter((section) => section.items.length > 0)
    : navigationSections;

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((current) =>
      current.includes(groupKey) ? current.filter((key) => key !== groupKey) : [...current, groupKey]
    );
  };

  const handleLinkClick = () => {
    if (mobileOpen) onMobileClose();
    if (isSearching) setSearchQuery('');
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="mgr-sidebar-overlay"
          onClick={onMobileClose}
          aria-label={tManagerUi('close_sidebar')}
        />
      )}

      <aside
        ref={mobileDrawerRef}
        id="manager-sidebar-drawer"
        tabIndex={-1}
        data-testid="manager-sidebar"
        className={`mgr-sidebar${collapsed ? ' mgr-sidebar-collapsed' : ''}${mobileOpen ? ' mgr-sidebar-mobile-open' : ''}`}
        aria-label={tManagerUi('manager_navigation')}
      >
        <div className="mgr-sidebar-logo">
          <button
            ref={mobileTriggerRef}
            type="button"
            onClick={mobileOpen ? onMobileClose : onToggle}
            className="mgr-menu-btn"
            data-testid="manager-sidebar-toggle"
            aria-label={mobileOpen ? tManagerUi('close_sidebar') : tManagerUi('toggle_sidebar')}
            aria-controls="manager-sidebar-drawer"
            aria-expanded={mobileOpen || !collapsed}
          >
            {mobileOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
          </button>
          {(!collapsed || mobileOpen) && (
            <Link
              href={MANAGER_NAVIGATION_NAVIGATION_ROUTES.DASHBOARD}
              className="mgr-sidebar-brand"
              onClick={mobileOpen ? onMobileClose : undefined}
            >
              <span className="mgr-sidebar-brand-mark" aria-hidden="true">
                <BookOpen size={18} strokeWidth={2} />
              </span>
              <span className="mgr-sidebar-brand-name">{tManagerUi('libraryos')}</span>
            </Link>
          )}
        </div>

        <ManagerNavigationSidebarSearch
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchInputRef={searchInputRef}
          onToggle={onToggle}
        />

        <nav
          className="mgr-sidebar-nav"
          data-testid="manager-navigation"
          aria-label={tManagerUi('manager_navigation')}
        >
          {filteredSections.length === 0 ? (
            <div className="mgr-nav-search-empty" role="status" data-testid="manager-nav-search-empty">
              <Search size={24} className="mgr-nav-search-empty-icon" aria-hidden="true" />
              <p className="mgr-nav-search-empty-title">
                {tManagerUi('no_matching_modules') ?? 'No matching modules'}
              </p>
              <p className="mgr-nav-search-empty-sub">
                {tManagerUi('no_results_for') ?? 'No results for'} &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mgr-nav-search-empty-btn"
                data-testid="manager-nav-search-empty-clear"
              >
                {tManagerUi('clear_search') ?? 'Clear search'}
              </button>
            </div>
          ) : (
            filteredSections.map((section) => {
              const expanded = isSearching
                ? true
                : collapsed && !mobileOpen
                ? true
                : section.key === 'primary' || expandedGroups.includes(section.key);

              return (
                <ManagerNavigationSidebarNavSection
                  key={section.key}
                  section={section}
                  expanded={expanded}
                  collapsed={collapsed}
                  mobileOpen={mobileOpen}
                  isActive={isActive}
                  getNavLabel={getNavLabel}
                  onToggleGroup={toggleGroup}
                  onLinkClick={handleLinkClick}
                />
              );
            })
          )}
        </nav>

        {(!collapsed || mobileOpen) && (
          <div className="mgr-sidebar-footer">
            <div className="mgr-avatar" aria-hidden="true">
              {tManagerUi('mg')}
            </div>
            <div className="mgr-sidebar-user-info">
              <p className="mgr-sidebar-user-name">{tManagerUi('manager')}</p>
              <p className="mgr-sidebar-user-email">{tManagerUi('manager_library_com')}</p>
            </div>
            <button
              type="button"
              className="mgr-logout-btn"
              aria-label={tManagerUi('log_out')}
              data-testid="manager-logout-open"
              onClick={() => setShowLogout(true)}
            >
              <LogOut size={18} strokeWidth={2} />
            </button>
          </div>
        )}
      </aside>

      <ManagerNavigationSidebarLogoutModal isOpen={showLogout} onClose={() => setShowLogout(false)} />
    </>
  );
}

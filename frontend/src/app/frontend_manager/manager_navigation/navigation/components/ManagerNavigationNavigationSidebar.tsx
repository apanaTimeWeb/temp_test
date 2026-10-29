'use client';
// RESPONSIBILITY: Render the navigation navigation sidebar navigation UI for navigation. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the navigation navigation sidebar navigation UI for navigation. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronDown, LogOut, Menu, X } from 'lucide-react';
import { MANAGER_NAVIGATION_HREFS, MANAGER_NAVIGATION_ITEMS } from '@/app/frontend_manager/manager_navigation/navigation/constants/ManagerNavigationNavigationConstants';
import { MANAGER_NAVIGATION_NAVIGATION_ROUTES } from '@/app/frontend_manager/manager_navigation/navigation/config/manager_navigation_navigation.url_config';
import type { ManagerNavigationSidebarProps } from '@/app/frontend_manager/manager_navigation/navigation/types/ManagerNavigationNavigationComponentTypes';
export type { ManagerNavigationSidebarProps };



export default function ManagerNavigationSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: ManagerNavigationSidebarProps) {
  const tManagerUi = useTranslations('manager.manager_navigation.ui');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showLogout, setShowLogout] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileDrawerRef = useRef<HTMLElement>(null);
  const logoutDialogRef = useRef<HTMLDivElement>(null);

// Dependency rationale: mobileOpen controls the body lock, focus hand-off, and Escape listener lifetime.
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    const focusable = (): HTMLElement[] => (Array.from(mobileDrawerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []) as HTMLElement[]).filter((element) => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true');
    (focusable()[0] ?? mobileTriggerRef.current)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onMobileClose(); return; }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) { event.preventDefault(); mobileDrawerRef.current?.focus(); return; }
      const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !mobileDrawerRef.current?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !mobileDrawerRef.current?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [mobileOpen, onMobileClose]);

  // Dependency rationale: showLogout controls dialog focus trapping and keyboard-listener lifetime.
  useEffect(() => {
    if (!showLogout) return;
    const dialog = logoutDialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const getFocusable = (): HTMLElement[] => Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')) as HTMLElement[];
    (getFocusable()[0] ?? dialog).focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setShowLogout(false); return; }
      if (event.key !== 'Tab') return;
      const items = getFocusable();
      if (!items.length) { event.preventDefault(); dialog.focus(); return; }
      const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [showLogout]);

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

  // Dependency rationale: expand the group containing the active route whenever the active group or pathname changes.
  useEffect(() => {
    setExpandedGroups(activeGroupKey ? [activeGroupKey] : []);
  }, [activeGroupKey, pathname]);

  const navigationSections = MANAGER_NAVIGATION_ITEMS.reduce<Array<{ key: string; labelKey?: string; items: Array<Extract<(typeof MANAGER_NAVIGATION_ITEMS)[number], { kind: 'link' }>> }>>((sections, item) => {
    if (item.kind === 'group') {
      sections.push({ key: item.labelKey, labelKey: item.labelKey, items: [] });
    } else {
      if (sections.length === 0) sections.push({ key: 'primary', items: [] });
      const destinationSection = sections[sections.length - 1];
      if (destinationSection) destinationSection.items.push(item);
    }
    return sections;
  }, []);

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
            <Link href={MANAGER_NAVIGATION_NAVIGATION_ROUTES.DASHBOARD} className="mgr-sidebar-brand" onClick={mobileOpen ? onMobileClose : undefined}>
              <span className="mgr-sidebar-brand-mark" aria-hidden="true">
                <BookOpen size={18} strokeWidth={2} />
              </span>
              <span className="mgr-sidebar-brand-name">{tManagerUi('libraryos')}</span>
            </Link>
          )}
        </div>

        <nav className="mgr-sidebar-nav" data-testid="manager-navigation" aria-label={tManagerUi('manager_navigation')}>
          {navigationSections.map((section) => {
            const expanded = section.key === 'primary' || expandedGroups.includes(section.key);
            if (section.key === 'primary') {
              return <div key={section.key} className="mgr-nav-section">{section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return <Link key={item.href} href={item.href} className={`mgr-nav-item${active ? ' active' : ''}`} data-testid={`manager-nav-link-${item.href.replace(/[^a-zA-Z0-9]+/g, '-')}`} aria-current={active ? 'page' : undefined} title={collapsed && !mobileOpen ? tManagerUi(item.labelKey) : undefined} onClick={mobileOpen ? onMobileClose : undefined}><Icon size={18} strokeWidth={2} className="mgr-nav-item-icon" aria-hidden="true" />{(!collapsed || mobileOpen) && <span className="mgr-nav-label">{tManagerUi(item.labelKey)}</span>}</Link>;
              })}</div>;
            }
            return <section key={section.key} className="mgr-nav-section">
              {(!collapsed || mobileOpen) && <button type="button" className="mgr-nav-group-label" aria-expanded={expanded} aria-controls={`manager-nav-group-${section.key}`} data-testid={`manager-nav-group-toggle-${section.key}`} onClick={() => setExpandedGroups((current) => current.includes(section.key) ? current.filter((key) => key !== section.key) : [...current, section.key])}><span>{tManagerUi(section.labelKey!)}</span><ChevronDown size={14} aria-hidden="true" className={`mgr-nav-group-chevron${expanded ? ' is-expanded' : ''}`} /></button>}
              <div id={`manager-nav-group-${section.key}`} hidden={!expanded} className="mgr-nav-group-items">{section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return <Link key={item.href} href={item.href} className={`mgr-nav-item${active ? ' active' : ''}`} data-testid={`manager-nav-link-${item.href.replace(/[^a-zA-Z0-9]+/g, '-')}`} aria-current={active ? 'page' : undefined} title={collapsed && !mobileOpen ? tManagerUi(item.labelKey) : undefined} onClick={mobileOpen ? onMobileClose : undefined}><Icon size={18} strokeWidth={2} className="mgr-nav-item-icon" aria-hidden="true" />{(!collapsed || mobileOpen) && <span className="mgr-nav-label">{tManagerUi(item.labelKey)}</span>}</Link>;
              })}</div>
            </section>;
          })}
        </nav>

        {(!collapsed || mobileOpen) && (
          <div className="mgr-sidebar-footer">
            <div className="mgr-avatar" aria-hidden="true">{tManagerUi('mg')}</div>
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

      {showLogout && (
        <div className="mgr-modal-overlay" role="presentation" onMouseDown={() => setShowLogout(false)}>
          <div ref={logoutDialogRef} tabIndex={-1} className="mgr-modal mgr-logout-modal" role="dialog" data-testid="manager-logout-dialog" aria-modal="true" aria-labelledby="manager-logout-title" onMouseDown={(event) => event.stopPropagation()}>
            <p id="manager-logout-title" className="mgr-modal-title">{tManagerUi('sign_out_unavailable')}</p>
            <p className="mgr-modal-desc" role="status" data-testid="manager-signout-contract-warning">{tManagerUi('actual_sign_out_requires_the_host_authentication_provide_1b9c36')}</p>
            <div className="mgr-modal-footer">
              <button type="button" className="mgr-btn-ghost" data-testid="manager-logout-cancel" onClick={() => setShowLogout(false)}>{tManagerUi('close')}</button>
              <button type="button" className="mgr-btn-danger" disabled title={tManagerUi('sign_out_unavailable_host_authentication_contract_not_su_b8edeb')}>{tManagerUi('sign_out_unavailable')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

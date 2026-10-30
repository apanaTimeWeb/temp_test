'use client';
// Responsibility: responsive admin sidebar presentation and navigation interactions.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LogOut, Menu, X, BookOpen, type LucideIcon } from 'lucide-react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import { ADMIN_SIDEBAR_NAV } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/config/admin_navigation_sidebar_navigation_constants';
import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import type { AdminNavigationSidebarProps } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/types/AdminNavigationSidebarComponentTypes';


const ALL_HREFS = ADMIN_SIDEBAR_NAV.filter((n): n is { href: string; icon: LucideIcon; label: string } => 'href' in n).map(n => n.href);

/**
 * @description Renders role-owned navigation, responsive drawer behavior, and the admin logout confirmation.
 * @dependencies Consumes only role navigation configuration and zero-business dialog primitives.
 * @edge-case Nested routes select the most specific matching navigation entry; mobile drawer closes after navigation.
 */
export function AdminNavigationSidebar({ collapsed: controlledCollapsed, onToggle, mobileOpen: controlledMobileOpen, onMobileClose }: AdminNavigationSidebarProps) {
  const t = useTranslations('ADMIN_NAVIGATION');
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const collapsed = controlledCollapsed ?? internalCollapsed;
  const mobileOpen = controlledMobileOpen ?? internalMobileOpen;
  const closeMobile = useCallback(() => { if (onMobileClose) onMobileClose(); else setInternalMobileOpen(false); }, [onMobileClose]);
  const toggle = onToggle ?? (() => setInternalCollapsed(v => !v));
  const sidebarRef = useRef<HTMLElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!mobileOpen) { previouslyFocusedRef.current?.focus(); previouslyFocusedRef.current = null; return; }
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => sidebarRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    const first = focusable()?.[0]; (first ?? sidebarRef.current)?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeMobile(); return; }
      if (event.key !== 'Tab') return;
      const items = Array.from(focusable() ?? []); if (!items.length) { event.preventDefault(); sidebarRef.current?.focus(); return; }
      const firstItem = items[0], lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) { event.preventDefault(); lastItem.focus(); }
      else if (!event.shiftKey && document.activeElement === lastItem) { event.preventDefault(); firstItem.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen, closeMobile]);

  function isActive(href: string): boolean {
    if (pathname === href) return true;
    if (!href || href === '/' || !pathname.startsWith(href + '/')) return false;
    return !ALL_HREFS.some(other => other !== href && other.startsWith(href) && pathname.startsWith(other));
  }

  const expanded = !collapsed || mobileOpen;

  return (
    <>
      {mobileOpen && <button type="button" className="admin-sidebar-backdrop" onClick={closeMobile} aria-label={t('CLOSE_NAVIGATION')} />}
      <aside ref={sidebarRef} tabIndex={mobileOpen ? -1 : undefined} role={mobileOpen ? 'dialog' : undefined} aria-modal={mobileOpen ? true : undefined} aria-label={mobileOpen ? t('ADMIN_NAVIGATION') : undefined} className={`admin-sidebar ${collapsed ? 'admin-sidebar-collapsed' : 'admin-sidebar-expanded'} ${mobileOpen ? 'admin-sidebar-mobile-open' : ''}`}>
        <div className="admin-sidebar-logo-row">
          <button data-testid="admin_sidebar-AdminNavigationSidebar-control-001" type="button" className="admin-sidebar-toggle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" onClick={mobileOpen ? closeMobile : toggle} aria-label={mobileOpen ? t('CLOSE_SIDEBAR') : t('TOGGLE_SIDEBAR')}>
            {mobileOpen ? <X size={18}  strokeWidth={2}/> : <Menu size={18}  strokeWidth={2}/>}
          </button>
          {expanded && (
            <div className="flex items-center gap-2">
              <div className="admin-sidebar-brand-mark"><BookOpen size={18}  strokeWidth={2}/></div>
              <span className="admin-sidebar-brand text-primary">{ADMIN_BRAND_CONFIG.name} <span className="text-primary">{ADMIN_BRAND_CONFIG.suffix}</span></span>
            </div>
          )}
        </div>
        <nav className="admin-sidebar-nav" aria-label={t('ADMIN_NAVIGATION')}>
          {ADMIN_SIDEBAR_NAV.map((item, i) => {
            if ('group' in item) return collapsed && !mobileOpen ? null : <div key={`group-${i}`} className="admin-sidebar-group">{t(item.groupKey ?? item.group)}</div>;
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link data-testid={`admin_sidebar-AdminNavigationSidebar-link-${item.href.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '')}`} aria-current={active ? 'page' : undefined} key={item.href} href={item.href} title={collapsed && !mobileOpen ? t(item.labelKey ?? item.label) : undefined} onClick={mobileOpen ? closeMobile : undefined} className={`admin-sidebar-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${active ? 'admin-sidebar-link-active' : ''}`}>
                <Icon size={18} strokeWidth={2} className={active ? 'text-primary' : 'text-text-secondary'} aria-hidden="true" />
                {expanded && <span>{t(item.labelKey ?? item.label)}</span>}
              </Link>
            );
          })}
        </nav>
        <div className={`admin-sidebar-footer ${expanded ? 'admin-sidebar-footer-expanded' : 'admin-sidebar-footer-collapsed'}`}>
          {expanded && (
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{t('ADMIN_GREETING')}</p>
              <p className="text-caption text-text-secondary truncate">{t('ADMINISTRATOR')}</p>
            </div>
          )}
          <button data-testid="admin_sidebar-AdminNavigationSidebar-control-003" type="button" className="admin-sidebar-logout focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" aria-label={t('LOG_OUT')} onClick={() => setShowLogout(true)}><LogOut size={expanded ? 18 : 20} /></button>
        </div>
      </aside>
      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent className="max-w-sm bg-overlay border-border">
          <DialogHeader>
            <DialogTitle>{t('LOG_OUT_TITLE')}</DialogTitle>
            <DialogDescription>{t('LOG_OUT_DESCRIPTION')}</DialogDescription>
            <p id="admin-logout-unavailable" role="status" className="text-sm text-text-secondary">{t('LOG_OUT_UNAVAILABLE')}</p>
          </DialogHeader>
          <DialogFooter>
            <button data-testid="admin_sidebar-AdminNavigationSidebar-control-004" type="button" onClick={() => setShowLogout(false)} className="border border-border rounded-md px-4 py-2 text-primary">{t('CANCEL')}</button>
            <button data-testid="admin_sidebar-AdminNavigationSidebar-control-005" type="button" disabled title={t('LOG_OUT_UNAVAILABLE')} aria-describedby="admin-logout-unavailable" className="bg-danger text-on-danger rounded-md px-4 py-2 opacity-60 cursor-not-allowed">{t('LOG_OUT')}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


export type { AdminNavigationSidebarProps };

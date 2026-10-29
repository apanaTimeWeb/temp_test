'use client';
// RESPONSIBILITY: Render the navigation header and its navigation context. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the navigation header and its navigation context. It does not own backend persistence or cross-feature business logic.
import { useLocale, useTranslations } from 'next-intl';

import Link from 'next/link';
import { Bell, Clock, HelpCircle, Menu, ShieldCheck, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MANAGER_NAVIGATION_NAVIGATION_ROUTES } from '@/app/frontend_manager/manager_navigation/navigation/config/manager_navigation_navigation.url_config';
import type { ManagerNavigationHeaderProps } from '@/app/frontend_manager/manager_navigation/navigation/types/ManagerNavigationNavigationComponentTypes';
export type { ManagerNavigationHeaderProps };



export default function ManagerNavigationHeader({ collapsed, onMobileOpen }: ManagerNavigationHeaderProps) {
  const tManagerUi = useTranslations('manager.manager_navigation.ui');
  const locale = useLocale();
  const dateTimeLocale = locale === 'hi' ? 'hi-IN' : 'en-IN';
  const [time, setTime] = useState<Date | null>(null);

// Dependency rationale: the clock interval is mount-scoped and is cleaned up on unmount.
  useEffect(() => {
    const updateTime = () => setTime(new Date());
    updateTime();

    const now = new Date();
    const millisecondsUntilNextMinute = 60_000 - (now.getSeconds() * 1_000 + now.getMilliseconds());
    let interval: number | undefined;
    const alignmentTimeout = window.setTimeout(() => {
      updateTime();
      interval = window.setInterval(updateTime, 60_000);
    }, millisecondsUntilNextMinute);

    return () => {
      window.clearTimeout(alignmentTimeout);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, []);

  const hour = time?.getHours() ?? -1;
  const greeting = hour < 0 ? tManagerUi('greeting_welcome') : hour < 12 ? tManagerUi('greeting_good_morning') : hour < 17 ? tManagerUi('greeting_good_afternoon') : hour < 21 ? tManagerUi('greeting_good_evening') : tManagerUi('greeting_good_night');

  return (
    <header className={`mgr-header${collapsed ? ' mgr-header-collapsed' : ''}`} data-testid="manager-header">
      <div className="mgr-header-left">
        <button type="button" className="mgr-mobile-menu-btn" data-testid="manager-mobile-menu-open" onClick={onMobileOpen} aria-label={tManagerUi('open_menu')}>
          <Menu size={18} strokeWidth={2} />
        </button>
        <div className="mgr-header-titles">
          <span className="mgr-header-branch-name">
            <ShieldCheck size={18} strokeWidth={2} aria-hidden="true" />
            {tManagerUi('library_os')}
          </span>
          {time && (
            <span className="mgr-header-time">
              <Clock size={14} strokeWidth={2} aria-hidden="true" />
              {time.toLocaleTimeString(dateTimeLocale, { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

      </div>

      <div className="mgr-header-right">
        <Link href={MANAGER_NAVIGATION_NAVIGATION_ROUTES.HELP_SUPPORT} className="mgr-help-btn" aria-label={tManagerUi('help_and_support')} title={tManagerUi('help_and_support')}>
          <HelpCircle size={18} strokeWidth={2} />
        </Link>
        <ThemeToggle />
        <Link href={MANAGER_NAVIGATION_NAVIGATION_ROUTES.NOTIFICATIONS} className="mgr-bell-btn" aria-label={tManagerUi('notifications')}>
          <Bell size={18} strokeWidth={2} />
          <span className="mgr-bell-dot" aria-hidden="true" />
        </Link>
        <div className="mgr-avatar-wrapper" aria-label={tManagerUi('manager_account_menu')}>
          <div className="mgr-avatar mgr-avatar-header" aria-hidden="true">
            <User size={18} strokeWidth={2} />
          </div>
          <div className="mgr-avatar-details">
            <span>{greeting}</span>
            <strong>{tManagerUi('manager')}</strong>
          </div>
        </div>
      </div>
    </header>
  );
}

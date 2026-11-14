'use client';
// RESPONSIBILITY: Render the navigation header and its navigation context. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the navigation header and its navigation context. It does not own backend persistence or cross-feature business logic.
import { useLocale, useTranslations } from 'next-intl';

import Link from 'next/link';
import { Bell, Building2, Calendar, ChevronDown, Clock, HelpCircle, LogOut, Menu, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MANAGER_NAVIGATION_NAVIGATION_ROUTES } from '@/app/frontend_manager/manager_navigation/navigation/config/manager_navigation_navigation.url_config';
import type { ManagerNavigationHeaderProps } from '@/app/frontend_manager/manager_navigation/navigation/types/ManagerNavigationNavigationComponentTypes';
import { ManagerNavigationSidebarLogoutModal } from './ManagerNavigationSidebarLogoutModal';
export type { ManagerNavigationHeaderProps };



export default function ManagerNavigationHeader({ collapsed, onMobileOpen }: ManagerNavigationHeaderProps) {
  const tManagerUi = useTranslations('manager.manager_navigation.ui');
  const locale = useLocale();
  const dateTimeLocale = locale === 'hi' ? 'hi-IN' : 'en-IN';
  const [time, setTime] = useState<Date | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    if (!isProfileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

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
    <>
      <header className={`mgr-header${collapsed ? ' mgr-header-collapsed' : ''}`} data-testid="manager-header">
      <div className="mgr-header-left">
        <button type="button" className="mgr-mobile-menu-btn" data-testid="manager-mobile-menu-open" onClick={onMobileOpen} aria-label={tManagerUi('open_menu')}>
          <Menu size={18} strokeWidth={2} />
        </button>
        <div className="mgr-header-titles">
          <div className="mgr-header-branch-pill">
            <Building2 size={16} className="mgr-header-branch-icon" aria-hidden="true" />
            <span className="mgr-header-branch-name">{tManagerUi('central_library') || 'Central Library'}</span>
            <span className="mgr-header-branch-badge">Main Branch</span>
          </div>
          {time && (
            <div className="mgr-header-datetime">
              <span className="mgr-header-date">
                <Calendar size={13} strokeWidth={2} aria-hidden="true" />
                {time.toLocaleDateString(dateTimeLocale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="mgr-header-datetime-separator" aria-hidden="true">•</span>
              <span className="mgr-header-time">
                <Clock size={13} strokeWidth={2} aria-hidden="true" />
                {time.toLocaleTimeString(dateTimeLocale, { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </div>
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
        <div
          ref={profileMenuRef}
          className="mgr-avatar-container"
          onMouseEnter={() => setIsProfileOpen(true)}
          onMouseLeave={() => setIsProfileOpen(false)}
        >
          <button
            type="button"
            className="mgr-avatar-wrapper"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
            aria-label={tManagerUi('manager_account_menu') || 'Manager account menu'}
            data-testid="manager-account-menu-trigger"
          >
            <div className="mgr-avatar mgr-avatar-header" aria-hidden="true">
              <User size={18} strokeWidth={2} />
            </div>
            <div className="mgr-avatar-details">
              <span>{greeting}</span>
              <strong>{tManagerUi('manager')}</strong>
            </div>
            <ChevronDown
              size={13}
              className={`mgr-avatar-chevron ${isProfileOpen ? 'mgr-avatar-chevron--open' : ''}`}
              aria-hidden="true"
            />
          </button>

          {isProfileOpen && (
            <div
              className="mgr-profile-dropdown"
              role="menu"
              aria-label={tManagerUi('manager_account_menu') || 'Manager account menu'}
            >
              <div className="mgr-profile-dropdown-header">
                <div className="mgr-profile-dropdown-avatar" aria-hidden="true">
                  <User size={20} strokeWidth={2.2} />
                </div>
                <div className="mgr-profile-dropdown-meta">
                  <p className="mgr-profile-dropdown-name">{tManagerUi('manager')}</p>
                  <p className="mgr-profile-dropdown-email">{tManagerUi('manager_library_com')}</p>
                  <span className="mgr-profile-dropdown-badge">{tManagerUi('manager')}</span>
                </div>
              </div>

              <div className="mgr-profile-dropdown-divider" />

              <div className="mgr-profile-dropdown-body">
                <div className="mgr-profile-dropdown-status">
                  <span className="mgr-status-pulse-dot" aria-hidden="true" />
                  <span>Online</span>
                </div>
              </div>

              <div className="mgr-profile-dropdown-divider" />

              <div className="mgr-profile-dropdown-footer">
                <button
                  type="button"
                  className="mgr-profile-logout-btn"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setShowLogoutModal(true);
                  }}
                  data-testid="manager-logout-open"
                >
                  <div className="mgr-profile-logout-icon" aria-hidden="true">
                    <LogOut size={16} strokeWidth={2} />
                  </div>
                  <div className="mgr-profile-logout-text">
                    <span className="mgr-profile-logout-label">{tManagerUi('log_out') || 'Log out'}</span>
                    <span className="mgr-profile-logout-sub">Sign out of portal</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

    <ManagerNavigationSidebarLogoutModal
      isOpen={showLogoutModal}
      onClose={() => setShowLogoutModal(false)}
    />
  </>
);
}

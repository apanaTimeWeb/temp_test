'use client';
/** Responsibility: Superadmin Shell Header; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
import type { SuperadminNavigationHeaderProps } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/types/SuperadminNavigationShellTypes';
import { useSuperadminNavigationShellHeaderMenus } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/hooks/useSuperadminNavigationShellHeaderMenus';
import { SUPERADMIN_NAVIGATION_OPEN_COMMAND_PALETTE_EVENT } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellCommandPaletteConstants';
import { Search, Menu, Bell, LogOut, Shield, ChevronDown, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SUPERADMIN_NAVIGATION_PREVIEW_ALERTS } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/mocks/fixtures/SuperadminNavigationShellPreviewAlerts';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { clearAuthState } from '@/lib/auth';
import { SUPERADMIN_NAVIGATION_SHELL_ROUTES as __SUPERADMIN_NAVIGATION_SHELL_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_shell.url_config';
import Link from 'next/link';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
import { toast } from 'sonner';
import SuperadminNavigationShellAlertsDropdown, { type SystemAlert, DEFAULT_SYSTEM_ALERTS } from './SuperadminNavigationShellAlertsDropdown';
import SuperadminNavigationShellSignoutModal from './SuperadminNavigationShellSignoutModal';

export default function SuperadminNavigationShellHeader({ onMenuClick, menuExpanded }: SuperadminNavigationHeaderProps) {
  const t = useTranslations('SUPERADMIN_SHELL');
  const router = useRouter();
  const { notifOpen, setNotifOpen, notifRef, notificationButtonRef } = useSuperadminNavigationShellHeaderMenus();
  const [showLogout, setShowLogout] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [hour, setHour] = useState<number>(-1);
  const [userName, setUserName] = useState<string>('Super Admin');
  const [alerts, setAlerts] = useState<SystemAlert[]>(DEFAULT_SYSTEM_ALERTS);
  const logoutTriggerRef = useRef<HTMLButtonElement | null>(null);
  const accountRef = useRef<HTMLDivElement | null>(null);

  const unreadAlertsCount = alerts.filter(a => a.unread).length;

  const handleMarkAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, unread: false })));
    toast.success('All notifications marked as read');
  };

  const handleMarkAlertRead = (id: string, link?: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, unread: false } : a));
    if (link) {
      setNotifOpen(false);
      router.push(link);
    }
  };

  useEffect(() => {
    setHour(new Date().getHours());
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (
            parsed?.name &&
            typeof parsed.name === 'string' &&
            !parsed.name.includes('.') &&
            !parsed.name.includes('_') &&
            !parsed.name.toUpperCase().startsWith('SUPERADMIN')
          ) {
            setUserName(parsed.name);
          } else {
            setUserName('Super Admin');
          }
        }
      }
    } catch {
      // safe fallback
    }
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (accountRef.current && !accountRef.current.contains(target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close modals & menus on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLogout(false);
        setAccountOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const greeting =
    hour < 0
      ? 'Welcome'
      : hour < 12
        ? 'Good Morning'
        : hour < 17
          ? 'Good Afternoon'
          : hour < 21
            ? 'Good Evening'
            : 'Good Night';

  const handleSignOut = () => {
    try {
      if (typeof window !== 'undefined') {
        clearAuthState();
        localStorage.removeItem('auth_token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('admin_user');
        sessionStorage.clear();
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
        document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
      }
    } catch {
      // safe fallback
    }
    setShowLogout(false);
    router.push(__SUPERADMIN_NAVIGATION_SHELL_ROUTES.SUPERADMIN_NAVIGATION_URLS.AUTH_LOGIN);
  };

  return (
    <header className="sa-header">
      {/* ─── Left: Hamburger + Scope Pill + Search ─── */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="sa-mobile-menu-btn"
          onClick={onMenuClick}
          aria-label={t('COPY.TOGGLE_NAVIGATION_MENU')}
          aria-expanded={menuExpanded}
          aria-controls="superadmin-primary-navigation"
          data-testid="superadmin-navigation-header-toggle-menu-1"
        >
          <Menu size={18} aria-hidden="true" />
        </button>

        {/* Search Command Palette Trigger */}
        <button
          type="button"
          className="sa-header-search group relative text-left"
          onClick={() => window.dispatchEvent(new CustomEvent(SUPERADMIN_NAVIGATION_OPEN_COMMAND_PALETTE_EVENT))}
          aria-haspopup="dialog"
          aria-label={t('COPY.OPEN_COMMAND_PALETTE')}
          data-testid="superadmin-navigation-header-open-command-palette-2"
        >
          <Search size={15} aria-hidden="true" className="text-slate-400 group-hover:text-indigo-400 motion-safe:transition-colors shrink-0" />
          <span className="sa-command-palette-trigger-label text-xs text-slate-400 w-full truncate">{t('COPY.SEARCH_OR_JUMP_TO')}</span>
          <span className="sa-command-palette-trigger-shortcut absolute right-2.5 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 bg-white/[0.06] border border-white/10 rounded px-1.5 py-0.5 pointer-events-none">
            <span className="text-[10px] font-semibold text-slate-400">Ctrl K</span>
          </span>
        </button>
      </div>

      {/* ─── Right: Theme + Notifs + Account Profile ─── */}
      <div className="sa-header-right flex items-center gap-3">
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            ref={notificationButtonRef}
            type="button"
            className="sa-header-notif-btn relative cursor-pointer"
            aria-label={unreadAlertsCount > 0 ? `${unreadAlertsCount} unread system notifications` : 'System notifications'}
            aria-expanded={notifOpen}
            aria-controls="superadmin-notifications-dropdown"
            onClick={() => setNotifOpen(!notifOpen)}
            data-testid="superadmin-navigation-header-notifications-8"
          >
            <Bell size={18} aria-hidden="true" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 px-1 text-[10px] font-bold text-white shadow-md shadow-indigo-500/50 ring-2 ring-[#080b1a]">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <SuperadminNavigationShellAlertsDropdown
              alerts={alerts}
              unreadAlertsCount={unreadAlertsCount}
              onMarkAllRead={handleMarkAllRead}
              onMarkAlertRead={handleMarkAlertRead}
              onClose={() => setNotifOpen(false)}
              t={t}
            />
          )}
        </div>

        {/* Account Avatar with Dynamic Greeting & Dropdown */}
        <div
          className="relative"
          ref={accountRef}
          onMouseEnter={() => setAccountOpen(true)}
          onMouseLeave={() => setAccountOpen(false)}
        >
          <button
            type="button"
            className="sa-avatar-wrapper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            onClick={() => setAccountOpen(o => !o)}
            aria-expanded={accountOpen}
            aria-haspopup="true"
            aria-label={t('COPY.SUPER_ADMIN')}
            data-testid="superadmin-navigation-header-account-11"
          >
            <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-950/50 shrink-0" aria-hidden="true">
              <Shield size={17} strokeWidth={2.2} />
            </div>
            <div className="sa-avatar-details hidden sm:flex">
              <span>{greeting}</span>
              <strong>{userName}</strong>
            </div>
            <ChevronDown
              size={13}
              className={`sa-avatar-chevron ${accountOpen ? 'sa-avatar-chevron--open' : ''}`}
              aria-hidden="true"
            />
          </button>

          {accountOpen && (
            <div className="sa-header-account-dropdown" role="menu">
              <div className="p-3 border-b border-white/[0.08] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                  <Shield size={20} strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{userName}</p>
                  <p className="text-[11px] text-slate-400 truncate">superadmin@library.com</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 py-2 px-3 text-xs border-b border-white/[0.08]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Role:</span>
                  <span className="font-semibold text-amber-400">Platform Owner</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Status:</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>

              <Link
                href={SUPERADMIN_NAVIGATION_ROUTES.profile_overview}
                className="sa-header-account-item"
                onClick={() => setAccountOpen(false)}
                data-testid="superadmin-navigation-header-profile-12"
              >
                <User size={14} strokeWidth={2} />
                <span>{t('COPY.MY_PROFILE')}</span>
              </Link>

              <div className="sa-header-account-divider" />

              <button
                type="button"
                className="sa-header-account-item sa-header-account-item--danger"
                onClick={(e) => {
                  logoutTriggerRef.current = e.currentTarget as HTMLButtonElement;
                  setAccountOpen(false);
                  setShowLogout(true);
                }}
                data-testid="superadmin-navigation-header-logout-13"
              >
                <LogOut size={14} strokeWidth={2} />
                <span>{t('COPY.LOG_OUT')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout confirm modal (Admin Parity Design) */}
      <SuperadminNavigationShellSignoutModal
        show={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleSignOut}
        userName={userName}
        t={t}
      />
    </header>
  );
}

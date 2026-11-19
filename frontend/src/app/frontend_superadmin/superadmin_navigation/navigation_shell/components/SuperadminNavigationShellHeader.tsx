'use client';
/** Responsibility: Superadmin Shell Header; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
import type { SuperadminNavigationHeaderProps } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/types/SuperadminNavigationShellTypes';
import { useSuperadminNavigationShellHeaderMenus } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/hooks/useSuperadminNavigationShellHeaderMenus';
import { SUPERADMIN_NAVIGATION_OPEN_COMMAND_PALETTE_EVENT } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellCommandPaletteConstants';
import { Search, Menu, Bell, CheckCircle, AlertTriangle, Zap, LogOut, Shield, ChevronDown, User, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SUPERADMIN_NAVIGATION_PREVIEW_ALERTS } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/mocks/fixtures/SuperadminNavigationShellPreviewAlerts';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { clearAuthState } from '@/lib/auth';
import { SUPERADMIN_NAVIGATION_SHELL_ROUTES as __SUPERADMIN_NAVIGATION_SHELL_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_shell.url_config';
import Link from 'next/link';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

interface SystemAlert {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: 'success' | 'danger' | 'primary' | 'warning';
  unread: boolean;
  link?: string;
}

const DEFAULT_SYSTEM_ALERTS: SystemAlert[] = [
  {
    id: 'notif-1',
    title: 'Platform Deployment Complete',
    description: 'Core microservices deployed to cluster with 99.98% uptime.',
    time: '12m ago',
    tone: 'success',
    unread: true,
    link: SUPERADMIN_NAVIGATION_ROUTES.system_health_overview,
  },
  {
    id: 'notif-2',
    title: 'Security Alert: New IP Range',
    description: 'Anomalous login attempt mitigated by cloud firewall rules.',
    time: '45m ago',
    tone: 'danger',
    unread: true,
    link: SUPERADMIN_NAVIGATION_ROUTES.security_threats,
  },
  {
    id: 'notif-3',
    title: 'Automated Database Backup Saved',
    description: 'Full database snapshot safely encrypted and stored in secondary region.',
    time: '2h ago',
    tone: 'primary',
    unread: false,
    link: SUPERADMIN_NAVIGATION_ROUTES.backup_overview,
  },
  {
    id: 'notif-4',
    title: 'New Branch Onboarded',
    description: 'Apex Digital Library branch launched into production tier.',
    time: '4h ago',
    tone: 'success',
    unread: false,
    link: SUPERADMIN_NAVIGATION_ROUTES.libraries_overview,
  },
];

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
            <div
              id="superadmin-notifications-dropdown"
              role="region"
              aria-label={t('COPY.SAMPLE_SYSTEM_ALERTS_2')}
              className="sa-notif-dropdown"
            >
              {/* Header */}
              <div className="sa-notif-dropdown-header flex items-center justify-between p-3.5 border-b border-indigo-500/20 bg-[#0c102b]/95">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-white">Platform Alerts</span>
                  {unreadAlertsCount > 0 ? (
                    <span className="rounded-full bg-indigo-500/20 border border-indigo-500/40 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                      {unreadAlertsCount} New
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                      All caught up
                    </span>
                  )}
                </div>
                {unreadAlertsCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    data-testid="superadmin-navigation-header-mark-read-9"
                  >
                    <CheckCircle size={12} />
                    {t('COPY.MARK_READ')}
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="sa-notif-list max-h-72 overflow-y-auto divide-y divide-white/5">
                {alerts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active notifications
                  </div>
                ) : (
                  alerts.map((alert) => {
                    const Icon = alert.tone === 'success' ? CheckCircle : alert.tone === 'danger' ? AlertTriangle : Zap;
                    const toneColors = {
                      success: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
                      danger: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
                      primary: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
                      warning: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
                    }[alert.tone];

                    return (
                      <div
                        key={alert.id}
                        onClick={() => handleMarkAlertRead(alert.id, alert.link)}
                        className={`sa-notif-item p-3.5 hover:bg-white/[0.04] transition-all cursor-pointer flex gap-3 text-left ${
                          alert.unread ? 'sa-notif-item--unread bg-indigo-500/[0.06]' : ''
                        }`}
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border mt-0.5 ${toneColors}`}>
                          <Icon size={15} />
                        </div>
                        <div className="sa-notif-item-content min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <p className={`sa-notif-item-title text-xs font-semibold truncate ${alert.unread ? 'text-white' : 'text-slate-300'}`}>
                              {alert.title}
                            </p>
                            <span className="sa-notif-item-time text-[10px] text-slate-400 shrink-0 font-mono">
                              {alert.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {alert.description}
                          </p>
                        </div>
                        {alert.unread && (
                          <div className="sa-notif-unread-dot self-center">
                            <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/80 animate-pulse" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="sa-notif-dropdown-footer p-3 border-t border-indigo-500/20 bg-[#0c102b]/60 flex items-center justify-between">
                <Link
                  href={SUPERADMIN_NAVIGATION_ROUTES.audit_logs}
                  onClick={() => setNotifOpen(false)}
                  className="sa-panel-view-all w-full text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 py-1 transition-colors"
                  data-testid="superadmin-navigation-header-view-logs-10"
                >
                  {t('COPY.VIEW_ALL_LOGS')} →
                </Link>
              </div>
            </div>
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
      {showLogout && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="superadmin-logout-title"
          aria-describedby="superadmin-logout-description"
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          data-testid="superadmin-logout-overlay"
        >
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
            onClick={() => setShowLogout(false)}
            aria-hidden="true"
          />
          <section
            className="relative z-10 w-full max-w-sm rounded-2xl border border-indigo-500/30 bg-[#0b0c20] p-6 text-white shadow-2xl animate-in zoom-in-95 fade-in duration-200 focus:outline-none"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="superadmin-logout-title"
            aria-describedby="superadmin-logout-description"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                setShowLogout(false);
              }
            }}
            data-testid="superadmin-superadmin-navigation-shell-sidebar-section-line-75"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-3">
                <LogOut size={24} strokeWidth={2.2} />
              </div>
              <h2 id="superadmin-logout-title" className="text-white text-lg font-bold text-center">
                {t('COPY.LOG_OUT_2')}
              </h2>
              <p id="superadmin-logout-description" className="text-slate-400 text-sm mt-1 text-center">
                {t('COPY.ARE_YOU_SURE_YOU_WANT_TO_LOG_OUT_OF_THE_SUPER_ADMIN_PANEL')}
              </p>
            </div>

            <div className="my-4 rounded-xl bg-white/[0.03] border border-white/5 p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
                <Shield size={20} strokeWidth={2.2} />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{userName}</p>
                <p className="text-[11px] text-slate-400 truncate">superadmin@library.com</p>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded px-1.5 py-0.5">
                SUPER ADMIN
              </span>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2.5">
              <button
                type="button"
                autoFocus
                onClick={() => setShowLogout(false)}
                className="border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
              >
                {t('COPY.CANCEL')}
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <LogOut size={14} strokeWidth={2} />
                <span>{t('COPY.LOG_OUT')}</span>
              </button>
            </div>
          </section>
        </div>,
        document.body
      )}
    </header>
  );
}

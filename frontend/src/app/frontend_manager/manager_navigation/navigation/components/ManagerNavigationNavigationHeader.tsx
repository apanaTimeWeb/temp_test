'use client';
// RESPONSIBILITY: Render the navigation header and its navigation context. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import Link from 'next/link';
import { Bell, Building2, ChevronDown, ChevronRight, LogOut, Menu, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MANAGER_NAVIGATION_NAVIGATION_ROUTES } from '@/app/frontend_manager/manager_navigation/navigation/config/manager_navigation_navigation.url_config';
import type { ManagerNavigationHeaderProps } from '@/app/frontend_manager/manager_navigation/navigation/types/ManagerNavigationNavigationComponentTypes';
import { ManagerNavigationSidebarLogoutModal } from './ManagerNavigationSidebarLogoutModal';
export type { ManagerNavigationHeaderProps };

export interface ManagerHeaderNotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: string;
  priority: 'high' | 'medium' | 'info';
  read: boolean;
  branch: string;
}

const DEFAULT_MANAGER_NOTIFICATIONS: ManagerHeaderNotificationItem[] = [
  {
    id: 'mgr-notif-1',
    title: 'Desk Admission Approval',
    description: 'New student admission registered for Desk #22 (Morning Shift).',
    time: '15m ago',
    category: 'Members',
    priority: 'high',
    read: false,
    branch: 'Central Library',
  },
  {
    id: 'mgr-notif-2',
    title: 'Daily Cash Handover',
    description: 'Shift closing cash handover pending counter verification.',
    time: '1h ago',
    category: 'Settlement',
    priority: 'high',
    read: false,
    branch: 'Central Library',
  },
  {
    id: 'mgr-notif-3',
    title: 'Desk Maintenance Ticket',
    description: 'Locker #08 latch fix marked resolved by technician.',
    time: '2h ago',
    category: 'Maintenance',
    priority: 'medium',
    read: false,
    branch: 'Central Library',
  },
  {
    id: 'mgr-notif-4',
    title: 'Member Attendance Notice',
    description: 'Biometric scan sync completed for Morning Shift.',
    time: '1d ago',
    category: 'Attendance',
    priority: 'info',
    read: true,
    branch: 'Central Library',
  },
];

export default function ManagerNavigationHeader({ collapsed, onMobileOpen }: ManagerNavigationHeaderProps) {
  const tManagerUi = useTranslations('manager.manager_navigation.ui');
  const [hour, setHour] = useState<number>(-1);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<ManagerHeaderNotificationItem[]>(DEFAULT_MANAGER_NOTIFICATIONS);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  useEffect(() => {
    setHour(new Date().getHours());
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus and modal when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLogoutModal(false);
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        </div>
      </div>

      <div className="mgr-header-right">
        <ThemeToggle />

        {/* Notifications Popover */}
        <div ref={notificationsMenuRef} className="relative">
          <button
            type="button"
            className="mgr-bell-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            onClick={() => {
              setIsNotificationsOpen((prev) => !prev);
              setIsProfileOpen(false);
            }}
            aria-expanded={isNotificationsOpen}
            aria-haspopup="true"
            aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : (tManagerUi('notifications') || 'Notifications')}
            title={unreadCount > 0 ? `${unreadCount} unread notifications` : (tManagerUi('notifications') || 'Notifications')}
            data-testid="manager-bell-btn"
          >
            <Bell size={18} strokeWidth={2} aria-hidden="true" />
            {unreadCount > 0 && <span className="mgr-bell-dot" aria-hidden="true" />}
          </button>

          {isNotificationsOpen && (
            <div
              className="mgr-notifications-dropdown"
              role="region"
              aria-label="Notifications Dropdown"
              data-testid="manager-notifications-dropdown"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-indigo-500/20 bg-indigo-950/40">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-white">
                    Notifications
                  </span>
                  {unreadCount > 0 ? (
                    <span className="rounded-full bg-indigo-500/20 border border-indigo-500/40 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                      {unreadCount} New
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                      All caught up
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleMarkAsRead(item.id)}
                    className={`p-3.5 hover:bg-white/[0.04] transition-colors cursor-pointer flex gap-3 text-left ${
                      !item.read ? 'bg-indigo-500/[0.06]' : ''
                    }`}
                  >
                    <div className="mt-1 shrink-0">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          !item.read
                            ? item.priority === 'high'
                              ? 'bg-rose-400 shadow-sm shadow-rose-400/50'
                              : 'bg-indigo-400 shadow-sm shadow-indigo-400/50'
                            : 'bg-slate-600'
                        }`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className={`text-xs font-semibold truncate ${!item.read ? 'text-white' : 'text-slate-300'}`}>
                          {item.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
                          {item.branch}
                        </span>
                        <span className="text-[10px] text-indigo-400/80 font-medium">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer: View All in Notification Center */}
              <div className="p-2 border-t border-indigo-500/20 bg-indigo-950/30">
                <Link
                  href={MANAGER_NAVIGATION_NAVIGATION_ROUTES.NOTIFICATIONS}
                  onClick={() => setIsNotificationsOpen(false)}
                  data-testid="manager-notifications-view-all"
                  className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 rounded-xl transition-all"
                >
                  <span>View All in Notification Center</span>
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div
          ref={profileMenuRef}
          className="mgr-avatar-container"
          onMouseEnter={() => {
            setIsProfileOpen(true);
            setIsNotificationsOpen(false);
          }}
          onMouseLeave={() => setIsProfileOpen(false)}
        >
          <button
            type="button"
            className="mgr-avatar-wrapper"
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setIsNotificationsOpen(false);
            }}
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
              <strong>Ram</strong>
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
                  <p className="mgr-profile-dropdown-name">Ram</p>
                  <p className="mgr-profile-dropdown-email">manager@library.com</p>
                </div>
              </div>

              <div className="mgr-profile-dropdown-divider" />

              <div className="mgr-profile-dropdown-info">
                <div className="mgr-profile-info-row">
                  <span className="mgr-profile-info-label">Role:</span>
                  <span className="mgr-profile-info-value">Manager</span>
                </div>
                <div className="mgr-profile-info-row">
                  <span className="mgr-profile-info-label">Status:</span>
                  <span className="mgr-profile-status-pill">
                    <span className="mgr-status-pulse-dot" aria-hidden="true" />
                    Online
                  </span>
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
                  <LogOut size={14} strokeWidth={2} />
                  <span>{tManagerUi('log_out') || 'Log out'}</span>
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

'use client';
// RESPONSIBILITY: Render the navigation header and its navigation context. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import {
  ManagerNavigationNotificationsPopover,
  type ManagerHeaderNotificationItem,
} from '@/app/frontend_manager/manager_navigation/navigation/components/ManagerNavigationNotificationsPopover';
import { ManagerNavigationSidebarLogoutModal } from '@/app/frontend_manager/manager_navigation/navigation/components/ManagerNavigationSidebarLogoutModal';
import type { ManagerNavigationHeaderProps } from '@/app/frontend_manager/manager_navigation/navigation/types/ManagerNavigationNavigationComponentTypes';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Building2, ChevronDown, LogOut, Menu, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
export type { ManagerHeaderNotificationItem, ManagerNavigationHeaderProps };

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
    toast.success('All notifications marked as read', { id: 'manager-header-mark-all-read' });
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

        <ManagerNavigationNotificationsPopover
          menuRef={notificationsMenuRef}
          isOpen={isNotificationsOpen}
          notifications={notifications}
          unreadCount={unreadCount}
          onToggleOpen={() => {
            setIsNotificationsOpen((prev) => !prev);
            setIsProfileOpen(false);
          }}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAllAsRead={handleMarkAllAsRead}
          onMarkAsRead={handleMarkAsRead}
        />

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

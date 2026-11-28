'use client';

// RESPONSIBILITY: AdminShellNotificationsMenu component owned by application_infrastructure_components.

import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import { Bell, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { RefObject } from 'react';

export interface AdminShellHeaderNotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: string;
  priority: 'high' | 'medium' | 'info';
  read: boolean;
  branch: string;
}

interface AdminShellNotificationsMenuLabels {
  title: string;
  dropdownLabel: string;
  unreadAriaLabel: string;
  newBadgeSuffix: string;
  allCaughtUp: string;
  markAllRead: string;
  viewAll: string;
}

interface AdminShellNotificationsMenuProps {
  menuRef: RefObject<HTMLDivElement>;
  isOpen: boolean;
  notifications: AdminShellHeaderNotificationItem[];
  unreadCount: number;
  labels?: Partial<AdminShellNotificationsMenuLabels>;
  onToggleOpen: () => void;
  onClose: () => void;
  onMarkAllRead: () => void;
  onMarkAsRead: (id: string) => void;
}

export function AdminShellNotificationsMenu({
  menuRef,
  isOpen,
  notifications,
  unreadCount,
  labels,
  onToggleOpen,
  onClose,
  onMarkAllRead,
  onMarkAsRead,
}: AdminShellNotificationsMenuProps) {
  const titleLabel = labels?.title ?? 'Notifications';
  const dropdownLabel = labels?.dropdownLabel ?? 'Notifications Dropdown';
  const ariaLabel =
    labels?.unreadAriaLabel ??
    (unreadCount > 0 ? `${unreadCount} unread notifications` : titleLabel);
  const newBadgeSuffix = labels?.newBadgeSuffix ?? 'New';
  const allCaughtUpLabel = labels?.allCaughtUp ?? 'All caught up';
  const markAllReadLabel = labels?.markAllRead ?? 'Mark all read';
  const viewAllLabel = labels?.viewAll ?? 'View All in Notification Center';

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        data-testid="admin_header-AdminShellHeader-control-002"
        className="admin-bell-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        onClick={onToggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={ariaLabel}
        title={ariaLabel}
      >
        <Bell size={18} strokeWidth={2} aria-hidden="true" />
        {unreadCount > 0 && <span className="admin-bell-dot" aria-hidden="true" />}
      </button>

      {isOpen && (
        <div
          className="admin-notifications-dropdown"
          role="region"
          aria-label={dropdownLabel}
          data-testid="admin-notifications-dropdown"
        >
          <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                {titleLabel}
              </span>
              {unreadCount > 0 ? (
                <span className="rounded-full border border-border-focus bg-primary-subtle px-2 py-0.5 text-micro font-semibold text-primary">
                  {unreadCount} {newBadgeSuffix}
                </span>
              ) : (
                <span className="rounded-full border border-border bg-surface-highlight px-2 py-0.5 text-micro font-medium text-text-secondary">
                  {allCaughtUpLabel}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-caption font-medium text-primary hover:underline cursor-pointer motion-safe:transition-colors"
              >
                {markAllReadLabel}
              </button>
            )}
          </div>

          <div className="max-h-72 divide-y divide-border overflow-y-auto">
            {notifications.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onMarkAsRead(item.id)}
                className={`flex w-full cursor-pointer gap-3 p-3.5 text-left hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary motion-safe:transition-colors ${
                  !item.read ? 'bg-surface-highlight' : ''
                }`}
              >
                <div className="mt-1 shrink-0">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      !item.read
                        ? item.priority === 'high'
                          ? 'bg-danger'
                          : 'bg-primary'
                        : 'bg-text-disabled'
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center justify-between gap-1">
                    <p className={`truncate text-xs font-semibold ${!item.read ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {item.title}
                    </p>
                    <span className="shrink-0 font-mono text-micro text-text-secondary">
                      {item.time}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-caption leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="rounded border border-border bg-card px-1.5 py-0.5 text-micro font-medium text-text-secondary">
                      {item.branch}
                    </span>
                    <span className="text-micro font-medium text-primary">
                      {item.category}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-border bg-card p-2">
            <Link
              href={ADMIN_ROUTES.COMMUNICATION_NOTIFICATION_CENTER}
              onClick={onClose}
              data-testid="admin-notifications-view-all"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold text-primary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
            >
              <span>{viewAllLabel}</span>
              <ChevronRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

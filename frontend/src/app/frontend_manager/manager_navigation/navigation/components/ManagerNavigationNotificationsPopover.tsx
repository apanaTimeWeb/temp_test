'use client';

import { MANAGER_NAVIGATION_NAVIGATION_ROUTES } from '@/app/frontend_manager/manager_navigation/navigation/config/manager_navigation_navigation.url_config';
import { Bell, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import type { RefObject } from 'react';

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

interface ManagerNavigationNotificationsPopoverProps {
  menuRef: RefObject<HTMLDivElement>;
  isOpen: boolean;
  notifications: ManagerHeaderNotificationItem[];
  unreadCount: number;
  onToggleOpen: () => void;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
}

export function ManagerNavigationNotificationsPopover({
  menuRef,
  isOpen,
  notifications,
  unreadCount,
  onToggleOpen,
  onClose,
  onMarkAllAsRead,
  onMarkAsRead,
}: ManagerNavigationNotificationsPopoverProps) {
  const tManagerUi = useTranslations('manager.manager_navigation.ui');

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className="mgr-bell-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        onClick={onToggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : (tManagerUi('notifications') || 'Notifications')}
        title={unreadCount > 0 ? `${unreadCount} unread notifications` : (tManagerUi('notifications') || 'Notifications')}
        data-testid="manager-bell-btn"
      >
        <Bell size={18} strokeWidth={2} aria-hidden="true" />
        {unreadCount > 0 && <span className="mgr-bell-dot" aria-hidden="true" />}
      </button>

      {isOpen && (
        <div
          className="mgr-notifications-dropdown"
          role="region"
          aria-label="Notifications Dropdown"
          data-testid="manager-notifications-dropdown"
        >
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
                onClick={onMarkAllAsRead}
                className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 motion-safe:transition-colors cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onMarkAsRead(item.id)}
                className={`p-3.5 hover:bg-white/[0.04] motion-safe:transition-colors cursor-pointer flex gap-3 text-left ${
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

          <div className="p-2 border-t border-indigo-500/20 bg-indigo-950/30">
            <Link
              href={MANAGER_NAVIGATION_NAVIGATION_ROUTES.NOTIFICATIONS}
              onClick={onClose}
              data-testid="manager-notifications-view-all"
              className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 rounded-xl motion-safe:transition-all"
            >
              <span>View All in Notification Center</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

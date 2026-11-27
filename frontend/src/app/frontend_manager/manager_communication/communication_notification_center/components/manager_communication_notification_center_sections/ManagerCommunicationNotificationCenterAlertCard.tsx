'use client';

import { Bell, Check, Clock, Eye, EyeOff, Trash2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

export interface SystemNotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: typeof Bell;
  borderClass: string;
  badgeClass: string;
  iconBox: string;
  activeFill: string;
  activeBg?: string;
  activeBorder?: string;
  activeGlow?: string;
  tag: string;
  category: 'admissions' | 'maintenance' | 'security';
  isRead: boolean;
}

interface ManagerCommunicationNotificationCenterAlertCardProps {
  notification: SystemNotificationItem;
  isSelected: boolean;
  onCardClick: (id: string) => void;
  onToggleRead: (id: string, e?: React.MouseEvent) => void;
  onDelete: (id: string, e?: React.MouseEvent) => void;
}

/** Interactive expandable system alert item with read toggle and dismiss controls. */
export function ManagerCommunicationNotificationCenterAlertCard({
  notification,
  isSelected,
  onCardClick,
  onToggleRead,
  onDelete,
}: ManagerCommunicationNotificationCenterAlertCardProps) {
  return (
    <article
      onClick={() => onCardClick(notification.id)}
      style={
        isSelected
          ? {
              backgroundColor: notification.activeBg,
              borderColor: notification.activeBorder,
              boxShadow: notification.activeGlow,
            }
          : undefined
      }
      className={`relative flex flex-col p-4 sm:p-5 rounded-2xl border motion-safe:transition-all cursor-pointer ${
        notification.borderClass
      } ${
        isSelected
          ? notification.activeFill
          : notification.isRead
            ? 'bg-card border-border opacity-75 hover:opacity-100 hover:border-border-focus'
            : 'bg-card border-border hover:border-border-focus hover:shadow-xs'
      }`}
      aria-selected={isSelected}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${notification.iconBox}`}>
            <notification.icon size={18} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className={`text-sm sm:text-base font-bold ${notification.isRead ? 'text-secondary font-medium' : 'text-primary'}`}>
                {notification.title}
              </h4>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${notification.badgeClass}`}>
                {notification.tag}
              </span>
              {!notification.isRead && (
                <span className="w-2 h-2 rounded-full bg-indigo-500 motion-safe:animate-pulse" title="Unread" />
              )}
            </div>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">{notification.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <div className="flex items-center gap-1.5 text-xs text-secondary font-medium">
            <Clock size={12} className="opacity-70" />
            <span>{notification.time}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => onToggleRead(notification.id, e)}
              className="p-1.5 rounded-lg border border-border bg-card text-secondary hover:text-primary hover:border-border-focus hover:bg-surface-hover motion-safe:transition-colors cursor-pointer"
              title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
              aria-label="Toggle read status"
            >
              {notification.isRead ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>

            <button
              type="button"
              onClick={(e) => onDelete(notification.id, e)}
              className="p-1.5 rounded-lg border border-border bg-card text-secondary hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 motion-safe:transition-colors cursor-pointer"
              title="Dismiss alert"
              aria-label="Dismiss notification"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="mt-3.5 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-secondary">
            Status:{' '}
            <strong className={notification.isRead ? 'text-secondary' : 'text-primary'}>
              {notification.isRead ? 'Read' : 'Active Unread'}
            </strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toast.success(`Action resolved for: "${notification.title}"`, {
                  id: `manager-notif-resolve-${notification.id}`,
                });
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg bg-primary text-primary-foreground hover:opacity-95 cursor-pointer shadow-xs"
            >
              <Check size={12} />
              <span>Take Action</span>
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

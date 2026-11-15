'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckCircle2,
  CheckCheck,
  Trash2,
  Check,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

interface SystemNotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: typeof Bell;
  borderClass: string;
  badgeClass: string;
  iconBox: string;
  activeFill: string;
  tag: string;
  category: 'admissions' | 'maintenance' | 'security';
  isRead: boolean;
}

export function ManagerCommunicationNotificationCenterMyNotificationsSection() {
  const tManagerUi = useTranslations('manager.manager_notification_center.ui');

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>('notif-1');
  const [notificationList, setNotificationList] = useState<SystemNotificationItem[]>([
    {
      id: 'notif-1',
      title: tManagerUi('sample_notification_student_enrollment_title'),
      desc: tManagerUi('sample_notification_student_enrollment_desc'),
      time: tManagerUi('sample_notification_time_ten_minutes_ago'),
      icon: Bell,
      borderClass: 'border-l-4 border-l-emerald-500',
      badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      iconBox: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      activeFill: 'border-emerald-500',
      activeBg: 'rgba(16, 185, 129, 0.18)',
      activeBorder: '#10b981',
      activeGlow: '0 0 16px rgba(16, 185, 129, 0.35)',
      tag: 'Admissions',
      category: 'admissions',
      isRead: false,
    },
    {
      id: 'notif-2',
      title: tManagerUi('sample_notification_server_maintenance_title'),
      desc: tManagerUi('sample_notification_server_maintenance_desc'),
      time: tManagerUi('sample_notification_time_two_hours_ago'),
      icon: AlertTriangle,
      borderClass: 'border-l-4 border-l-amber-500',
      badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      iconBox: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      activeFill: 'border-amber-500',
      activeBg: 'rgba(245, 158, 11, 0.18)',
      activeBorder: '#f59e0b',
      activeGlow: '0 0 16px rgba(245, 158, 11, 0.35)',
      tag: 'Maintenance',
      category: 'maintenance',
      isRead: false,
    },
    {
      id: 'notif-3',
      title: tManagerUi('sample_notification_payment_gateway_title'),
      desc: tManagerUi('sample_notification_payment_gateway_desc'),
      time: tManagerUi('sample_notification_time_yesterday'),
      icon: ShieldAlert,
      borderClass: 'border-l-4 border-l-rose-500',
      badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      iconBox: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      activeFill: 'border-rose-500',
      activeBg: 'rgba(244, 63, 94, 0.18)',
      activeBorder: '#f43f5e',
      activeGlow: '0 0 16px rgba(244, 63, 94, 0.35)',
      tag: 'Security & Billing',
      category: 'security',
      isRead: false,
    },
  ]);

  const unreadCount = notificationList.filter((n) => !n.isRead).length;

  const handleToggleRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotificationList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isRead;
          toast.info(nextState ? 'Marked as read' : 'Marked as unread');
          return { ...item, isRead: nextState };
        }
        return item;
      })
    );
  };

  const handleMarkAllRead = () => {
    setNotificationList((prev) => prev.map((item) => ({ ...item, isRead: true })));
    toast.success('All system notifications marked as read');
  };

  const handleDeleteNotification = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotificationList((prev) => prev.filter((item) => item.id !== id));
    if (selectedNotificationId === id) {
      setSelectedNotificationId(null);
    }
    toast.success('Notification dismissed');
  };

  const handleCardClick = (id: string) => {
    setSelectedNotificationId(id === selectedNotificationId ? null : id);
  };

  const filteredNotifications = notificationList.filter((item) => {
    if (activeCategory === 'unread') return !item.isRead;
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const CATEGORY_CHIPS = [
    {
      id: 'all',
      label: 'All Alerts',
      count: notificationList.length,
      activeBg: 'rgba(99, 102, 241, 0.22)',
      activeBorder: '#6366f1',
      activeText: '#e0e7ff',
      activeGlow: '0 0 14px rgba(99, 102, 241, 0.45)',
    },
    {
      id: 'unread',
      label: 'Unread',
      count: unreadCount,
      activeBg: 'rgba(99, 102, 241, 0.25)',
      activeBorder: '#6366f1',
      activeText: '#e0e7ff',
      activeGlow: '0 0 16px rgba(99, 102, 241, 0.5)',
    },
    {
      id: 'admissions',
      label: 'Admissions',
      activeBg: 'rgba(16, 185, 129, 0.25)',
      activeBorder: '#10b981',
      activeText: '#d1fae5',
      activeGlow: '0 0 16px rgba(16, 185, 129, 0.5)',
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      activeBg: 'rgba(245, 158, 11, 0.25)',
      activeBorder: '#f59e0b',
      activeText: '#fef3c7',
      activeGlow: '0 0 16px rgba(245, 158, 11, 0.5)',
    },
    {
      id: 'security',
      label: 'Security',
      activeBg: 'rgba(244, 63, 94, 0.25)',
      activeBorder: '#f43f5e',
      activeText: '#ffe4e6',
      activeGlow: '0 0 16px rgba(244, 63, 94, 0.5)',
    },
  ];

  return (
    <div className="motion-safe:transition-all motion-safe:duration-base space-y-5 max-w-4xl">
      {/* Header with Live Counter and Mark All Read Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
            <span>{tManagerUi('my_system_notifications')}</span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse">
                {unreadCount} New
              </span>
            )}
          </h2>
          <p className="text-xs text-secondary mt-0.5">
            Operational alerts, automated reminders, and system broadcast feeds. Click any box to inspect.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer"
            >
              <CheckCheck size={14} />
              <span>Mark all as read</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Category Filter Pills (Color Fills On Click) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-secondary font-medium shrink-0 flex items-center gap-1 mr-1">
          <Filter size={12} />
          <span>Filter:</span>
        </span>
        {CATEGORY_CHIPS.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              style={
                isSelected
                  ? {
                      backgroundColor: cat.activeBg,
                      borderColor: cat.activeBorder,
                      color: cat.activeText,
                      boxShadow: cat.activeGlow,
                    }
                  : undefined
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                isSelected
                  ? 'font-bold'
                  : 'bg-card/60 border-border text-secondary hover:text-primary hover:bg-card hover:border-border-focus'
              }`}
            >
              <span>{cat.label}</span>
              {typeof cat.count === 'number' && (
                <span
                  style={
                    isSelected
                      ? {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          borderColor: cat.activeBorder,
                        }
                      : undefined
                  }
                  className={`text-[10px] px-1.5 py-0.2 rounded-full border ${
                    isSelected
                      ? ''
                      : 'bg-surface border-border text-secondary'
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification List with Box Click-To-Fill Selection */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card/40">
            <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2 opacity-80" />
            <h4 className="text-sm font-bold text-primary">No notifications found</h4>
            <p className="text-xs text-secondary mt-1">
              You are all caught up on system broadcasts.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const isSelected = selectedNotificationId === notification.id;
            return (
              <article
                key={notification.id}
                onClick={() => handleCardClick(notification.id)}
                style={
                  isSelected
                    ? {
                        backgroundColor: notification.activeBg,
                        borderColor: notification.activeBorder,
                        boxShadow: notification.activeGlow,
                      }
                    : undefined
                }
                className={`relative flex flex-col p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  notification.borderClass
                } ${
                  isSelected
                    ? notification.activeFill
                    : notification.isRead
                    ? 'bg-card/40 border-border opacity-75 hover:opacity-100 hover:border-border-focus'
                    : 'bg-card border-border hover:border-border-focus hover:shadow-xs'
                }`}
                aria-selected={isSelected}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Icon and Title Details */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${notification.iconBox}`}
                    >
                      <notification.icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4
                          className={`text-sm sm:text-base font-bold ${
                            notification.isRead ? 'text-secondary font-medium' : 'text-primary'
                          }`}
                        >
                          {notification.title}
                        </h4>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${notification.badgeClass}`}
                        >
                          {notification.tag}
                        </span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" title="Unread" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                        {notification.desc}
                      </p>
                    </div>
                  </div>

                  {/* Right: Timestamp & Action Controls */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="flex items-center gap-1.5 text-xs text-secondary font-medium">
                      <Clock size={12} className="opacity-70" />
                      <span>{notification.time}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleToggleRead(notification.id, e)}
                        className="p-1.5 rounded-lg border border-border bg-card/60 text-secondary hover:text-primary hover:border-border-focus hover:bg-surface-hover transition-colors cursor-pointer"
                        title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
                        aria-label="Toggle read status"
                      >
                        {notification.isRead ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteNotification(notification.id, e)}
                        className="p-1.5 rounded-lg border border-border bg-card/60 text-secondary hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Dismiss alert"
                        aria-label="Dismiss notification"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Box Actions when clicked */}
                {isSelected && (
                  <div className="mt-3.5 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
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
                          toast.success(`Action resolved for: "${notification.title}"`);
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
          })
        )}
      </div>
    </div>
  );
}

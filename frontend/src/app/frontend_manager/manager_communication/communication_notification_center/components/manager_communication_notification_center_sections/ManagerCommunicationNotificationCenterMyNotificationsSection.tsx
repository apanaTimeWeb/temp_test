'use client';

import {
  ManagerCommunicationNotificationCenterAlertCard,
  type SystemNotificationItem,
} from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_sections/ManagerCommunicationNotificationCenterAlertCard';
import { AlertTriangle, Bell, CheckCheck, CheckCircle2, Filter, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { toast } from 'sonner';

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
          toast.info(nextState ? 'Marked as read' : 'Marked as unread', { id: `manager-notif-read-${id}` });
          return { ...item, isRead: nextState };
        }
        return item;
      })
    );
  };

  const handleMarkAllRead = () => {
    setNotificationList((prev) => prev.map((item) => ({ ...item, isRead: true })));
    toast.success('All system notifications marked as read', { id: 'manager-notif-mark-all-read' });
  };

  const handleDeleteNotification = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotificationList((prev) => prev.filter((item) => item.id !== id));
    if (selectedNotificationId === id) {
      setSelectedNotificationId(null);
    }
    toast.success('Notification dismissed', { id: `manager-notif-dismiss-${id}` });
  };

  const filteredNotifications = notificationList.filter((item) => {
    if (activeCategory === 'unread') return !item.isRead;
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const CATEGORY_CHIPS = [
    { id: 'all', label: 'All Alerts', count: notificationList.length, activeBg: 'rgba(99, 102, 241, 0.22)', activeBorder: '#6366f1', activeText: '#e0e7ff', activeGlow: '0 0 14px rgba(99, 102, 241, 0.45)' },
    { id: 'unread', label: 'Unread', count: unreadCount, activeBg: 'rgba(99, 102, 241, 0.25)', activeBorder: '#6366f1', activeText: '#e0e7ff', activeGlow: '0 0 16px rgba(99, 102, 241, 0.5)' },
    { id: 'admissions', label: 'Admissions', activeBg: 'rgba(16, 185, 129, 0.25)', activeBorder: '#10b981', activeText: '#d1fae5', activeGlow: '0 0 16px rgba(16, 185, 129, 0.5)' },
    { id: 'maintenance', label: 'Maintenance', activeBg: 'rgba(245, 158, 11, 0.25)', activeBorder: '#f59e0b', activeText: '#fef3c7', activeGlow: '0 0 16px rgba(245, 158, 11, 0.5)' },
    { id: 'security', label: 'Security', activeBg: 'rgba(244, 63, 94, 0.25)', activeBorder: '#f43f5e', activeText: '#ffe4e6', activeGlow: '0 0 16px rgba(244, 63, 94, 0.5)' },
  ];

  return (
    <div className="motion-safe:transition-all motion-safe:duration-base space-y-5 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
            <span>{tManagerUi('my_system_notifications')}</span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 motion-safe:animate-pulse">
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
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 motion-safe:transition-all cursor-pointer"
            >
              <CheckCheck size={14} />
              <span>Mark all as read</span>
            </button>
          )}
        </div>
      </div>

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
                  ? { backgroundColor: cat.activeBg, borderColor: cat.activeBorder, color: cat.activeText, boxShadow: cat.activeGlow }
                  : undefined
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold motion-safe:transition-all cursor-pointer border ${
                isSelected ? 'font-bold' : 'bg-card border-border text-secondary hover:text-primary hover:bg-card hover:border-border-focus'
              }`}
            >
              <span>{cat.label}</span>
              {typeof cat.count === 'number' && (
                <span
                  style={isSelected ? { borderColor: cat.activeBorder } : undefined}
                  className={`text-[10px] px-1.5 py-0.2 rounded-full border ${
                    isSelected ? 'bg-slate-900/40 text-white' : 'bg-surface border-border text-secondary'
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card">
            <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2 opacity-80" />
            <h4 className="text-sm font-bold text-primary">No notifications found</h4>
            <p className="text-xs text-secondary mt-1">You are all caught up on system broadcasts.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <ManagerCommunicationNotificationCenterAlertCard
              key={notification.id}
              notification={notification}
              isSelected={selectedNotificationId === notification.id}
              onCardClick={(id) => setSelectedNotificationId(id === selectedNotificationId ? null : id)}
              onToggleRead={handleToggleRead}
              onDelete={handleDeleteNotification}
            />
          ))
        )}
      </div>
    </div>
  );
}

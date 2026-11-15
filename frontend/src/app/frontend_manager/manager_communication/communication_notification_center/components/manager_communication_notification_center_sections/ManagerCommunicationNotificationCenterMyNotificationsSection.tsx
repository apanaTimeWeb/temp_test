'use client';

import { useTranslations } from 'next-intl';
import { Bell, AlertTriangle, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';

export function ManagerCommunicationNotificationCenterMyNotificationsSection() {
  const tManagerUi = useTranslations('manager.manager_notification_center.ui');

  const notifications = [
    {
      id: 'notif-1',
      title: tManagerUi('sample_notification_student_enrollment_title'),
      desc: tManagerUi('sample_notification_student_enrollment_desc'),
      time: tManagerUi('sample_notification_time_ten_minutes_ago'),
      icon: Bell,
      borderClass: 'border-l-4 border-l-emerald-500',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      iconBox: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      tag: 'Admissions',
    },
    {
      id: 'notif-2',
      title: tManagerUi('sample_notification_server_maintenance_title'),
      desc: tManagerUi('sample_notification_server_maintenance_desc'),
      time: tManagerUi('sample_notification_time_two_hours_ago'),
      icon: AlertTriangle,
      borderClass: 'border-l-4 border-l-amber-500',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
      iconBox: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      tag: 'Maintenance',
    },
    {
      id: 'notif-3',
      title: tManagerUi('sample_notification_payment_gateway_title'),
      desc: tManagerUi('sample_notification_payment_gateway_desc'),
      time: tManagerUi('sample_notification_time_yesterday'),
      icon: ShieldAlert,
      borderClass: 'border-l-4 border-l-rose-500',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
      iconBox: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      tag: 'Security & Billing',
    },
  ];

  return (
    <div className="motion-safe:transition-all motion-safe:duration-base space-y-5 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-primary">
            {tManagerUi('my_system_notifications')}
          </h2>
          <p className="text-xs text-secondary mt-0.5">
            Operational alerts, automated reminders, and system broadcast feeds.
          </p>
        </div>
        <span className="text-xs font-semibold text-secondary self-start sm:self-auto">
          {notifications.length} Unread Alerts
        </span>
      </div>

      <div className="space-y-3.5">
        {notifications.map((notification) => (
          <article
            key={notification.id}
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs ${notification.borderClass} hover:border-border-focus transition-all`}
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${notification.iconBox}`}
              >
                <notification.icon size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="text-sm sm:text-base font-bold text-primary">
                    {notification.title}
                  </h4>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${notification.badgeClass}`}
                  >
                    {notification.tag}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                  {notification.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-secondary shrink-0 font-medium self-end sm:self-center">
              <Clock size={12} className="opacity-70" />
              <span>{notification.time}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// RESPONSIBILITY: Render the communication notification center my notifications section section of the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import { Bell, AlertTriangle, ShieldAlert } from 'lucide-react';

export function ManagerCommunicationNotificationCenterMyNotificationsSection() {
  const tManagerUi = useTranslations('manager.manager_notification_center.ui');

  return (
    <div className="motion-safe:transition-all motion-safe:duration-base space-y-4">
      <h2 className="text-xl font-bold text-primary mb-3 border-b border-border pb-4">
        {tManagerUi('my_system_notifications')}
      </h2>
      <p className="mb-4 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">
        {tManagerUi('system_notifications_sample_notice')}
      </p>
      {[
        {
          title: tManagerUi('sample_notification_student_enrollment_title'),
          desc: tManagerUi('sample_notification_student_enrollment_desc'),
          time: tManagerUi('sample_notification_time_ten_minutes_ago'),
          icon: Bell,
          color: 'text-info',
          bg: 'bg-info-bg',
        },
        {
          title: tManagerUi('sample_notification_server_maintenance_title'),
          desc: tManagerUi('sample_notification_server_maintenance_desc'),
          time: tManagerUi('sample_notification_time_two_hours_ago'),
          icon: AlertTriangle,
          color: 'text-warning',
          bg: 'bg-warning-bg',
        },
        {
          title: tManagerUi('sample_notification_payment_gateway_title'),
          desc: tManagerUi('sample_notification_payment_gateway_desc'),
          time: tManagerUi('sample_notification_time_yesterday'),
          icon: ShieldAlert,
          color: 'text-danger',
          bg: 'bg-danger-bg',
        },
      ].map((notification) => (
        <article key={notification.title} className="flex gap-4 p-4 rounded-xl bg-card border border-border">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notification.bg} ${notification.color}`}>
            <notification.icon size={18} />
          </div>
          <div>
            <h4 className="text-base font-bold text-primary mb-1">{notification.title}</h4>
            <p className="text-sm text-secondary mb-2">{notification.desc}</p>
            <span className="text-xs font-semibold text-secondary opacity-70">{notification.time}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

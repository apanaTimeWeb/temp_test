'use client';
// RESPONSIBILITY: AdminCommunicationNotificationCenterPage component owned by admin_communication; responsibility folder: admin_communication_components_views.

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRight, ArrowRight, CheckCheck } from 'lucide-react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import {
  ADMIN_COMMUNICATION_NOTIFICATION_CATEGORIES,
  ADMIN_COMMUNICATION_NOTIFICATION_ICON_CLASS,
} from '@/app/frontend_admin/admin_communication/communication_notification_center/config/admin_communication_notification_center.url_config';
import { ADMIN_COMMUNICATION_NOTIFICATION_FIXTURES } from '@/app/frontend_admin/admin_communication/communication_notification_center/mocks/AdminCommunicationNotificationCenterFixtures';
import {
  filterAdminCommunicationNotifications,
  markAdminCommunicationNotificationsRead,
  countUnreadAdminCommunicationNotifications,
} from '@/app/frontend_admin/admin_communication/communication_notification_center/utils/AdminCommunicationNotificationCenterUtils';
import type { AdminCommunicationNotification, AdminCommunicationNotificationCategory } from '@/app/frontend_admin/admin_communication/communication_notification_center/types/AdminCommunicationNotificationCenterTypes';

export function AdminCommunicationNotificationCenterPage() {
  const t = useTranslations('ADMIN_COMMUNICATION');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [cat, setCat] = useState<AdminCommunicationNotificationCategory>('All');
  const [notifs, setNotifs] = useState<AdminCommunicationNotification[]>(() => isDemoMode ? ADMIN_COMMUNICATION_NOTIFICATION_FIXTURES : []);

  if (!isDemoMode) return <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6" aria-labelledby="notification-center-title"><h1 id="notification-center-title" className="flex items-center gap-3 text-2xl font-bold tracking-tight text-text-primary">{t('NOTIFICATION_CENTER_TITLE')}</h1><p role="status" className="text-warning-text">{t('NOTIFICATION_CENTER_LIVE_UNAVAILABLE')}</p></section>;

  const filtered = filterAdminCommunicationNotifications(notifs, cat);

  const unread = countUnreadAdminCommunicationNotifications(notifs);
  const markAllRead = () => setNotifs((previous) => markAdminCommunicationNotificationsRead(previous));

  return (
    <div className="min-h-screen bg-page p-8">
      <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('NOTIFICATION_CENTER_DEMO_BANNER')}</p>
      <div className="mb-8">
        <div className="mb-1.5 flex items-center gap-1.5 text-badge font-semibold uppercase tracking-[0.07em] text-text-secondary">
          <span>{t('BREADCRUMB_COMMUNICATION')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('NOTIFICATION_CENTER_TITLE')}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-text-primary">🔔 {t('NOTIFICATION_CENTER_TITLE')}</h1>
            <p className="mt-1 text-ui text-text-secondary">{t('NOTIFICATION_CENTER_UNREAD_COUNT', { count: unread })}</p>
          </div>
          <button data-testid="admin_communication-page-control-001" onClick={markAllRead} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-ui font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={unread === 0}>
            <CheckCheck size={18}  strokeWidth={2}/> {t('NOTIFICATION_CENTER_MARK_ALL_READ')}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top Filter Bar */}
        <div className="flex flex-wrap gap-3">
          {ADMIN_COMMUNICATION_NOTIFICATION_CATEGORIES.map(c => (
            <button data-testid={`admin_communication-notification-filter-${c.id.toLowerCase().replaceAll(' ', '-')}`} key={c.id} onClick={() => setCat(c.id)} aria-pressed={cat === c.id}
              className={`flex min-h-11 w-full items-center justify-center gap-3 rounded-xl border px-4 py-3 text-left text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${cat === c.id ? 'border-primary bg-primary text-on-primary shadow-card hover:opacity-95' : 'border-transparent bg-card text-text-secondary hover:border-border hover:shadow-card'}`}
              >
              <span aria-hidden="true">{c.icon}</span><span>{t(c.labelKey)}</span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="overflow-hidden rounded-xl border border-border bg-card p-0">
          {filtered.length === 0 ? (
            <div data-testid="admin_communication-page-state-003" className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <div data-testid="admin_communication-page-state-004" className="mb-2 text-5xl">🔔</div>
              <p data-testid="admin_communication-page-state-005" className="text-section-title font-semibold text-text-secondary">{t('NOTIFICATION_CENTER_EMPTY')}</p>
            </div>
          ) : (
            filtered.map(n => (
              <div key={n.id} className={`relative flex items-start gap-5 border-b border-l-4 border-border p-6 hover:bg-surface-hover ${n.read ? 'border-l-transparent opacity-60' : 'border-l-primary'}`}>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-highlight text-section-title ${ADMIN_COMMUNICATION_NOTIFICATION_ICON_CLASS[n.category]}`}>{n.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="mb-1 text-body font-semibold text-text-primary">{t(n.titleKey)}</p>
                    <span data-testid={`admin_communication-notification-priority-${n.id}`} className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2.5 py-1 text-badge font-semibold ${n.priority === 'High' ? 'bg-danger-bg text-danger-text border-danger-bg' : 'bg-warning-bg text-warning-text border-warning-bg'}`}>
                      {n.priority === 'High' ? `🔴 ${t('PRIORITY_HIGH')}` : `🟡 ${t('PRIORITY_MEDIUM')}`}
                    </span>
                    {!n.read && <span data-testid={`admin_communication-notification-new-${n.id}`} className="inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2.5 py-1 text-badge font-semibold bg-primary-subtle text-primary border-primary-subtle">{t('NOTIFICATION_CENTER_NEW')}</span>}
                  </div>
                  <p className="mb-2 text-body leading-normal text-text-secondary">{t(n.descriptionKey)}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2 max-sm:items-start">
                  <span className="text-caption text-text-disabled">{t(n.timeKey)}</span>
                  <a data-testid={`admin_communication-notification-link-${n.id}`} href={n.link} className="inline-flex min-h-11 items-center gap-1 rounded-md bg-primary-subtle px-3 py-2 text-ui font-medium text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    {t('NOTIFICATION_CENTER_GO_TO_PAGE')} <ArrowRight size={18}  strokeWidth={2}/>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

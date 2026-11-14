import { Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';

/** Responsibility: render the filtered notification empty state; it does not change read status or fetch notifications. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
/** Flow: active notification filter -> filtered collection -> accessible localized empty-state presentation. */
export function SuperadminCommunicationNotificationCenterEmptyState() {
  const tCopy = useTranslations('SUPERADMIN_COMMUNICATION');
  return (
    <div className="eng-empty flex flex-col items-center gap-3 p-8 text-center" role="status" data-testid="superadmin-communication-communication-notification-center-empty-state">
      <Bell size={24} aria-hidden="true" className="eng-icon-muted" />
      <p className="eng-empty__title">{tCopy('COPY.ALL_CAUGHT_UP_NO_PENDING_NOTIFICATIONS')}</p>
      <p className="eng-empty__description">{tCopy('COPY.NO_NOTIFICATIONS_MATCH_CURRENT_FILTER_DESCRIPTION')}</p>
    </div>
  );
}

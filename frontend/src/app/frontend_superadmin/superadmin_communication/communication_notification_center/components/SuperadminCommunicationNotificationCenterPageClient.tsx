'use client';
/** Responsibility: Superadmin Communication Notification Center Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminCommunicationNotificationCenterPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useEffect } from 'react';
import { useSuperadminCommunicationNotificationCenterState } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterState';
import { ChevronRight, ArrowRight, CheckCheck } from 'lucide-react';
import type { SuperadminCommunicationNotificationFilter as Category } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';
import { SUPERADMIN_COMMUNICATION_NOTIFICATION_FILTERS as CATS, SUPERADMIN_COMMUNICATION_NOTIFICATION_ICON_CLASS as ICON_CLS } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/constants/SuperadminCommunicationNotificationCenterNotificationConstants';
import { useTranslations } from 'next-intl';
import { SuperadminCommunicationNotificationCenterEmptyState } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterEmptyState';

/**
 * Renders the `superadmin_communication` view owned by `SuperadminCommunicationNotificationCenterPageClient`.
 * Owns local UI state for `cat`, `urlStateReady`, `notifs`.
 * Effect lifecycle boundaries are `[]`, `[cat, urlStateReady]`.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminCommunicationNotificationCenterPageClient({ id }: { id?: string } = {}) {
  const tCopy = useTranslations('SUPERADMIN_COMMUNICATION');
  const { cat, setCat, urlStateReady, setUrlStateReady, notifs, setNotifs } = useSuperadminCommunicationNotificationCenterState();
  // Effect contract: hydrate URL-backed filter or route state from the current query string on mount; dependency set [] (intentional mount-only effect) is the deliberate re-run boundary.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('category');
    const allowed = CATS.map((item) => item.id) as readonly string[];
    setCat(allowed.includes(requested ?? '') ? requested as Category : 'All');
    setUrlStateReady(true);
  }, []);
  // Effect contract: serialize the current filter or view state into the URL only after initial URL hydration; dependency set [cat, urlStateReady] is the deliberate re-run boundary.
  useEffect(() => {
    if (!urlStateReady) return;
    const url = new URL(window.location.href);
    if (cat === 'All') url.searchParams.delete('category');
    else url.searchParams.set('category', cat);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, [cat, urlStateReady]);

  const filtered = notifs.filter(n => {
    if (cat === 'All')       return true;
    if (cat === 'High Only') return n.priority === 'High';
    return n.category === cat;
  });

  const unread = notifs.filter(n => !n.read).length;
  const markAllRead = () => setNotifs(prev => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="eng-page" data-resource-id={id || undefined}>
      <div className="mb-8">
        <div className="eng-breadcrumb">
          <span>{tCopy("COPY.COMMUNICATION")}</span><ChevronRight size={12} /><span>{tCopy("COPY.NOTIFICATION_CENTER")}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="eng-page-title">{tCopy("COPY.NOTIFICATION_CENTER_2")}</h1>
            <p className="eng-page-subtitle">{tCopy("COPY.SYNTHETIC_SAMPLE_NOTIFICATION_FEED_LIVE_EVENT_DATA_WAS_NOT_SUPPLIED")} {unread} {tCopy("COPY.SAMPLE_ROWS_REMAIN_UNREAD")}</p>
          </div>
          <button type="button" onClick={markAllRead} className="eng-btn-ghost" disabled={unread === 0} data-testid="superadmin-communication-communication-notification-center-mark-sample-rows-read-1">
            <CheckCheck size={16} /> {tCopy("COPY.MARK_SAMPLE_ROWS_READ")}
          </button>
        </div>
      </div>

      <p className="mb-5 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.THIS_FEED_IS_ILLUSTRATIVE_ONLY_IT_DOES_NOT_REPRESENT_VERIFIED_SUBSCRIPTION_PAYMENT_ATTENDANCE_CRM_OR_MAINTENANCE_EVENTS_MARK_ALL_READ_CHANGES_THIS_PAGE_PREVIEW_ONLY")}</p>

      <div className="flex flex-col gap-6">
        {/* Top Filter Bar */}
        <div className="eng-notif-topbar flex flex-wrap gap-3">
          {CATS.map((c) => (
            <button type="button" key={c.id} onClick={() => setCat(c.id)}
              className={`eng-notif-cat w-auto px-4 py-2 rounded-full${cat === c.id ? ' eng-notif-cat--active' : ''}`} data-testid={`superadmin-communication-communication-notification-center-set-cat-2-${String(c.id)}`}>
              <span>{c.icon}</span><span>{tCopy(c.labelKey)}</span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="eng-card eng-card--flush">
          {filtered.length === 0 ? (
            <SuperadminCommunicationNotificationCenterEmptyState />
          ) : (
            filtered.map((n) => (
              <div key={n.id} className={`eng-notif-item${n.read ? ' eng-notif-read' : ''}`}>
                <div className={`eng-notif-icon ${ICON_CLS[n.category]}`}>{n.icon}</div>
                <div className="eng-flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="eng-notif-title">{tCopy(`COPY.${n.titleKey}`)}</p>
                    <span className={`eng-badge ${n.priority === 'High' ? 'eng-badge--danger' : 'eng-badge--warning'}`}>
                      {n.priority === 'High' ? `🔴 ${tCopy('COPY.PRIORITY_HIGH')}` : `🟡 ${tCopy('COPY.PRIORITY_MEDIUM')}`}
                    </span>
                    {!n.read && <span className="eng-badge eng-badge--primary">{tCopy("COPY.NEW")}</span>}
                  </div>
                  <p className="eng-notif-desc">{tCopy(`COPY.${n.descriptionKey}`)}</p>
                </div>
                <div className="eng-notif-meta">
                  <span className="eng-notif-time">{tCopy(`COPY.${n.timeKey}`)}</span>
                  <a href={n.link} className="eng-notif-link" data-testid={`superadmin-communication-communication-notification-center-go-to-page-3-${String(n.id)}`}>
                    {tCopy("COPY.GO_TO_PAGE")} <ArrowRight size={12} />
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

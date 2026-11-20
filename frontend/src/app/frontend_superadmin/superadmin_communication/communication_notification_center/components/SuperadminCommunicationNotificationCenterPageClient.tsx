'use client';
/** Responsibility: Superadmin Communication Notification Center Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminCommunicationNotificationCenterPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useEffect, useState, useMemo } from 'react';
import { useSuperadminCommunicationNotificationCenterState } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterState';
import {
  Bell,
  CheckCheck,
  Check,
  AlertTriangle,
  Info,
  Clock,
  Eye,
  X,
  ShieldAlert,
  Sparkles,
  SlidersHorizontal,
  BookmarkCheck
} from 'lucide-react';
import type {
  SuperadminCommunicationNotificationFilter as Category,
  SuperadminCommunicationNotification
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';
import {
  SUPERADMIN_COMMUNICATION_NOTIFICATION_FILTERS as CATS,
  SUPERADMIN_COMMUNICATION_NOTIFICATION_ICON_CLASS as ICON_CLS
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/constants/SuperadminCommunicationNotificationCenterNotificationConstants';
import { useTranslations } from 'next-intl';
import { SuperadminCommunicationNotificationCenterEmptyState } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterEmptyState';

/**
 * Renders the `superadmin_communication` view owned by `SuperadminCommunicationNotificationCenterPageClient`.
 * Owns local UI state for `cat`, `urlStateReady`, `notifs`, and in-place `selectedNotif` modal preview.
 * Effect lifecycle boundaries are `[]`, `[cat, urlStateReady]`.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminCommunicationNotificationCenterPageClient({ id }: { id?: string } = {}) {
  const tCopy = useTranslations('SUPERADMIN_COMMUNICATION');
  const { cat, setCat, urlStateReady, setUrlStateReady, notifs, setNotifs } = useSuperadminCommunicationNotificationCenterState();
  const [selectedNotif, setSelectedNotif] = useState<SuperadminCommunicationNotification | null>(null);

  // Effect contract: hydrate URL-backed filter or route state from the current query string on mount; dependency set [] (intentional mount-only effect) is the deliberate re-run boundary.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('category');
    const allowed = CATS.map((item) => item.id) as readonly string[];
    setCat(allowed.includes(requested ?? '') ? (requested as Category) : 'All');
    setUrlStateReady(true);
  }, [setCat, setUrlStateReady]);

  // Effect contract: serialize the current filter or view state into the URL only after initial URL hydration; dependency set [cat, urlStateReady] is the deliberate re-run boundary.
  useEffect(() => {
    if (!urlStateReady) return;
    const url = new URL(window.location.href);
    if (cat === 'All') url.searchParams.delete('category');
    else url.searchParams.set('category', cat);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, [cat, urlStateReady]);

  const filtered = notifs.filter((n) => {
    if (cat === 'All') return true;
    if (cat === 'High Only') return n.priority === 'High';
    return n.category === cat;
  });

  const unread = notifs.filter((n) => !n.read).length;
  const highPriorityCount = useMemo(() => notifs.filter((n) => n.priority === 'High').length, [notifs]);

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleToggleRead = (targetId: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === targetId ? { ...n, read: !n.read } : n))
    );
  };

  const handleOpenDetails = (n: SuperadminCommunicationNotification) => {
    setSelectedNotif(n);
    if (!n.read) {
      setNotifs((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
      );
    }
  };

  return (
    <div className="eng-page min-h-screen space-y-6" data-resource-id={id || undefined}>
      {/* In-Place Detail Modal */}
      {selectedNotif && (
        <div
          className="eng-overlay fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedNotif(null);
          }}
        >
          <div
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-detail-title"
            className="eng-modal bg-card/95 border border-border/80 shadow-2xl rounded-2xl w-full max-w-lg p-6 relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${selectedNotif.priority === 'High' ? 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500'}`} />

            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-1.5 rounded-xl bg-muted/40 border border-border/60">
                  {selectedNotif.icon}
                </span>
                <div>
                  <h2 id="notification-detail-title" className="text-base font-bold text-foreground">
                    {tCopy(`COPY.${selectedNotif.titleKey}`)}
                  </h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{tCopy(`COPY.${selectedNotif.timeKey}`)}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                className="p-1.5 rounded-lg border border-border/40 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close notification details dialog"
              >
                <X size={16} />
              </button>
            </div>

            <div className="my-4 flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${selectedNotif.priority === 'High' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'}`}>
                {selectedNotif.priority === 'High' ? `🔴 ${tCopy('COPY.PRIORITY_HIGH')}` : `🟡 ${tCopy('COPY.PRIORITY_MEDIUM')}`}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 text-xs font-medium">
                Category: {selectedNotif.category}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1">
                <BookmarkCheck className="w-3 h-3" />
                <span>Marked Read</span>
              </span>
            </div>

            <div className="p-4 rounded-xl bg-muted/20 border border-border/60 text-sm leading-relaxed text-foreground/90 my-4">
              {tCopy(`COPY.${selectedNotif.descriptionKey}`)}
            </div>

            <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/20 text-xs text-muted-foreground flex items-center gap-2">
              <Info className="w-4 h-4 text-violet-400 shrink-0" />
              <span>In-place Superadmin inspection preview: no external sidebar redirect occurred.</span>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                className="px-4 py-2 rounded-xl bg-muted/40 hover:bg-muted text-foreground text-xs font-medium border border-border/80 transition-colors"
              >
                {tCopy('COPY.CLOSE')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-950/40 via-card/90 to-card/60 border border-violet-500/20 p-6 shadow-xl backdrop-blur-md">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Real-Time Alert Dispatcher</span>
            </div>
            <h1 className="eng-page-title text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Bell className="w-7 h-7 text-violet-400" />
              {tCopy('COPY.NOTIFICATION_CENTER_2')}
            </h1>
            <p className="eng-page-subtitle text-xs text-muted-foreground mt-1 max-w-2xl">
              {tCopy('COPY.SYNTHETIC_SAMPLE_NOTIFICATION_FEED_LIVE_EVENT_DATA_WAS_NOT_SUPPLIED')}{' '}
              <span className="font-semibold text-violet-300">{unread}</span> {tCopy('COPY.SAMPLE_ROWS_REMAIN_UNREAD')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markAllRead}
              className="eng-btn-ghost inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/80 hover:border-violet-500/50 hover:bg-violet-500/10 text-foreground text-xs font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={unread === 0}
              data-testid="superadmin-communication-communication-notification-center-mark-sample-rows-read-1"
            >
              <CheckCheck size={16} className="text-violet-400" />
              <span>{tCopy('COPY.MARK_SAMPLE_ROWS_READ')}</span>
              {unread > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-mono">
                  {unread}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border/40">
          <div className="p-3 rounded-xl bg-card/60 border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total Alerts</span>
              <Bell className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1">{notifs.length}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Active feed items</div>
          </div>
          <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-violet-400">Unread</span>
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-xl font-bold text-violet-300 mt-1">{unread}</div>
            <div className="text-[11px] text-violet-400/80 mt-0.5">Pending review</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-400">High Priority</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-bold text-rose-300 mt-1">{highPriorityCount}</div>
            <div className="text-[11px] text-rose-400/80 mt-0.5">Requires attention</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400">Read / Resolved</span>
              <Check className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-300 mt-1">{notifs.length - unread}</div>
            <div className="text-[11px] text-emerald-400/80 mt-0.5">Archived status</div>
          </div>
        </div>
      </div>

      {/* Illustrative Notice Banner */}
      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300 flex items-center gap-2" role="status">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{tCopy('COPY.THIS_FEED_IS_ILLUSTRATIVE_ONLY_IT_DOES_NOT_REPRESENT_VERIFIED_SUBSCRIPTION_PAYMENT_ATTENDANCE_CRM_OR_MAINTENANCE_EVENTS_MARK_ALL_READ_CHANGES_THIS_PAGE_PREVIEW_ONLY')}</span>
      </p>

      {/* Main Container */}
      <div className="space-y-5">
        {/* Top Category Filter Bar */}
        <div className="eng-notif-topbar flex flex-wrap gap-2.5 p-2 rounded-2xl bg-card/70 border border-border/80 backdrop-blur-md shadow-sm">
          {CATS.map((c) => {
            const isSelected = cat === c.id;
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`eng-notif-cat inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isSelected
                    ? 'eng-notif-cat--active bg-violet-500/20 border border-violet-500/50 text-violet-300 shadow-sm'
                    : 'bg-muted/30 border border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
                data-testid={`superadmin-communication-communication-notification-center-set-cat-2-${String(c.id)}`}
              >
                <span>{c.icon}</span>
                <span>{tCopy(c.labelKey)}</span>
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="eng-card eng-card--flush space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <SuperadminCommunicationNotificationCenterEmptyState />
            </div>
          ) : (
            filtered.map((n) => {
              const isHigh = n.priority === 'High';
              return (
                <div
                  key={n.id}
                  className={`eng-notif-item relative rounded-2xl border p-4.5 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    n.read
                      ? 'eng-notif-read bg-card/40 border-border/60 opacity-80'
                      : 'bg-card/90 border-border/80 shadow-md ring-1 ring-violet-500/10'
                  }`}
                >
                  {/* Left priority accent indicator */}
                  <div
                    className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${
                      isHigh ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                  />

                  <div className="flex items-start gap-3.5 pl-2">
                    <div
                      className={`eng-notif-icon w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                        ICON_CLS[n.category] ?? 'bg-muted/40 text-foreground'
                      }`}
                    >
                      {n.icon}
                    </div>

                    <div className="eng-flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="eng-notif-title font-bold text-foreground text-sm">
                          {tCopy(`COPY.${n.titleKey}`)}
                        </p>
                        <span
                          className={`eng-badge text-[11px] font-medium px-2 py-0.5 rounded-full ${
                            isHigh
                              ? 'eng-badge--danger bg-rose-500/15 text-rose-300 border border-rose-500/30'
                              : 'eng-badge--warning bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {isHigh ? `🔴 ${tCopy('COPY.PRIORITY_HIGH')}` : `🟡 ${tCopy('COPY.PRIORITY_MEDIUM')}`}
                        </span>
                        {!n.read && (
                          <span className="eng-badge eng-badge--primary px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 text-[10px] font-semibold">
                            {tCopy('COPY.NEW')}
                          </span>
                        )}
                      </div>
                      <p className="eng-notif-desc text-xs text-muted-foreground leading-relaxed max-w-2xl">
                        {tCopy(`COPY.${n.descriptionKey}`)}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Meta */}
                  <div className="eng-notif-meta flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pl-2 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                    <span className="eng-notif-time text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground/70" />
                      {tCopy(`COPY.${n.timeKey}`)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleRead(n.id)}
                        className="text-[11px] px-2.5 py-1 rounded-lg border border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
                        title={n.read ? 'Mark as Unread' : 'Mark as Read'}
                      >
                        {n.read ? 'Unread' : 'Mark Read'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(n)}
                        className="eng-notif-link inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-violet-300 text-xs font-medium transition-all"
                        data-testid={`superadmin-communication-communication-notification-center-go-to-page-3-${String(n.id)}`}
                      >
                        <Eye size={12} className="text-violet-400" />
                        <span>{tCopy('COPY.GO_TO_PAGE')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

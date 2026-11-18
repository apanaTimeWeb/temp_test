'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRight, ArrowRight, CheckCheck, Bell, AlertTriangle, BellRing, Building2 } from 'lucide-react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import {
  ADMIN_COMMUNICATION_NOTIFICATION_CATEGORIES,
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

  const { selectedBranch, isAllBranches } = useAdminBranch();

  if (!isDemoMode) {
    return (
      <section className="space-y-3 rounded-2xl border border-amber-500/30 bg-card p-8 text-foreground shadow-xl" aria-labelledby="notification-center-title">
        <h1 id="notification-center-title" className="text-xl font-bold text-foreground">{t('NOTIFICATION_CENTER_TITLE')}</h1>
        <p role="status" className="text-amber-400 text-sm">{t('NOTIFICATION_CENTER_LIVE_UNAVAILABLE')}</p>
      </section>
    );
  }

  const categoryFiltered = filterAdminCommunicationNotifications(notifs, cat);
  const filtered = categoryFiltered.filter((n) =>
    isAllBranches || !selectedBranch || !n.branch || n.branch.toLowerCase().includes(selectedBranch.name.toLowerCase()) || selectedBranch.name.toLowerCase().includes(n.branch.toLowerCase())
  );

  const unread = countUnreadAdminCommunicationNotifications(filtered);
  const markAllRead = () => setNotifs((previous) => markAdminCommunicationNotificationsRead(previous));

  return (
    <div className="min-w-0 space-y-5">
      <p role="status" className="sr-only">{t('NOTIFICATION_CENTER_DEMO_BANNER')}</p>

      {/* Header */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>{t('BREADCRUMB_COMMUNICATION')}</span>
            <ChevronRight size={13} />
            <span className="text-foreground">{t('NOTIFICATION_CENTER_TITLE')}</span>
          </div>
          <h1 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Bell size={20} className="text-primary" />
            {t('NOTIFICATION_CENTER_TITLE')}
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t('NOTIFICATION_CENTER_UNREAD_COUNT', { count: unread })} across active library branches
          </p>
        </div>

        <button
          data-testid="admin_communication-page-control-001"
          onClick={markAllRead}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground hover:bg-card-hover hover:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-40 self-start sm:self-auto shadow-xs"
          disabled={unread === 0}
        >
          <CheckCheck size={14} strokeWidth={2} />
          <span>{t('NOTIFICATION_CENTER_MARK_ALL_READ')}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Alerts - Indigo */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#141842]/80 p-5 shadow-md shadow-indigo-950/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-20 overflow-visible transition-opacity duration-300 group-hover:opacity-35" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Total Alerts</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-indigo-500/15 border-indigo-500/30 text-indigo-400">
              <Bell size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white tabular-nums">{filtered.length}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400 pt-2 border-t border-white/10">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-indigo-300 bg-indigo-500/10 border-indigo-500/25 text-[10px]">
              System Broadcasts
            </span>
          </div>
        </div>

        {/* Unread - Amber */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 p-5 shadow-md shadow-amber-950/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-20 overflow-visible transition-opacity duration-300 group-hover:opacity-35" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Unread</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-amber-500/15 border-amber-500/30 text-amber-400">
              <BellRing size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-400 tabular-nums">{unread}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400 pt-2 border-t border-white/10">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-amber-300 bg-amber-500/10 border-amber-500/25 text-[10px]">
              Action Required
            </span>
          </div>
        </div>

        {/* High Priority - Rose */}
        <div className="group relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 p-5 shadow-md shadow-rose-950/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-20 overflow-visible transition-opacity duration-300 group-hover:opacity-35" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">High Priority</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-rose-500/15 border-rose-500/30 text-rose-400">
              <AlertTriangle size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-400 tabular-nums">{filtered.filter((n) => n.priority === 'High').length}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400 pt-2 border-t border-white/10">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-rose-300 bg-rose-500/10 border-rose-500/25 text-[10px]">
              Urgent Attention
            </span>
          </div>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {ADMIN_COMMUNICATION_NOTIFICATION_CATEGORIES.map(c => (
          <button
            data-testid={`admin_communication-notification-filter-${c.id.toLowerCase().replaceAll(' ', '-')}`}
            key={c.id}
            onClick={() => setCat(c.id)}
            aria-pressed={cat === c.id}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              cat === c.id
                ? 'border border-primary bg-primary text-primary-foreground shadow-xs'
                : 'border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-card-hover'
            }`}
          >
            <span aria-hidden="true" className="text-xs">{c.icon}</span>
            <span>{t(c.labelKey)}</span>
          </button>
        ))}
      </div>

      {/* Notifications List - Standard Compact & Premium Sizing */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden divide-y divide-border/60">
        {filtered.length === 0 ? (
          <div data-testid="admin_communication-page-state-003" className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
            <div data-testid="admin_communication-page-state-004" className="text-2xl mb-1">🔔</div>
            <p data-testid="admin_communication-page-state-005" className="text-sm font-semibold text-foreground">{t('NOTIFICATION_CENTER_EMPTY')}</p>
            <p className="text-xs text-muted-foreground">No pending notifications for the selected category.</p>
          </div>
        ) : (
          filtered.map(n => (
            <div
              key={n.id}
              className={`group relative flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-card-hover ${
                n.read ? 'opacity-70 bg-card' : 'bg-primary/[0.02]'
              }`}
            >
              {/* Unread Accent Bar */}
              {!n.read && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
              )}

              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Standard Compact Icon Container */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-sm shadow-xs">
                  {n.icon}
                </div>

                <div className="min-w-0 flex-1">
                  {/* Top Line: Title + Priority + Status Badges + Branch */}
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold text-foreground truncate max-w-sm sm:max-w-md">
                      {t(n.titleKey)}
                    </p>

                    <span
                      data-testid={`admin_communication-notification-priority-${n.id}`}
                      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.2 text-[10px] font-semibold border ${
                        n.priority === 'High'
                          ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${n.priority === 'High' ? 'bg-rose-400 animate-pulse' : 'bg-amber-400'}`} />
                      <span>{n.priority === 'High' ? t('PRIORITY_HIGH') : t('PRIORITY_MEDIUM')}</span>
                    </span>

                    {!n.read && (
                      <span
                        data-testid={`admin_communication-notification-new-${n.id}`}
                        className="inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.2 text-[10px] font-bold text-primary"
                      >
                        {t('NOTIFICATION_CENTER_NEW')}
                      </span>
                    )}

                    {n.branch && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground border border-border bg-surface px-1.5 py-0.2 rounded-md">
                        <Building2 size={10} className="text-muted-foreground/80" />
                        <span>{n.branch}</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom Line: Single-line Compact Description (Standard Size) */}
                  <p className="text-[11px] text-muted-foreground truncate max-w-xl sm:max-w-2xl mt-0.5">
                    {t(n.descriptionKey)}
                  </p>
                </div>
              </div>

              {/* Right Side: Timestamp + Standard Sleek Action Button */}
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-[11px] text-muted-foreground font-mono hidden md:inline">
                  {t(n.timeKey)}
                </span>
                <a
                  data-testid={`admin_communication-notification-link-${n.id}`}
                  href={n.link}
                  className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-[11px] font-semibold text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary transition-all shadow-xs"
                >
                  <span className="hidden sm:inline">{t('NOTIFICATION_CENTER_GO_TO_PAGE')}</span>
                  <ArrowRight size={12} strokeWidth={2} />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminCommunicationNotificationCenterPage;

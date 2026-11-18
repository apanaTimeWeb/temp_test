'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRight, ArrowRight, CheckCheck, Bell, AlertTriangle, Sparkles } from 'lucide-react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
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

  if (!isDemoMode) {
    return (
      <section className="space-y-3 rounded-2xl border border-amber-500/30 bg-slate-900/90 p-8 text-white shadow-xl backdrop-blur-md" aria-labelledby="notification-center-title">
        <h1 id="notification-center-title" className="text-xl font-bold text-white">{t('NOTIFICATION_CENTER_TITLE')}</h1>
        <p role="status" className="text-amber-400 text-sm">{t('NOTIFICATION_CENTER_LIVE_UNAVAILABLE')}</p>
      </section>
    );
  }

  const { selectedBranch, isAllBranches } = useAdminBranch();
  const categoryFiltered = filterAdminCommunicationNotifications(notifs, cat);
  const filtered = categoryFiltered.filter((n) =>
    isAllBranches || !selectedBranch || !n.branch || n.branch.toLowerCase().includes(selectedBranch.name.toLowerCase()) || selectedBranch.name.toLowerCase().includes(n.branch.toLowerCase())
  );

  const unread = countUnreadAdminCommunicationNotifications(filtered);
  const markAllRead = () => setNotifs((previous) => markAdminCommunicationNotificationsRead(previous));

  return (
    <div className="min-w-0 space-y-6">
      <p role="status" className="sr-only">{t('NOTIFICATION_CENTER_DEMO_BANNER')}</p>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>{t('BREADCRUMB_COMMUNICATION')}</span>
            <ChevronRight size={14} />
            <span className="text-slate-200">{t('NOTIFICATION_CENTER_TITLE')}</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Bell size={22} className="text-indigo-400" />
            {t('NOTIFICATION_CENTER_TITLE')}
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">
            {t('NOTIFICATION_CENTER_UNREAD_COUNT', { count: unread })} across active library branches
          </p>
        </div>

        <button
          data-testid="admin_communication-page-control-001"
          onClick={markAllRead}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all disabled:cursor-not-allowed disabled:opacity-40"
          disabled={unread === 0}
        >
          <CheckCheck size={14} strokeWidth={2} />
          {t('NOTIFICATION_CENTER_MARK_ALL_READ')}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Alerts - Indigo */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 p-5 shadow-lg shadow-indigo-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Alerts</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-indigo-500/15 border-indigo-500/30 text-indigo-400">
              <Bell size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white">{filtered.length}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-indigo-300 bg-indigo-500/10 border-indigo-500/25">
              System Broadcasts
            </span>
          </div>
        </div>

        {/* Unread - Amber */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 p-5 shadow-lg shadow-amber-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-amber-500/10 blur-2xl transition-all duration-500 group-hover:bg-amber-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Unread</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-amber-500/15 border-amber-500/30 text-amber-400">
              <Sparkles size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-amber-400">{unread}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-amber-300 bg-amber-500/10 border-amber-500/25">
              Action Required
            </span>
          </div>
        </div>

        {/* High Priority - Rose */}
        <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 p-5 shadow-lg shadow-rose-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-rose-500/10 blur-2xl transition-all duration-500 group-hover:bg-rose-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">High Priority</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-rose-500/15 border-rose-500/30 text-rose-400">
              <AlertTriangle size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-rose-400">{filtered.filter((n) => n.priority === 'High').length}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-rose-300 bg-rose-500/10 border-rose-500/25">
              Urgent Attention
            </span>
          </div>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {ADMIN_COMMUNICATION_NOTIFICATION_CATEGORIES.map(c => (
          <button
            data-testid={`admin_communication-notification-filter-${c.id.toLowerCase().replaceAll(' ', '-')}`}
            key={c.id}
            onClick={() => setCat(c.id)}
            aria-pressed={cat === c.id}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              cat === c.id
                ? 'border border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-sm'
                : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <span aria-hidden="true">{c.icon}</span>
            <span>{t(c.labelKey)}</span>
          </button>
        ))}
      </div>

      {/* Notifications List - Compact & Premium Standard Sizing */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-md overflow-hidden divide-y divide-slate-800/70">
        {filtered.length === 0 ? (
          <div data-testid="admin_communication-page-state-003" className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
            <div data-testid="admin_communication-page-state-004" className="text-3xl mb-1">🔔</div>
            <p data-testid="admin_communication-page-state-005" className="text-sm font-semibold text-slate-300">{t('NOTIFICATION_CENTER_EMPTY')}</p>
            <p className="text-xs text-slate-500">No pending notifications for the selected category.</p>
          </div>
        ) : (
          filtered.map(n => (
            <div
              key={n.id}
              className={`relative flex items-center justify-between gap-4 p-3.5 sm:p-4 hover:bg-slate-800/40 transition-colors ${
                n.read ? 'opacity-70' : 'bg-indigo-500/[0.02]'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/80 text-base shadow-sm">
                  {n.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs sm:text-sm font-bold text-white truncate">{t(n.titleKey)}</p>
                    <span
                      data-testid={`admin_communication-notification-priority-${n.id}`}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                        n.priority === 'High'
                          ? 'border-rose-500/30 bg-rose-500/15 text-rose-400'
                          : 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                      }`}
                    >
                      {n.priority === 'High' ? `🔴 ${t('PRIORITY_HIGH')}` : `🟡 ${t('PRIORITY_MEDIUM')}`}
                    </span>
                    {!n.read && (
                      <span
                        data-testid={`admin_communication-notification-new-${n.id}`}
                        className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2 py-0.5 text-[10px] font-bold text-indigo-300"
                      >
                        {t('NOTIFICATION_CENTER_NEW')}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-300 leading-snug line-clamp-2">
                    {t(n.descriptionKey)}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                  {t(n.timeKey)}
                </span>
                <a
                  data-testid={`admin_communication-notification-link-${n.id}`}
                  href={n.link}
                  className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800 px-3 text-xs font-semibold text-slate-300 hover:border-indigo-500/50 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
                >
                  <span className="hidden xs:inline">{t('NOTIFICATION_CENTER_GO_TO_PAGE')}</span>
                  <ArrowRight size={13} strokeWidth={2} />
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

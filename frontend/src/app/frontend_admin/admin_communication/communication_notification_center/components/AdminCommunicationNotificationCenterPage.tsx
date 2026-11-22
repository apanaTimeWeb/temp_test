'use client';

import {
ADMIN_COMMUNICATION_NOTIFICATION_CATEGORIES,
} from '@/app/frontend_admin/admin_communication/communication_notification_center/config/admin_communication_notification_center.url_config';
import { ADMIN_COMMUNICATION_NOTIFICATION_FIXTURES } from '@/app/frontend_admin/admin_communication/communication_notification_center/mocks/AdminCommunicationNotificationCenterFixtures';
import type { AdminCommunicationNotification,AdminCommunicationNotificationCategory } from '@/app/frontend_admin/admin_communication/communication_notification_center/types/AdminCommunicationNotificationCenterTypes';
import {
countUnreadAdminCommunicationNotifications,
filterAdminCommunicationNotifications,
markAdminCommunicationNotificationsRead,
} from '@/app/frontend_admin/admin_communication/communication_notification_center/utils/AdminCommunicationNotificationCenterUtils';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import {
AlertTriangle,
Armchair,
Bell,
BellRing,
Building2,
CalendarDays,
Check,
CheckCheck,
Clock,
IndianRupee,
PhoneCall,
Search,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function AdminCommunicationNotificationCenterPage() {
  const t = useTranslations('ADMIN_COMMUNICATION');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [cat, setCat] = useState<AdminCommunicationNotificationCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
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

  // Branch filter
  const branchFiltered = notifs.filter((n) =>
    isAllBranches || !selectedBranch || !n.branch || n.branch.toLowerCase().includes(selectedBranch.name.toLowerCase()) || selectedBranch.name.toLowerCase().includes(n.branch.toLowerCase())
  );

  // Category filter
  const categoryFiltered = filterAdminCommunicationNotifications(branchFiltered, cat);

  // Search filter
  const filtered = categoryFiltered.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const title = t(n.titleKey).toLowerCase();
    const desc = t(n.descriptionKey).toLowerCase();
    const branch = (n.branch || '').toLowerCase();
    const catName = n.category.toLowerCase();
    return title.includes(q) || desc.includes(q) || branch.includes(q) || catName.includes(q);
  });

  const unread = countUnreadAdminCommunicationNotifications(branchFiltered);

  const markAllRead = () => setNotifs((previous) => markAdminCommunicationNotificationsRead(previous));

  const toggleNotificationRead = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const getCategoryCount = (categoryId: AdminCommunicationNotificationCategory) => {
    if (categoryId === 'All') return branchFiltered.length;
    if (categoryId === 'High Only') return branchFiltered.filter((n) => n.priority === 'High').length;
    return branchFiltered.filter((n) => n.category === categoryId).length;
  };

  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case 'Finance':
        return (
          <div className="h-10 w-10 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 shadow-xs">
            <IndianRupee size={18} strokeWidth={2.2} />
          </div>
        );
      case 'CRM':
        return (
          <div className="h-10 w-10 rounded-xl border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0 shadow-xs">
            <PhoneCall size={18} strokeWidth={2.2} />
          </div>
        );
      case 'Operations':
        return (
          <div className="h-10 w-10 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
            <Armchair size={18} strokeWidth={2.2} />
          </div>
        );
      case 'Attendance':
        return (
          <div className="h-10 w-10 rounded-xl border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 shadow-xs">
            <CalendarDays size={18} strokeWidth={2.2} />
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-xl border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 shadow-xs">
            <Bell size={18} strokeWidth={2.2} />
          </div>
        );
    }
  };

  return (
    <div className="min-w-0 space-y-6">
      <p role="status" className="sr-only">{t('NOTIFICATION_CENTER_DEMO_BANNER')}</p>

      {/* Header - Clean without breadcrumbs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 id="notification-center-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-xs">
              <Bell size={20} />
            </div>
            <span>{t('NOTIFICATION_CENTER_TITLE')}</span>
            {unread > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                {unread} Unread
              </span>
            )}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {t('NOTIFICATION_CENTER_UNREAD_COUNT', { count: unread })} across active library branches
          </p>
        </div>

        <button
          data-testid="admin_communication-page-control-001"
          onClick={markAllRead}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3.5 text-xs font-semibold text-foreground hover:bg-card-hover hover:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-40 self-start sm:self-auto shadow-xs cursor-pointer"
          disabled={unread === 0}
        >
          <CheckCheck size={15} strokeWidth={2} />
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
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white tabular-nums">{branchFiltered.length}</p>
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
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-400 tabular-nums">{branchFiltered.filter((n) => n.priority === 'High').length}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400 pt-2 border-t border-white/10">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-rose-300 bg-rose-500/10 border-rose-500/25 text-[10px]">
              Urgent Attention
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Category Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        {/* Categories Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {ADMIN_COMMUNICATION_NOTIFICATION_CATEGORIES.map(c => {
            const count = getCategoryCount(c.id);
            const isSelected = cat === c.id;
            return (
              <button
                data-testid={`admin_communication-notification-filter-${c.id.toLowerCase().replaceAll(' ', '-')}`}
                key={c.id}
                onClick={() => setCat(c.id)}
                aria-pressed={isSelected}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                  isSelected
                    ? 'border border-primary bg-primary text-primary-foreground shadow-xs'
                    : 'border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-card-hover'
                }`}
              >
                <span aria-hidden="true" className="text-xs">{c.icon}</span>
                <span>{t(c.labelKey)}</span>
                <span className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-surface text-muted-foreground border border-border/50'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px] max-w-xs self-stretch sm:self-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts by title or branch..."
            className="w-full h-8 pl-8 pr-3 text-xs rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-xs"
          />
        </div>
      </div>

      {/* Notifications List - Modern High-Quality Card Layout */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div data-testid="admin_communication-page-state-003" className="flex flex-col items-center justify-center gap-3 p-12 text-center rounded-2xl border border-dashed border-border bg-card/60">
            <div data-testid="admin_communication-page-state-004" className="h-12 w-12 rounded-2xl bg-surface flex items-center justify-center text-2xl border border-border">
              🔔
            </div>
            <div>
              <p data-testid="admin_communication-page-state-005" className="text-sm font-semibold text-foreground">
                {t('NOTIFICATION_CENTER_EMPTY')}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {searchQuery.trim()
                  ? `No notifications found matching "${searchQuery}".`
                  : 'No pending alerts or notifications for the selected category.'}
              </p>
            </div>
            {searchQuery.trim() && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filtered.map(n => (
            <div
              key={n.id}
              className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 rounded-xl border transition-all duration-200 ${
                !n.read
                  ? 'border-indigo-500/30 bg-card/95 shadow-sm shadow-indigo-950/20 hover:border-indigo-500/50 hover:bg-card'
                  : 'border-border/70 bg-card/40 opacity-80 hover:opacity-100 hover:border-border hover:bg-card/70'
              }`}
            >
              {/* Left Accent indicator for Unread */}
              {!n.read && (
                <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-gradient-to-b from-indigo-500 to-primary" />
              )}

              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1 pl-1">
                {renderCategoryIcon(n.category)}

                <div className="min-w-0 flex-1 space-y-1">
                  {/* Top Line: Title + Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {t(n.titleKey)}
                    </span>

                    {/* Priority Badge */}
                    <span
                      data-testid={`admin_communication-notification-priority-${n.id}`}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                        n.priority === 'High'
                          ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${n.priority === 'High' ? 'bg-rose-400 animate-pulse' : 'bg-amber-400'}`} />
                      <span>{n.priority === 'High' ? t('PRIORITY_HIGH') : t('PRIORITY_MEDIUM')}</span>
                    </span>

                    {/* Category Pill */}
                    <span className="inline-flex items-center text-[10px] font-medium text-slate-400 bg-slate-800/60 border border-slate-700/60 px-2 py-0.5 rounded-full">
                      {n.category}
                    </span>

                    {/* NEW Badge */}
                    {!n.read && (
                      <span
                        data-testid={`admin_communication-notification-new-${n.id}`}
                        className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                        {t('NOTIFICATION_CENTER_NEW')}
                      </span>
                    )}

                    {/* Branch Pill */}
                    {n.branch && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground border border-border/80 bg-surface/60 px-2 py-0.5 rounded-full">
                        <Building2 size={10} className="text-muted-foreground/80" />
                        <span>{n.branch}</span>
                      </span>
                    )}
                  </div>

                  {/* Middle Line: Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed pr-2">
                    {t(n.descriptionKey)}
                  </p>
                </div>
              </div>

              {/* Right Side: Timestamp & Mark Read toggle (Permanent removal of Go to page link) */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={12} className="text-muted-foreground/70" />
                  <span className="font-mono text-[11px]">{t(n.timeKey)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleNotificationRead(n.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                    !n.read
                      ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/50'
                      : 'border-border bg-surface text-muted-foreground hover:bg-card-hover hover:text-foreground'
                  }`}
                  title={!n.read ? 'Mark as read' : 'Mark as unread'}
                >
                  <Check size={12} strokeWidth={2.5} />
                  <span>{!n.read ? 'Mark Read' : 'Read'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminCommunicationNotificationCenterPage;

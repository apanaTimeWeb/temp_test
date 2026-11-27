'use client';

import { AdminCommunicationNotificationCenterKpis } from '@/app/frontend_admin/admin_communication/communication_notification_center/components/AdminCommunicationNotificationCenterKpis';
import { ADMIN_COMMUNICATION_NOTIFICATION_DEMO_DATA } from '@/app/frontend_admin/admin_communication/communication_notification_center/config/admin_communication_notification_center.demo_data';
import { ADMIN_COMMUNICATION_NOTIFICATION_CATEGORIES } from '@/app/frontend_admin/admin_communication/communication_notification_center/config/admin_communication_notification_center.url_config';
import type { AdminCommunicationNotification, AdminCommunicationNotificationCategory } from '@/app/frontend_admin/admin_communication/communication_notification_center/types/AdminCommunicationNotificationCenterTypes';
import {
  countUnreadAdminCommunicationNotifications,
  filterAdminCommunicationNotifications,
  markAdminCommunicationNotificationsRead,
} from '@/app/frontend_admin/admin_communication/communication_notification_center/utils/AdminCommunicationNotificationCenterUtils';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import {
  Armchair,
  Bell,
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

const CATEGORY_ICON_CONFIG = {
  Finance: { box: 'border-success bg-success-bg text-success-text', Icon: IndianRupee },
  CRM: { box: 'border-info bg-info-bg text-info-text', Icon: PhoneCall },
  Operations: { box: 'border-warning bg-warning-bg text-warning-text', Icon: Armchair },
  Attendance: { box: 'border-purple-text bg-purple-bg text-purple-text', Icon: CalendarDays },
} as const;

function CategoryBadgeIcon({ category }: { category: string }) {
  const cfg = CATEGORY_ICON_CONFIG[category as keyof typeof CATEGORY_ICON_CONFIG] ?? {
    box: 'border-primary bg-info-bg text-primary-text',
    Icon: Bell,
  };
  const Icon = cfg.Icon;
  return (
    <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 shadow-xs ${cfg.box}`}>
      <Icon size={18} strokeWidth={2.2} />
    </div>
  );
}

export function AdminCommunicationNotificationCenterPage() {
  const t = useTranslations('ADMIN_COMMUNICATION');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [cat, setCat] = useState<AdminCommunicationNotificationCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifs, setNotifs] = useState<AdminCommunicationNotification[]>(() =>
    isDemoMode ? ADMIN_COMMUNICATION_NOTIFICATION_DEMO_DATA : []
  );
  const { selectedBranch, isAllBranches } = useAdminBranch();

  if (!isDemoMode) {
    return (
      <section className="space-y-3 rounded-2xl border border-warning bg-card p-8 text-text-primary shadow-xl" aria-labelledby="notification-center-title">
        <h1 id="notification-center-title" className="text-xl font-bold text-text-primary">{t('NOTIFICATION_CENTER_TITLE')}</h1>
        <p role="status" className="text-warning-text text-sm">{t('NOTIFICATION_CENTER_LIVE_UNAVAILABLE')}</p>
      </section>
    );
  }

  const branchFiltered = notifs.filter((n) =>
    isAllBranches || !selectedBranch || !n.branch || n.branch.toLowerCase().includes(selectedBranch.name.toLowerCase()) || selectedBranch.name.toLowerCase().includes(n.branch.toLowerCase())
  );

  const categoryFiltered = filterAdminCommunicationNotifications(branchFiltered, cat);
  const filtered = categoryFiltered.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      t(n.titleKey).toLowerCase().includes(q) ||
      t(n.descriptionKey).toLowerCase().includes(q) ||
      (n.branch || '').toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q)
    );
  });

  const unread = countUnreadAdminCommunicationNotifications(branchFiltered);
  const highPriorityCount = branchFiltered.filter((n) => n.priority === 'High').length;
  const markAllRead = () => setNotifs((previous) => markAdminCommunicationNotificationsRead(previous));
  const toggleNotificationRead = (id: string) => setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  const getCategoryCount = (categoryId: AdminCommunicationNotificationCategory) => {
    if (categoryId === 'All') return branchFiltered.length;
    if (categoryId === 'High Only') return highPriorityCount;
    return branchFiltered.filter((n) => n.category === categoryId).length;
  };

  return (
    <div className="min-w-0 space-y-6">
      <p role="status" className="sr-only">{t('NOTIFICATION_CENTER_DEMO_BANNER')}</p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 id="notification-center-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-info-bg border border-info flex items-center justify-center text-primary-text shadow-xs">
              <Bell size={20} />
            </div>
            <span>{t('NOTIFICATION_CENTER_TITLE')}</span>
            {unread > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-warning-text bg-warning-bg border border-warning px-2.5 py-0.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-warning motion-safe:animate-pulse" />
                {unread} Unread
              </span>
            )}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-text-secondary">
            {t('NOTIFICATION_CENTER_UNREAD_COUNT', { count: unread })} across active library branches
          </p>
        </div>

        <button
          type="button"
          data-testid="admin_communication-page-control-001"
          onClick={markAllRead}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3.5 text-xs font-semibold text-text-primary hover:bg-card-hover hover:border-primary motion-safe:transition-all disabled:cursor-not-allowed disabled:opacity-40 self-start sm:self-auto shadow-xs cursor-pointer"
          disabled={unread === 0}
        >
          <CheckCheck size={15} strokeWidth={2} />
          <span>{t('NOTIFICATION_CENTER_MARK_ALL_READ')}</span>
        </button>
      </div>

      <AdminCommunicationNotificationCenterKpis
        totalAlerts={branchFiltered.length}
        unreadCount={unread}
        highPriorityCount={highPriorityCount}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {ADMIN_COMMUNICATION_NOTIFICATION_CATEGORIES.map((c) => {
            const count = getCategoryCount(c.id);
            const isSelected = cat === c.id;
            return (
              <button
                type="button"
                data-testid={`admin_communication-notification-filter-${c.id.toLowerCase().replaceAll(' ', '-')}`}
                key={c.id}
                onClick={() => setCat(c.id)}
                aria-pressed={isSelected}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                  isSelected
                    ? 'border border-primary bg-primary text-on-primary shadow-xs'
                    : 'border border-border bg-card text-text-secondary hover:border-primary hover:text-text-primary hover:bg-card-hover'
                }`}
              >
                <span aria-hidden="true" className="text-xs">{c.icon}</span>
                <span>{t(c.labelKey)}</span>
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-surface text-text-primary' : 'bg-surface text-text-secondary border border-border'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[240px] max-w-xs self-stretch sm:self-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
          <input
            maxLength={100}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts by title or branch..."
            aria-label="Search notifications"
            className="w-full h-8 pl-8 pr-3 text-xs rounded-xl border border-border bg-card text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-xs"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div data-testid="admin_communication-page-state-003" className="flex flex-col items-center justify-center gap-3 p-12 text-center rounded-2xl border border-dashed border-border bg-card">
            <div data-testid="admin_communication-page-state-004" className="h-12 w-12 rounded-2xl bg-surface flex items-center justify-center text-2xl border border-border">
              🔔
            </div>
            <div>
              <p data-testid="admin_communication-page-state-005" className="text-sm font-semibold text-text-primary">
                {t('NOTIFICATION_CENTER_EMPTY')}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {searchQuery.trim()
                  ? `No notifications found matching "${searchQuery}".`
                  : 'No pending alerts or notifications for the selected category.'}
              </p>
            </div>
            {searchQuery.trim() && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-primary-text hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 rounded-xl border motion-safe:transition-all motion-safe:duration-200 ${
                !n.read
                  ? 'border-info bg-card shadow-sm hover:border-primary'
                  : 'border-border bg-surface opacity-85 hover:opacity-100 hover:bg-card'
              }`}
            >
              {!n.read && <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-primary" />}

              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1 pl-1">
                <CategoryBadgeIcon category={n.category} />

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">{t(n.titleKey)}</span>

                    <span
                      data-testid={`admin_communication-notification-priority-${n.id}`}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                        n.priority === 'High'
                          ? 'border-danger bg-danger-bg text-danger-text'
                          : 'border-warning bg-warning-bg text-warning-text'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${n.priority === 'High' ? 'bg-danger motion-safe:animate-pulse' : 'bg-warning'}`} />
                      <span>{n.priority === 'High' ? t('PRIORITY_HIGH') : t('PRIORITY_MEDIUM')}</span>
                    </span>

                    <span className="inline-flex items-center text-[10px] font-medium text-text-secondary bg-surface border border-border px-2 py-0.5 rounded-full">
                      {n.category}
                    </span>

                    {!n.read && (
                      <span
                        data-testid={`admin_communication-notification-new-${n.id}`}
                        className="inline-flex items-center gap-1 rounded-full border border-info bg-info-bg px-2 py-0.5 text-[10px] font-bold text-info-text"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-ping" />
                        {t('NOTIFICATION_CENTER_NEW')}
                      </span>
                    )}

                    {n.branch && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-text-secondary border border-border bg-surface px-2 py-0.5 rounded-full">
                        <Building2 size={10} className="text-text-secondary" />
                        <span>{n.branch}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed pr-2">{t(n.descriptionKey)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Clock size={12} className="text-text-secondary" />
                  <span className="font-mono text-[11px]">{t(n.timeKey)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleNotificationRead(n.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold motion-safe:transition-all shadow-xs cursor-pointer ${
                    !n.read
                      ? 'border-info bg-info-bg text-info-text hover:border-primary'
                      : 'border-border bg-surface text-text-secondary hover:bg-card-hover hover:text-text-primary'
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

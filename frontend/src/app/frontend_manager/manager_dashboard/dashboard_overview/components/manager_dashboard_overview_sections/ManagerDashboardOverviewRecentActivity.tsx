'use client';
// RESPONSIBILITY: Render the dashboard overview recent activity component within the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the dashboard overview recent activity component within the components feature. It does not own backend persistence or cross-feature business logic.
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { UserCheck, PhoneCall, ArrowUpRight, Phone } from 'lucide-react';
import { ManagerDashboardOverviewEmptyState } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/ManagerDashboardOverviewEmptyState';
import { maskManagerDashboardPhone } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/utils/ManagerDashboardOverviewUtilities';
import { createManagerDashboardRecentEnquiryKeys } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/utils/ManagerDashboardOverviewRecentEnquiryKeys';
import type { ManagerDashboardOverviewRecentActivityProps } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';
export type { ManagerDashboardOverviewRecentActivityProps };

export function ManagerDashboardOverviewRecentActivity({
  admissions,
  enquiries,
  studentsHref,
  enquiriesHref,
  timeRangeLabel,
}: ManagerDashboardOverviewRecentActivityProps) {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');
  const enquiryKeys = createManagerDashboardRecentEnquiryKeys(enquiries);
  const activeScopeBadge = timeRangeLabel || 'Today';

  const localizeShift = (value: string) => {
    const keys: Record<string, string> = {
      Morning: 'recent_shift_morning',
      Afternoon: 'recent_shift_afternoon',
      Evening: 'recent_shift_evening',
      Night: 'recent_shift_night',
      'Full Day': 'recent_shift_full_day',
    };
    return keys[value] ? tManagerUi(keys[value]) : value;
  };

  const getShiftBadge = (shift: string) => {
    switch (shift) {
      case 'Morning':
        return 'bg-warning-bg text-warning-text border-border';
      case 'Afternoon':
        return 'bg-warning-bg text-warning-text border-border';
      case 'Evening':
        return 'bg-info-bg text-info border-border';
      case 'Night':
        return 'bg-primary-subtle text-primary border-border';
      case 'Full Day':
        return 'bg-purple-bg text-purple border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const localizeStatus = (value: string) => {
    const keys: Record<string, string> = {
      New: 'recent_status_new',
      Visited: 'recent_status_visited',
      Interested: 'recent_status_interested',
      Converted: 'recent_status_converted',
      Lost: 'recent_status_lost',
    };
    return keys[value] ? tManagerUi(keys[value]) : value;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-info-bg text-info border-border';
      case 'Interested':
        return 'bg-warning-bg text-warning-text border-border';
      case 'Visited':
      case 'Converted':
        return 'bg-success-bg text-success border-border';
      case 'Lost':
        return 'bg-danger-bg text-danger border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label={tManagerUi('recent_activity')}>
      {/* Recent Admissions Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning-bg border border-border text-warning flex items-center justify-center font-bold">
                <UserCheck size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    {tManagerUi('recent_new_admissions')}
                  </h2>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
                    [{activeScopeBadge}]
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Latest member registrations • Scope: {activeScopeBadge}</p>
              </div>
            </div>

            <Link
              href={studentsHref}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline group"
            >
              <span>{tManagerUi('view_all')}</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {admissions.length === 0 ? (
            <ManagerDashboardOverviewEmptyState
              className="mgr-dashboard-grid-panel p-6 text-sm text-secondary text-center"
              testId="manager-dashboard-recent-admissions-empty"
            >
              {tManagerUi('no_recent_admissions_available')}
            </ManagerDashboardOverviewEmptyState>
          ) : (
            <div className="mgr-table-wrapper overflow-x-auto">
              <table className="mgr-activity-table mgr-table w-full table-fixed text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase text-[11px] font-semibold tracking-wider">
                    <th scope="col" className="w-5/12 pb-2.5">{tManagerUi('name')}</th>
                    <th scope="col" className="w-4/12 pb-2.5">{tManagerUi('smart_id')}</th>
                    <th scope="col" className="w-3/12 pb-2.5 text-right">{tManagerUi('shift')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {admissions.map((row) => (
                    <tr key={row.smartId} className="hover:bg-surface-hover transition-colors">
                      <td className="w-5/12 py-3 truncate font-semibold text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-warning-bg text-warning-text font-bold text-[10px] flex items-center justify-center shrink-0">
                            {row.name.charAt(0)}
                          </div>
                          <span className="truncate">{row.name}</span>
                        </div>
                      </td>
                      <td className="w-4/12 py-3">
                        <span className="mgr-table-id font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-muted text-foreground">
                          {row.smartId || '—'}
                        </span>
                      </td>
                      <td className="w-3/12 py-3 text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getShiftBadge(row.shift)}`}>
                          {localizeShift(row.shift)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Enquiries Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-info-bg border border-border text-info flex items-center justify-center font-bold">
                <PhoneCall size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    {tManagerUi('recent_enquiries')}
                  </h2>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
                    [{activeScopeBadge}]
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Prospects inquiring for seats • Scope: {activeScopeBadge}</p>
              </div>
            </div>

            <Link
              href={enquiriesHref}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline group"
            >
              <span>{tManagerUi('view_all')}</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {enquiries.length === 0 ? (
            <ManagerDashboardOverviewEmptyState
              className="mgr-dashboard-grid-panel p-6 text-sm text-secondary text-center"
              testId="manager-dashboard-recent-enquiries-empty"
            >
              {tManagerUi('no_recent_enquiries_available')}
            </ManagerDashboardOverviewEmptyState>
          ) : (
            <div className="mgr-table-wrapper overflow-x-auto">
              <table className="mgr-activity-table mgr-table w-full table-fixed text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase text-[11px] font-semibold tracking-wider">
                    <th scope="col" className="w-5/12 pb-2.5">{tManagerUi('name')}</th>
                    <th scope="col" className="w-4/12 pb-2.5">{tManagerUi('phone')}</th>
                    <th scope="col" className="w-3/12 pb-2.5 text-right">{tManagerUi('status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {enquiries.map((row, index) => (
                    <tr key={enquiryKeys[index]} className="hover:bg-surface-hover transition-colors">
                      <td className="w-5/12 py-3 truncate font-semibold text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-info-bg text-info font-bold text-[10px] flex items-center justify-center shrink-0">
                            {row.name.charAt(0)}
                          </div>
                          <span className="truncate">{row.name}</span>
                        </div>
                      </td>
                      <td className="w-4/12 py-3 font-mono text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Phone size={10} className="text-primary" />
                          {maskManagerDashboardPhone(row.phone)}
                        </span>
                      </td>
                      <td className="w-3/12 py-3 text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(row.status)}`}>
                          {localizeStatus(row.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

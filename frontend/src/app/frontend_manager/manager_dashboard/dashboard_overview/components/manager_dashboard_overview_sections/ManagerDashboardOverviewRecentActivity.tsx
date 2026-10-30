'use client';
// RESPONSIBILITY: Render the dashboard overview recent activity component within the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the dashboard overview recent activity component within the components feature. It does not own backend persistence or cross-feature business logic.
import { ManagerDashboardOverviewEmptyState } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/ManagerDashboardOverviewEmptyState';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { maskManagerDashboardPhone } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/utils/ManagerDashboardOverviewUtilities';
import { createManagerDashboardRecentEnquiryKeys } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/utils/ManagerDashboardOverviewRecentEnquiryKeys';
import type { ManagerDashboardOverviewRecentActivityProps } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';
export type { ManagerDashboardOverviewRecentActivityProps };




export function ManagerDashboardOverviewRecentActivity({ admissions, enquiries, studentsHref, enquiriesHref }: ManagerDashboardOverviewRecentActivityProps) {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');
  const enquiryKeys = createManagerDashboardRecentEnquiryKeys(enquiries);
  const localizeShift = (value: string) => {
    const keys: Record<string, string> = { Morning: 'recent_shift_morning', Afternoon: 'recent_shift_afternoon', Evening: 'recent_shift_evening', Night: 'recent_shift_night', 'Full Day': 'recent_shift_full_day' };
    return keys[value] ? tManagerUi(keys[value]) : value;
  };
  const localizeStatus = (value: string) => {
    const keys: Record<string, string> = { New: 'recent_status_new', Visited: 'recent_status_visited', Interested: 'recent_status_interested', Converted: 'recent_status_converted', Lost: 'recent_status_lost' };
    return keys[value] ? tManagerUi(keys[value]) : value;
  };
  return (
    <section className="mgr-dashboard-row3 mgr-section-gap" aria-label={tManagerUi('recent_activity')}>
      <div className="mgr-card">
        <div className="mgr-card-header"><h2 className="mgr-section-title">{tManagerUi('recent_new_admissions')}</h2><Link href={studentsHref} className="mgr-action-link">{tManagerUi('view_all')}</Link></div>
        {admissions.length === 0 ? <ManagerDashboardOverviewEmptyState className="mgr-dashboard-grid-panel p-6 text-sm text-secondary" testId="manager-dashboard-recent-admissions-empty">{tManagerUi('no_recent_admissions_available')}</ManagerDashboardOverviewEmptyState> : <div className="mgr-table-wrapper"><table className="mgr-activity-table mgr-table w-full"><thead><tr><th scope="col">{tManagerUi('name')}</th><th scope="col">{tManagerUi('smart_id')}</th><th scope="col">{tManagerUi('shift')}</th></tr></thead><tbody>{admissions.map((row) => <tr key={row.smartId}><td>{row.name}</td><td><span className="mgr-table-id">{row.smartId || '—'}</span></td><td>{localizeShift(row.shift)}</td></tr>)}</tbody></table></div>}
      </div>
      <div className="mgr-card">
        <div className="mgr-card-header"><h2 className="mgr-section-title">{tManagerUi('recent_enquiries')}</h2><Link href={enquiriesHref} className="mgr-action-link">{tManagerUi('view_all')}</Link></div>
        {enquiries.length === 0 ? <ManagerDashboardOverviewEmptyState className="mgr-dashboard-grid-panel p-6 text-sm text-secondary" testId="manager-dashboard-recent-enquiries-empty">{tManagerUi('no_recent_enquiries_available')}</ManagerDashboardOverviewEmptyState> : <div className="mgr-table-wrapper"><table className="mgr-activity-table mgr-table w-full"><thead><tr><th scope="col">{tManagerUi('name')}</th><th scope="col">{tManagerUi('phone')}</th><th scope="col">{tManagerUi('status')}</th></tr></thead><tbody>{enquiries.map((row, index) => <tr key={enquiryKeys[index]}><td>{row.name}</td><td>{maskManagerDashboardPhone(row.phone)}</td><td>{localizeStatus(row.status)}</td></tr>)}</tbody></table></div>}
      </div>
    </section>
  );
}

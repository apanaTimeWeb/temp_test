'use client';
// RESPONSIBILITY: Render the dashboard reports table card component within the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the dashboard reports table card component within the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import ManagerDashboardReportsNativeTable from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_table_parts/ManagerDashboardReportsNativeTable';
import type { ManagerDashboardReportsTableCardProps } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsComponentTypes';
export type { ManagerDashboardReportsTableCardProps };


export function ManagerDashboardReportsTableCard<T extends object>({title,rows,columns,getRowKey,height,emptyMessage}:ManagerDashboardReportsTableCardProps<T>){const tManagerUi=useTranslations('manager.manager_reports.ui');return <div className="mgr-card"><div className="mgr-card-header"><h3 className="mgr-section-title">{title}</h3></div>{rows.length === 0 ? <p className="p-6 text-sm text-secondary" role="status">{emptyMessage}</p> : <div className={`mgr-grid-height-${height}`}><ManagerDashboardReportsNativeTable label={title} rows={rows} columns={columns} getRowKey={getRowKey} labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page'), range: (start, end, total) => tManagerUi('pagination_range', { start, end, total }) }} /></div>}</div>}

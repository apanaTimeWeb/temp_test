'use client';
// RESPONSIBILITY: Render the dashboard reports kpi grid component within the components feature. It does not own backend persistence or cross-feature business logic.
import { ManagerDashboardReportsEmptyState } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/ManagerDashboardReportsEmptyState';
import { useTranslations } from 'next-intl';
import { CalendarCheck, Phone, UserPlus, Users } from 'lucide-react';
import type { ManagerDashboardReportsKpiCard } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';
import { MANAGER_REPORTS_KPI_ICON_CLASSES } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/constants/ManagerDashboardReportsConstants';
import { getManagerReportsTrendTone } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/utils/ManagerDashboardReportsTrendTone';
const icons={Users,CalendarCheck,UserPlus,Phone} as const;
export function ManagerDashboardReportsKpiGrid({cards}:{cards:ManagerDashboardReportsKpiCard[]}){const tManagerUi=useTranslations('manager.manager_reports.ui');if(cards.length===0)return <ManagerDashboardReportsEmptyState className="mgr-card p-6 text-sm text-secondary" testId="manager-reports-kpi-empty">{tManagerUi('no_report_data_available')}</ManagerDashboardReportsEmptyState>;return <div className="mgr-kpi-grid mgr-section-gap">{cards.map((card)=>{const Icon=icons[card.icon];return <div key={card.title} className="mgr-kpi-card"><div className="mgr-kpi-top-row"><div className={`mgr-kpi-icon ${MANAGER_REPORTS_KPI_ICON_CLASSES[card.icon]??''}`}><Icon size={18}/></div>{card.trend?<span className={`mgr-trend-${getManagerReportsTrendTone(card.trend)}`}>{card.trend}</span>:null}</div><p className="mgr-kpi-label">{card.title}</p><p className="mgr-kpi-value">{card.value}</p></div>})}</div>}

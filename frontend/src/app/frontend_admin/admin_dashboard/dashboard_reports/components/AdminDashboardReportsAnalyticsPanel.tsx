// Responsibility: Owns report-page filter state, demo/live visibility, export dispatch, and page composition.
'use client';

import { useLocale, useTranslations } from 'next-intl';
import toast from 'sonner';
import AdminDashboardReportsAnalyticsPageHeaderSection from '@/app/frontend_admin/admin_dashboard/dashboard_reports/components/AdminDashboardReportsAnalyticsPageHeaderSection';
import AdminDashboardReportsAnalyticsPrimaryChartsGrid from '@/app/frontend_admin/admin_dashboard/dashboard_reports/components/AdminDashboardReportsAnalyticsPrimaryChartsGrid';
import AdminDashboardReportsAnalyticsSecondaryInsightsSection from '@/app/frontend_admin/admin_dashboard/dashboard_reports/components/AdminDashboardReportsAnalyticsSecondaryInsightsSection';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { buildAdminDashboardReportsAnalyticsCsv } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/utils/AdminDashboardReportsFormatters';
import useAdminDashboardReportsAnalyticsViewState from '@/app/frontend_admin/admin_dashboard/dashboard_reports/hooks/useAdminDashboardReportsAnalyticsViewState';


export default function AdminDashboardReportsAnalyticsPanel() {
  const locale = useLocale();
  const t = useTranslations('ADMIN_REPORTS');
  const isDemoMode = isFrontendDemoModeEnabled();
  const { range, setRange, branch, setBranch, data, branchOptions, filteredBranches } = useAdminDashboardReportsAnalyticsViewState(isDemoMode);

  const downloadCsv = () => {
    if (!isDemoMode) return;
    let objectUrl: string | null = null;
    let anchor: HTMLAnchorElement | null = null;
    try {
      const blob = new Blob([buildAdminDashboardReportsAnalyticsCsv(data.kpis, filteredBranches, data.currencyCode)], { type: 'text/csv;charset=utf-8;' });
      objectUrl = URL.createObjectURL(blob);
      anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = 'admin-reports-demo-snapshot.csv';
      anchor.hidden = true;
      document.body.append(anchor);
      anchor.click();
      toast.success(t('CSV_EXPORTED', { count: filteredBranches.length }), { id: 'admin_dashboard-dashboard_reports-components-AdminDashboardReportsAnalyticsPanel-toast-35-1' });
    } catch {
      toast.error(t('CSV_EXPORT_FAILED'), { id: 'admin_dashboard-dashboard_reports-components-AdminDashboardReportsAnalyticsPanel-toast-37-2' });
    } finally {
      anchor?.remove();
      if (objectUrl) {
        const urlToRevoke = objectUrl;
        window.setTimeout(() => URL.revokeObjectURL(urlToRevoke), 1000);
      }
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="space-y-6 pb-10">
      <AdminDashboardReportsAnalyticsPageHeaderSection range={range} onRangeChange={setRange} branch={branch} branchOptions={branchOptions} onBranchChange={setBranch} isDemoMode={isDemoMode} onPrint={handlePrint} onExportCsv={downloadCsv} />
      <div id="admin-reports-range-panel" role="tabpanel" aria-labelledby={`admin-reports-range-tab-${range}`} tabIndex={0} className="space-y-6 outline-none focus-visible:ring-2 focus-visible:ring-primary">

        <AdminDashboardReportsAnalyticsPrimaryChartsGrid data={data} range={range} locale={locale} />
        <AdminDashboardReportsAnalyticsSecondaryInsightsSection data={data} range={range} locale={locale} branches={filteredBranches} />
      </div>
    </div>
  );
}

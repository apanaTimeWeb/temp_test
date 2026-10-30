// RESPONSIBILITY: Canonical single route for dashboard reports, its analytics tab, and its metadata-only report library.
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'sonner';
import AdminDashboardReportsAnalyticsPanel from '@/app/frontend_admin/admin_dashboard/dashboard_reports/components/AdminDashboardReportsAnalyticsPanel';
import { ADMIN_DASHBOARD_REPORTS_FIXTURES } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/mocks/AdminDashboardReportsFixtures';
import { serializeReportsLibraryCatalogCsv } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/utils/AdminDashboardReportsFormatters';
import type { AdminDashboardReportsView } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes';


export default function AdminDashboardReportsRoute() {
  const t = useTranslations('ADMIN_SHELL');
  const [activeView, setActiveView] = useState<AdminDashboardReportsView>('analytics');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const debounceId = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(debounceId);
  }, [query]);
  const reports = useMemo(
    () => ADMIN_DASHBOARD_REPORTS_FIXTURES.filter((report) => `${t(report.titleKey)} ${t(report.descriptionKey)} ${report.category}`.toLocaleLowerCase().includes(debouncedQuery.trim().toLocaleLowerCase())),
    [debouncedQuery, t],
  );
  const exportCatalog = () => {
    let objectUrl: string | null = null;
    let anchor: HTMLAnchorElement | null = null;
    try {
      const csv = serializeReportsLibraryCatalogCsv(reports);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      objectUrl = URL.createObjectURL(blob);
      anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = 'reports-library-catalog.csv';
      anchor.hidden = true;
      document.body.append(anchor);
      anchor.click();
      toast.success(t('REPORTS_CATALOG_EXPORT_SUCCESS'), { id: 'admin_dashboard-dashboard_reports-page-toast-1' });
    } catch {
      toast.error(t('REPORTS_CATALOG_EXPORT_FAILURE'), { id: 'admin_dashboard-dashboard_reports-page-toast-2' });
    } finally {
      anchor?.remove();
      if (objectUrl) {
        const urlToRevoke = objectUrl;
        window.setTimeout(() => URL.revokeObjectURL(urlToRevoke), 1000);
      }
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div role="group" aria-label={t('REPORTS_VIEW_SELECTOR')} className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={activeView === 'analytics'} onClick={() => setActiveView('analytics')} className={`min-h-11 rounded-md border px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeView === 'analytics' ? 'border-primary bg-primary text-on-primary' : 'border-border bg-card text-primary hover:bg-surface-hover'}`}>{t('REPORTS_VIEW_ANALYTICS')}</button>
        <button type="button" aria-pressed={activeView === 'library'} onClick={() => setActiveView('library')} className={`min-h-11 rounded-md border px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeView === 'library' ? 'border-primary bg-primary text-on-primary' : 'border-border bg-card text-primary hover:bg-surface-hover'}`}>{t('REPORTS_VIEW_LIBRARY')}</button>
      </div>
      {activeView === 'analytics' ? <AdminDashboardReportsAnalyticsPanel /> : (
        <section aria-labelledby="reports-library-heading" className="mx-auto w-full max-w-7xl space-y-6">
          <header><h2 id="reports-library-heading" className="text-2xl font-semibold">{t('REPORTS_LIBRARY_TITLE')}</h2><p className="mt-2 text-sm text-text-secondary">{t('REPORTS_LIBRARY_DESCRIPTION')}</p></header>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex-1 text-sm font-medium">{t('REPORTS_SEARCH_LABEL')}<input value={query} onChange={(event) => setQuery(event.currentTarget.value)} type="search" className="mt-1 min-h-11 w-full rounded-lg border border-border bg-card px-3 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" /></label>
            <button type="button" onClick={exportCatalog} className="min-h-11 rounded-lg border border-border px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('REPORTS_EXPORT_CATALOG')}</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => <article key={report.id} className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold">{t(report.titleKey)}</h3><p className="mt-2 text-sm text-text-secondary">{t(report.descriptionKey)}</p><p className="mt-3 text-xs font-medium text-text-secondary" role="status">{t('REPORTS_DATA_PENDING')}</p></article>)}
          </div>
          {reports.length === 0 && <p role="status" className="rounded-xl border border-border p-4 text-sm text-text-secondary">{t('REPORTS_NO_RESULTS')}</p>}
        </section>
      )}
    </main>
  );
}

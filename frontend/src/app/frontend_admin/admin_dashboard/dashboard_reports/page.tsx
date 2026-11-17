'use client';
// RESPONSIBILITY: Canonical single route for dashboard reports, its analytics tab, and its metadata-only report library (AdminDashboardReportsLibrary).

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  BarChart3,
  Library,
  Download,
  Search,
  Users,
  WalletCards,
  Armchair,
  Building2,
  UserCog,
  FileSpreadsheet,
  type LucideIcon,
} from 'lucide-react';
import AdminDashboardReportsAnalyticsPanel from '@/app/frontend_admin/admin_dashboard/dashboard_reports/components/AdminDashboardReportsAnalyticsPanel';
import { ADMIN_DASHBOARD_REPORTS_FIXTURES } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/mocks/AdminDashboardReportsFixtures';
import { serializeReportsLibraryCatalogCsv } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/utils/AdminDashboardReportsFormatters';

export type AdminDashboardReportsLibraryView = 'analytics' | 'library';

const CATEGORY_META: Record<string, { label: string; color: string; bg: string; border: string; Icon: LucideIcon }> = {
  members: { label: 'Members', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.25)', Icon: Users },
  finance: { label: 'Finance', color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)', border: 'rgba(52, 211, 153, 0.25)', Icon: WalletCards },
  seats_shifts: { label: 'Seats & Shifts', color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.12)', border: 'rgba(34, 211, 238, 0.25)', Icon: Armchair },
  accounts_assets: { label: 'Accounts & Assets', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.12)', border: 'rgba(192, 132, 252, 0.25)', Icon: Building2 },
  staff: { label: 'Staff', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.12)', border: 'rgba(129, 140, 248, 0.25)', Icon: UserCog },
};

export default function AdminDashboardReportsRoute() {
  const t = useTranslations('ADMIN_SHELL');
  const [activeView, setActiveView] = useState<'analytics' | 'library'>('analytics');
  const [query, setQuery] = useState('');
  const reports = useMemo(
    () => ADMIN_DASHBOARD_REPORTS_FIXTURES.filter((report) => `${t(report.titleKey)} ${t(report.descriptionKey)} ${report.category}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())),
    [query, t],
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
    <div className="w-full space-y-6 text-text-primary">
      {/* View Switcher Tabs Bar - Fully Responsive for Mobile, Tablet, and Desktop */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div role="group" aria-label={t('REPORTS_VIEW_SELECTOR')} className="inline-flex w-full sm:w-auto p-1.5 rounded-2xl bg-slate-900/80 border border-indigo-500/20 gap-1.5 shadow-sm">
          <button
            type="button"
            aria-pressed={activeView === 'analytics'}
            onClick={() => setActiveView('analytics')}
            className={`inline-flex items-center justify-center gap-2 min-h-10 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer flex-1 sm:flex-initial ${
              activeView === 'analytics'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-950/50'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 size={15} />
            <span>{t('REPORTS_VIEW_ANALYTICS')}</span>
          </button>
          <button
            type="button"
            aria-pressed={activeView === 'library'}
            onClick={() => setActiveView('library')}
            className={`inline-flex items-center justify-center gap-2 min-h-10 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer flex-1 sm:flex-initial ${
              activeView === 'library'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-950/50'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Library size={15} />
            <span>{t('REPORTS_VIEW_LIBRARY')}</span>
          </button>
        </div>
      </div>

      {activeView === 'analytics' ? (
        <AdminDashboardReportsAnalyticsPanel />
      ) : (
        <section aria-labelledby="reports-library-heading" className="w-full space-y-6">
          <div className="rounded-2xl border border-indigo-500/20 bg-card p-5 sm:p-6 shadow-card space-y-4">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <FileSpreadsheet size={12} className="text-indigo-400" />
                    Central Document Catalog
                  </span>
                </div>
                <h2 id="reports-library-heading" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {t('REPORTS_LIBRARY_TITLE')}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-400">
                  {t('REPORTS_LIBRARY_DESCRIPTION')}
                </p>
              </div>
            </header>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end justify-between pt-2">
              <label className="flex-1 text-xs font-semibold text-slate-400">
                <span className="block mb-1.5">{t('REPORTS_SEARCH_LABEL')}</span>
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.currentTarget.value)}
                    type="search"
                    placeholder="Search reports by keyword, branch or category..."
                    className="w-full min-h-10 rounded-xl border border-indigo-500/30 bg-[#0b0c20] pl-9 pr-3 text-xs text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                </div>
              </label>

              <button
                type="button"
                onClick={exportCatalog}
                className="inline-flex items-center justify-center gap-2 min-h-10 w-full sm:w-auto rounded-xl border border-indigo-500/30 bg-indigo-500/15 px-4 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-500/25 hover:text-white transition-all shadow-sm cursor-pointer shrink-0"
              >
                <Download size={14} />
                <span>{t('REPORTS_EXPORT_CATALOG')}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {reports.map((report) => {
              const meta = CATEGORY_META[report.category] ?? {
                label: report.category,
                color: '#818cf8',
                bg: 'rgba(129, 140, 248, 0.12)',
                border: 'rgba(129, 140, 248, 0.25)',
                Icon: Library,
              };
              const Icon = meta.Icon;

              return (
                <article
                  key={report.id}
                  className="rounded-2xl border border-indigo-500/20 bg-card p-5 shadow-card hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: meta.bg,
                          color: meta.color,
                          border: `1px solid ${meta.border}`,
                        }}
                      >
                        {meta.label}
                      </span>
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: meta.bg,
                          color: meta.color,
                        }}
                      >
                        <Icon size={16} strokeWidth={2.2} />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {t(report.titleKey)}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                      {t(report.descriptionKey)}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-indigo-500/15 flex items-center justify-between">
                    <p className="text-xs font-medium text-amber-400/90 flex items-center gap-1.5" role="status">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {t('REPORTS_DATA_PENDING')}
                    </p>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      System Managed
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {reports.length === 0 && (
            <div role="status" className="rounded-2xl border border-indigo-500/20 bg-card p-10 text-center text-sm text-slate-400">
              {t('REPORTS_NO_RESULTS')}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

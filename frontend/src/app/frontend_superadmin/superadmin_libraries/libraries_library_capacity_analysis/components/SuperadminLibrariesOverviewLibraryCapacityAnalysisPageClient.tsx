'use client';
import SuperadminLibrariesOverviewLibraryCapacityAnalysisEmptyState from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/components/SuperadminLibrariesOverviewLibraryCapacityAnalysisEmptyState';
/** Responsibility: Superadmin Accounting Seat Gap Report Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminLibrariesOverviewLibraryCapacityAnalysisPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useSuperadminLibrariesOverviewLibraryCapacityAnalysisUrlFilter } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/hooks/useSuperadminLibrariesOverviewLibraryCapacityAnalysisUrlFilter';
import { formatSuperadminAccountingMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/utils/SuperadminLibrariesOverviewLibraryCapacityAnalysisFormatters';
import { getSuperadminLibraryCapacityAnalysisStatusCopyKey } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/utils/superadmin_libraries_library_capacity_analysis.status';
import { SUPERADMIN_ACCOUNTING_SAMPLE_SEAT_GAPS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/mocks/fixtures/SuperadminLibrariesOverviewLibraryCapacityAnalysisSeatGapMockFixtures';
import { useTranslations, useLocale } from 'next-intl';


/**
 * Renders the libraries overview page content and coordinates its local interaction state, validation, and accessible controls.
 */
export default function SuperadminLibrariesOverviewLibraryCapacityAnalysisPageClient() {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  const locale = useLocale();
  const getShiftLabel = (shift: string) => {
    const normalized = shift.toLowerCase();
    if (normalized.startsWith('morning')) return tCopy('COPY.MORNING');
    if (normalized.startsWith('afternoon')) return tCopy('COPY.AFTERNOON');
    if (normalized.startsWith('night')) return tCopy('COPY.NIGHT');
    if (normalized.includes('24-hour')) return tCopy('COPY.TWENTY_FOUR_HOUR');
    return tCopy('COPY.SHIFT');
  };
  const [shiftFilter, setShiftFilter] = useSuperadminLibrariesOverviewLibraryCapacityAnalysisUrlFilter('shift', 'all', ['all', 'Morning', 'Afternoon', 'Night'] as const);
  const [statusFilter, setStatusFilter] = useSuperadminLibrariesOverviewLibraryCapacityAnalysisUrlFilter('status', 'all', ['all', 'vacant', 'maintenance'] as const);

  const visible = SUPERADMIN_ACCOUNTING_SAMPLE_SEAT_GAPS.filter(r =>
    (shiftFilter === 'all' || r.shift === shiftFilter) &&
    (statusFilter === 'all' || r.status === statusFilter)
  );

  const totalLoss = visible.reduce((s, r) => s + r.revenueLoss, 0);

  return (
    <div className="space-y-6">
      {(visible?.length === 0) && <SuperadminLibrariesOverviewLibraryCapacityAnalysisEmptyState filtered />}

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{tCopy("COPY.SEAT_GAP_REPORT")}</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">{tCopy("COPY.REVIEW_ILLUSTRATIVE_VACANT_SEAT_AND_ESTIMATED_REVENUE_LOSS_SAMPLES")}</p>
        <p className="mt-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-300" role="status">{tCopy("COPY.SAMPLE_VALUES_ONLY_THIS_REPORT_IS_NOT_CONNECTED_TO_LIVE_SEAT_OCCUPANCY_AND_EXPORT_REMAINS_UNAVAILABLE_WITHOUT_A_VERIFIED_REPORT_SOURCE")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        <div className="rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1a0810]/95 to-[#2a0e1a]/80 shadow-md p-4 sm:p-5 hover:scale-[1.01] transition-all">
          <p className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-1">{tCopy("COPY.TOTAL_GAP_SEATS")}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{visible.length}</p>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3"><div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400" style={{width: `${Math.min(100, visible.length * 10)}%`}} /></div>
        </div>
        <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 to-[#2c200c]/80 shadow-md p-4 sm:p-5 hover:scale-[1.01] transition-all">
          <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">{tCopy("COPY.REVENUE_LOSS")}</p>
          <p className="text-xl sm:text-2xl font-extrabold text-white">{formatSuperadminAccountingMajorPreviewCurrency(totalLoss, 'INR', locale)}</p>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3"><div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 w-[82%]" /></div>
        </div>
        <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 to-[#12163a]/80 shadow-md p-4 sm:p-5 hover:scale-[1.01] transition-all">
          <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">{tCopy("COPY.AVG_GAP_DAYS")}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{Math.round(visible.length ? visible.reduce((sum, row) => sum + row.gapDays, 0) / visible.length : 0)}</p>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 w-[60%]" /></div>
        </div>
        <div className="rounded-2xl border border-sky-500/25 bg-gradient-to-br from-[#0c1828]/95 to-[#122238]/80 shadow-md p-4 sm:p-5 hover:scale-[1.01] transition-all">
          <p className="text-xs font-semibold text-sky-300 uppercase tracking-wider mb-1">{tCopy("COPY.UNDER_MAINTENANCE")}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{visible.filter(r=>r.status==='maintenance').length}</p>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3"><div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400" style={{width: `${Math.min(100, visible.filter(r=>r.status==='maintenance').length * 20)}%`}} /></div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-[#0c0f28]/95 border border-indigo-500/25 shadow-md">
        <select aria-label={tCopy("COPY.SHIFT_FILTER")} className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none cursor-pointer w-40" value={shiftFilter} onChange={e => setShiftFilter(e.target.value as typeof shiftFilter)} data-testid="superadmin-accounting-accounting-seat-gap-report-shift-filter-1">
          <option value="all">{tCopy("COPY.ALL_SHIFTS")}</option>
          <option value="Morning">{tCopy("COPY.MORNING")}</option>
          <option value="Afternoon">{tCopy("COPY.AFTERNOON")}</option>
          <option value="Night">{tCopy("COPY.NIGHT")}</option>
        </select>
        <select aria-label={tCopy("COPY.STATUS_FILTER")} className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none cursor-pointer w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value as typeof statusFilter)} data-testid="superadmin-accounting-accounting-seat-gap-report-status-filter-2">
          <option value="all">{tCopy("COPY.ALL_STATUS")}</option>
          <option value="vacant">{tCopy("COPY.VACANT")}</option>
          <option value="maintenance">{tCopy("COPY.MAINTENANCE")}</option>
        </select>
        <button type="button" disabled title={tCopy("COPY.UNAVAILABLE_A_VERIFIED_REPORT_EXPORT_SOURCE_IS_NOT_SUPPLIED")} className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-800/60 text-slate-400 opacity-60 cursor-not-allowed" data-testid="superadmin-accounting-accounting-seat-gap-report-unavailable-a-verified-report-export-source-is-not-supplied-3">{tCopy("COPY.EXPORT")}</button>
      </div>

      <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-indigo-500/20 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              <th className="text-left py-3 px-4">{tCopy("COPY.SEAT_NO")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.SHIFT")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.FLOOR")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.LAST_OCCUPIED")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.GAP_DAYS")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.REVENUE_LOSS")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.STATUS")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/10">
            {visible.map((r) => (
              <tr key={r.seatNo} className="hover:bg-indigo-500/5 transition-colors">
                <td className="py-3 px-4 font-mono font-semibold text-white">{r.seatNo}</td>
                <td className="py-3 px-4 text-slate-300 text-xs">{getShiftLabel(r.shift)}</td>
                <td className="py-3 px-4 text-slate-300 text-xs">{tCopy(r.floor)}</td>
                <td className="py-3 px-4 text-slate-400 text-xs">{r.lastOccupied}</td>
                <td className={`py-3 px-4 text-right font-semibold text-xs ${r.gapDays > 20 ? 'text-rose-400' : 'text-amber-400'}`}>{r.gapDays}{tCopy("COPY.D")}</td>
                <td className="py-3 px-4 text-right text-rose-400 font-semibold text-xs">{tCopy('COPY.FINANCIAL_DETAIL_UNAVAILABLE_IN_PREVIEW')}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${r.status === 'vacant' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30'}`}>{tCopy(getSuperadminLibraryCapacityAnalysisStatusCopyKey(r.status))}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

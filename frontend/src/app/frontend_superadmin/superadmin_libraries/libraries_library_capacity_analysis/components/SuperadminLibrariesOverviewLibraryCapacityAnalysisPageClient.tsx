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
        <h1 className="acct-page-title">{tCopy("COPY.SEAT_GAP_REPORT")}</h1>
        <p className="acct-page-subtitle">{tCopy("COPY.REVIEW_ILLUSTRATIVE_VACANT_SEAT_AND_ESTIMATED_REVENUE_LOSS_SAMPLES")}</p>
        <p className="mt-3 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.SAMPLE_VALUES_ONLY_THIS_REPORT_IS_NOT_CONNECTED_TO_LIVE_SEAT_OCCUPANCY_AND_EXPORT_REMAINS_UNAVAILABLE_WITHOUT_A_VERIFIED_REPORT_SOURCE")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="acct-kpi-card acct-kpi-card--danger"><p className="acct-kpi-label acct-kpi-label--danger">{tCopy("COPY.TOTAL_GAP_SEATS")}</p><p className="acct-kpi-value acct-kpi-value--danger">{visible.length}</p></div>
        <div className="acct-kpi-card acct-kpi-card--warning"><p className="acct-kpi-label acct-kpi-label--warning">{tCopy("COPY.REVENUE_LOSS")}</p><p className="acct-kpi-value acct-kpi-value--warning">{formatSuperadminAccountingMajorPreviewCurrency(totalLoss, 'INR', locale)}</p></div>
        <div className="acct-kpi-card"><p className="acct-kpi-label">{tCopy("COPY.AVG_GAP_DAYS")}</p><p className="acct-kpi-value">{Math.round(visible.length ? visible.reduce((sum, row) => sum + row.gapDays, 0) / visible.length : 0)}</p></div>
        <div className="acct-kpi-card"><p className="acct-kpi-label">{tCopy("COPY.UNDER_MAINTENANCE")}</p><p className="acct-kpi-value">{visible.filter(r=>r.status==='maintenance').length}</p></div>
      </div>

      <div className="acct-filter-bar">
        <select aria-label={tCopy("COPY.SHIFT_FILTER")} className="acct-select w-40" value={shiftFilter} onChange={e => setShiftFilter(e.target.value as typeof shiftFilter)} data-testid="superadmin-accounting-accounting-seat-gap-report-shift-filter-1">
          <option value="all">{tCopy("COPY.ALL_SHIFTS")}</option>
          <option value="Morning">{tCopy("COPY.MORNING")}</option>
          <option value="Afternoon">{tCopy("COPY.AFTERNOON")}</option>
          <option value="Night">{tCopy("COPY.NIGHT")}</option>
        </select>
        <select aria-label={tCopy("COPY.STATUS_FILTER")} className="acct-select w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value as typeof statusFilter)} data-testid="superadmin-accounting-accounting-seat-gap-report-status-filter-2">
          <option value="all">{tCopy("COPY.ALL_STATUS")}</option>
          <option value="vacant">{tCopy("COPY.VACANT")}</option>
          <option value="maintenance">{tCopy("COPY.MAINTENANCE")}</option>
        </select>
        <button type="button" disabled title={tCopy("COPY.UNAVAILABLE_A_VERIFIED_REPORT_EXPORT_SOURCE_IS_NOT_SUPPLIED")} className="acct-badge acct-badge--neutral ml-auto opacity-60 cursor-not-allowed" data-testid="superadmin-accounting-accounting-seat-gap-report-unavailable-a-verified-report-export-source-is-not-supplied-3">{tCopy("COPY.EXPORT")}</button>
      </div>

      <div className="acct-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="acct-table-header-row">
              <th className="text-left py-3 px-4">{tCopy("COPY.SEAT_NO")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.SHIFT")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.FLOOR")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.LAST_OCCUPIED")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.GAP_DAYS")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.REVENUE_LOSS")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.STATUS")}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.seatNo} className="acct-table-hover-row acct-table-row">
                <td className="py-3 px-4 acct-cell-name">{r.seatNo}</td>
                <td className="py-3 px-4 acct-cell-subtext">{getShiftLabel(r.shift)}</td>
                <td className="py-3 px-4 acct-cell-subtext">{tCopy(r.floor)}</td>
                <td className="py-3 px-4 acct-cell-subtext">{r.lastOccupied}</td>
                <td className={`py-3 px-4 text-right font-semibold ${r.gapDays > 20 ? 'acct-text-danger' : 'acct-text-warning'}`}>{r.gapDays}{tCopy("COPY.D")}</td>
                <td className="py-3 px-4 text-right acct-text-danger font-semibold">{tCopy('COPY.FINANCIAL_DETAIL_UNAVAILABLE_IN_PREVIEW')}</td>
                <td className="py-3 px-4">
                  <span className={`acct-badge ${r.status === 'vacant' ? 'acct-badge--warning' : 'acct-badge--danger'}`}>{tCopy(getSuperadminLibraryCapacityAnalysisStatusCopyKey(r.status))}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

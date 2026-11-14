'use client';
import SuperadminLibrariesOverviewLibraryShiftGapAnalysisEmptyState from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_shift_gap_analysis/components/SuperadminLibrariesOverviewLibraryShiftGapAnalysisEmptyState';
/** Responsibility: Superadmin Accounting Shift Gap Analyzer Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminLibrariesOverviewLibraryShiftGapAnalysisPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useSuperadminLibrariesOverviewLibraryShiftGapAnalysisUrlFilter } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_shift_gap_analysis/hooks/useSuperadminLibrariesOverviewLibraryShiftGapAnalysisUrlFilter';
import { formatSuperadminAccountingMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_shift_gap_analysis/utils/SuperadminLibrariesOverviewLibraryShiftGapAnalysisFormatters';
import { SUPERADMIN_ACCOUNTING_SAMPLE_SHIFT_GAP_DAYS, SUPERADMIN_ACCOUNTING_SAMPLE_SHIFT_GAP_SUMMARIES } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_shift_gap_analysis/mocks/fixtures/SuperadminLibrariesOverviewLibraryShiftGapAnalysisShiftGapMockFixtures';
import { useTranslations, useLocale } from 'next-intl';


/**
 * Renders the libraries overview page content and coordinates its local interaction state, validation, and accessible controls.
 */
export default function SuperadminLibrariesOverviewLibraryShiftGapAnalysisPageClient() {
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
  const [shiftFilter, setShiftFilter] = useSuperadminLibrariesOverviewLibraryShiftGapAnalysisUrlFilter('shift', 'all', ['all', 'Morning', 'Afternoon', 'Night'] as const);

  const visibleDays = shiftFilter === 'all' ? SUPERADMIN_ACCOUNTING_SAMPLE_SHIFT_GAP_DAYS : SUPERADMIN_ACCOUNTING_SAMPLE_SHIFT_GAP_DAYS.filter(d => d.shift === shiftFilter);
  const totalLoss = SUPERADMIN_ACCOUNTING_SAMPLE_SHIFT_GAP_SUMMARIES.reduce((sum, shift) => sum + shift.revenueLoss, 0);

  return (
    <div className="space-y-6">
      {(visibleDays?.length === 0) && <SuperadminLibrariesOverviewLibraryShiftGapAnalysisEmptyState filtered />}

      <div>
        <h1 className="acct-page-title">{tCopy("COPY.SHIFT_GAP_ANALYZER")}</h1>
        <p className="acct-page-subtitle">{tCopy("COPY.REVIEW_ILLUSTRATIVE_OCCUPANCY_AND_GAP_ESTIMATES_BY_SHIFT")}</p>
        <p className="mt-3 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.SAMPLE_ESTIMATES_ONLY_OCCUPANCY_REVENUE_LOSS_AND_DAY_GAP_VALUES_ARE_NOT_LIVE_OPERATIONAL_DATA")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="acct-kpi-card acct-kpi-card--danger"><p className="acct-kpi-label acct-kpi-label--danger">{tCopy("COPY.TOTAL_REVENUE_LOSS")}</p><p className="acct-kpi-value acct-kpi-value--danger">{formatSuperadminAccountingMajorPreviewCurrency(totalLoss, 'INR', locale)}</p></div>
        <div className="acct-kpi-card acct-kpi-card--warning"><p className="acct-kpi-label acct-kpi-label--warning">{tCopy("COPY.TOTAL_VACANT_SEATS")}</p><p className="acct-kpi-value acct-kpi-value--warning">{SUPERADMIN_ACCOUNTING_SAMPLE_SHIFT_GAP_SUMMARIES.reduce((sum, shift) => sum + shift.vacant, 0)}</p></div>
        <div className="acct-kpi-card"><p className="acct-kpi-label">{tCopy("COPY.AVG_OCCUPANCY")}</p><p className="acct-kpi-value">{Math.round(SUPERADMIN_ACCOUNTING_SAMPLE_SHIFT_GAP_SUMMARIES.reduce((sum, shift) => sum + shift.occupancyPct, 0) / SUPERADMIN_ACCOUNTING_SAMPLE_SHIFT_GAP_SUMMARIES.length)}%</p></div>
        <div className="acct-kpi-card"><p className="acct-kpi-label">{tCopy("COPY.SHIFTS_ANALYZED")}</p><p className="acct-kpi-value">{SUPERADMIN_ACCOUNTING_SAMPLE_SHIFT_GAP_SUMMARIES.length}</p></div>
      </div>

      {/* Shift Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUPERADMIN_ACCOUNTING_SAMPLE_SHIFT_GAP_SUMMARIES.map((m) => (
          <div key={m.shift} className="acct-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="acct-cell-name">{getShiftLabel(m.shift)}</p>
              <span className={`acct-badge ${m.occupancyPct >= 90 ? 'acct-badge--success' : m.occupancyPct >= 70 ? 'acct-badge--warning' : 'acct-badge--danger'}`}>{m.occupancyPct}{tCopy("COPY.FULL")}</span>
            </div>
            <progress className={`acct-semantic-progress ${m.occupancyPct >= 90 ? 'acct-semantic-progress--success' : m.occupancyPct >= 70 ? 'acct-semantic-progress--warning' : 'acct-semantic-progress--danger'}`} max={100} value={m.occupancyPct} aria-label={tCopy("COPY.SHIFT_OCCUPANCY_ARIA_LABEL", { shift: m.shift })} />
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><p className="acct-cell-subtext">{tCopy("COPY.OCCUPIED")}</p><p className="acct-text-success font-semibold">{m.occupied}</p></div>
              <div><p className="acct-cell-subtext">{tCopy("COPY.VACANT")}</p><p className="acct-text-danger font-semibold">{m.vacant}</p></div>
              <div><p className="acct-cell-subtext">{tCopy("COPY.LOSS")}</p><p className="acct-text-warning font-semibold">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</p></div>
            </div>
          </div>
        ))}
      </div>

      {/* Day-wise Gap Table */}
      <div className="acct-filter-bar">
        <p className="acct-section-label">{tCopy("COPY.DAY_WISE_GAP_LOG")}</p>
        <select aria-label={tCopy("COPY.SHIFT_FILTER")} className="acct-select w-40 ml-auto" value={shiftFilter} onChange={e => setShiftFilter(e.target.value)} data-testid="superadmin-accounting-accounting-shift-gap-analyzer-shift-filter-1">
          <option value="all">{tCopy("COPY.ALL_SHIFTS")}</option>
          <option value="Morning">{tCopy("COPY.MORNING")}</option>
          <option value="Afternoon">{tCopy("COPY.AFTERNOON")}</option>
          <option value="Night">{tCopy("COPY.NIGHT")}</option>
        </select>
      </div>

      <div className="acct-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="acct-table-header-row">
              <th className="text-left py-3 px-4">{tCopy("COPY.DATE")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.SHIFT")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.SEAT_NO")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.GAP_DAYS")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.REVENUE_LOSS")}</th>
            </tr>
          </thead>
          <tbody>
            {visibleDays.map((d) => (
              <tr key={`${d.date}-${d.shift}-${d.seatNo}`} className="acct-table-hover-row acct-table-row">
                <td className="py-3 px-4 acct-cell-subtext">{d.date}</td>
                <td className="py-3 px-4"><span className="acct-badge acct-badge--neutral">{getShiftLabel(d.shift)}</span></td>
                <td className="py-3 px-4 acct-cell-name">{d.seatNo}</td>
                <td className={`py-3 px-4 text-right font-semibold ${d.gapDays > 20 ? 'acct-text-danger' : 'acct-text-warning'}`}>{d.gapDays}{tCopy("COPY.D")}</td>
                <td className="py-3 px-4 text-right acct-text-danger font-semibold">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';
import { useTranslations } from 'next-intl';
import { ShieldCheck, ShieldAlert, ShieldX, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ManagerFinanceTrustScoresEmptyState } from '@/app/frontend_manager/manager_finance/finance_trust_scores/components/manager_finance_trust_scores_empty_states/ManagerFinanceTrustScoresEmptyState';
export interface ManagerTrustScoreStudent {
  rank: number;
  studentName: string;
  smartId: string;
  shift: string;
  trustScore: number;
  totalPromises: number;
  timesChanged: number;
  fulfilledCount: number;
  badge: string;
}

export type TrustSortField = 'rank' | 'studentName' | 'shift' | 'trustScore' | 'totalPromises' | 'timesChanged' | 'fulfilledCount' | 'badge';

const BADGE_CLASS: Record<string, string> = {
  reliable: 'fin-badge fin-badge--success',
  moderate: 'fin-badge fin-badge--warning',
  low: 'fin-badge fin-badge--danger',
};

const BADGE_ICON: Record<string, typeof ShieldCheck> = {
  reliable: ShieldCheck,
  moderate: ShieldAlert,
  low: ShieldX,
};

function TrustGauge({ score }: { score: number }) {
  const colorClass = score >= 70 ? 'text-success' : score >= 40 ? 'text-warning' : 'text-danger';
  return (
    <div className="flex items-center gap-2">
      <div className="fin-trust-track">
        <div className={`fin-trust-fill mgr-progress-w-${Math.min(100, Math.round(score / 5) * 5)} ${colorClass}`} />
      </div>
      <span className={`text-sm font-semibold ${colorClass}`}>{score}</span>
    </div>
  );
}

interface ManagerFinanceTrustScoresTableProps {
  paginated: ManagerTrustScoreStudent[];
  totalRows: number;
  filteredCount: number;
  searchQuery: string;
  shiftLabels: Record<string, string>;
  sortField: TrustSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: TrustSortField) => void;
  page: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export function ManagerFinanceTrustScoresTable({
  paginated,
  totalRows,
  filteredCount,
  searchQuery,
  shiftLabels,
  sortField,
  sortDirection,
  onToggleSort,
  page,
  pageSize,
  pageCount,
  onPageChange,
  onPageSizeChange,
}: ManagerFinanceTrustScoresTableProps) {
  const tManagerUi = useTranslations('manager.manager_trust_scores.ui');
  const effectivePage = Math.min(page, pageCount - 1);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const renderSortableHeader = (field: TrustSortField, label: string, align: 'left' | 'center' | 'right' = 'left') => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className={`py-3 px-4 ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}
      >
        <button
          type="button"
          onClick={() => onToggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : ''}`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            ) : (
              <ArrowDown size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown size={14} className="text-secondary/40 group-hover:text-secondary transition-colors shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="fin-card overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="fin-table-header-row bg-surface-highlight text-xs uppercase text-secondary font-semibold">
            {renderSortableHeader('rank', tManagerUi('rank'), 'left')}
            {renderSortableHeader('studentName', tManagerUi('student'), 'left')}
            {renderSortableHeader('shift', tManagerUi('shift'), 'left')}
            {renderSortableHeader('trustScore', tManagerUi('trust_score'), 'left')}
            {renderSortableHeader('totalPromises', tManagerUi('total_promises'), 'center')}
            {renderSortableHeader('timesChanged', tManagerUi('times_changed'), 'center')}
            {renderSortableHeader('fulfilledCount', tManagerUi('fulfilled'), 'center')}
            {renderSortableHeader('badge', tManagerUi('badge'), 'left')}
          </tr>
        </thead>
        <tbody>
          {filteredCount === 0 ? (
            <tr>
              <td colSpan={8}>
                <ManagerFinanceTrustScoresEmptyState className="fin-empty-state">
                  <div className="fin-empty-state__icon">🛡️</div>
                  <p className="fin-empty-state__title">
                    {searchQuery ? 'No students found matching your search query.' : tManagerUi('start_recording_payment_promises_to_build_trust_scores')}
                  </p>
                </ManagerFinanceTrustScoresEmptyState>
              </td>
            </tr>
          ) : (
            paginated.map((s) => {
              const Icon = BADGE_ICON[s.badge] || ShieldCheck;
              return (
                <tr key={s.smartId} className="fin-table-hover-row fin-table-row border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12">
                  <td className="py-3 px-4 fin-mono">#{s.rank}</td>
                  <td className="py-3 px-4">
                    <div className="fin-cell-name">{s.studentName}</div>
                    <div className="fin-cell-subtext">{s.smartId}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="fin-badge fin-badge--neutral">{shiftLabels[s.shift] ?? s.shift}</span>
                  </td>
                  <td className="py-3 px-4">
                    <TrustGauge score={s.trustScore} />
                  </td>
                  <td className="py-3 px-4 text-center fin-text-body">{s.totalPromises}</td>
                  <td className="py-3 px-4 text-center">
                    {s.timesChanged > 0 ? (
                      <span className="fin-text-warning">{s.timesChanged}{tManagerUi('x')}</span>
                    ) : (
                      <span className="fin-text-muted">0</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center fin-text-body">{s.fulfilledCount}</td>
                  <td className="py-3 px-4">
                    <span className={`${BADGE_CLASS[s.badge] || 'fin-badge'} flex items-center gap-1 w-fit`}>
                      <Icon size={11} />
                      {s.badge === 'reliable' ? tManagerUi('reliable_9ad75f') : s.badge === 'moderate' ? tManagerUi('moderate') : tManagerUi('low_trust')}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {totalRows > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-secondary">
          <span>
            Showing {startItem}–{endItem} of {totalRows} results
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <label htmlFor="rows-per-page-finance-trust-scores" className="text-xs text-secondary whitespace-nowrap">
                Rows per page:
              </label>
              <select
                id="rows-per-page-finance-trust-scores"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="rounded border border-border bg-surface px-2 py-1 text-xs text-primary"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="mgr-btn-ghost mgr-btn-sm"
                disabled={effectivePage <= 0}
                onClick={() => onPageChange(Math.max(0, effectivePage - 1))}
              >
                Previous
              </button>
              <span className="text-xs text-secondary px-1">
                Page {effectivePage + 1} of {pageCount}
              </span>
              <button
                type="button"
                className="mgr-btn-ghost mgr-btn-sm"
                disabled={effectivePage >= pageCount - 1}
                onClick={() => onPageChange(Math.min(pageCount - 1, effectivePage + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


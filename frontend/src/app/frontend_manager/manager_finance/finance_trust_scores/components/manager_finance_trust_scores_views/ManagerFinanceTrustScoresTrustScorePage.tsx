'use client';
import { MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS } from '@/app/frontend_manager/manager_finance/finance_trust_scores/hooks/ManagerFinanceTrustScoresDemoRepository';
import { useManagerTrustScoresUrlFilters } from '@/app/frontend_manager/manager_finance/finance_trust_scores/hooks/useManagerFinanceTrustScoresUrlFilters';
import type { ManagerFinanceTrustScoresRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_trust_scores/types/ManagerFinanceTrustScoresComponentTypes';
import { sanitizeManagerTrustScoresCsvCell } from '@/app/frontend_manager/manager_finance/finance_trust_scores/utils/ManagerFinanceTrustScoresCsv';
import { Download,Printer,Search,ShieldCheck,ShieldX,Users,X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo,useState } from 'react';
import { ManagerFinanceTrustScoresTable,type TrustSortField } from './ManagerFinanceTrustScoresTable';

// RESPONSIBILITY: Entry page for the manager_trust_scores module.
// DATA FLOW: Next.js Router -> Page -> Components

const URL_FILTERS = {
  level: { defaultValue: 'all', allowedValues: ['all', 'reliable', 'moderate', 'low'] },
  shift: { defaultValue: 'all', allowedValues: ['all', 'Morning', 'Afternoon', 'Evening', 'Night', 'Full Day'] },
} as const;

export default function ManagerFinanceTrustScoresTrustScorePage(_routeQuery: ManagerFinanceTrustScoresRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_trust_scores.ui');
  const { values: urlFilters, setValue: setUrlFilter } = useManagerTrustScoresUrlFilters(URL_FILTERS);
  const levelFilter = urlFilters.level;
  const shiftFilter = urlFilters.shift;
  const shiftLabels: Record<string, string> = {
    Morning: tManagerUi('shift_morning'),
    Afternoon: tManagerUi('shift_afternoon'),
    Evening: tManagerUi('shift_evening'),
    Night: tManagerUi('shift_night'),
    'Full Day': tManagerUi('shift_full_day'),
  };

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<TrustSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (field: TrustSortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS.filter((s) => {
      const lm = levelFilter === 'all' || s.badge === levelFilter;
      const sm = shiftFilter === 'all' || s.shift === shiftFilter;
      const qm = !q || s.studentName.toLowerCase().includes(q) || s.smartId.toLowerCase().includes(q);
      return lm && sm && qm;
    });
  }, [levelFilter, shiftFilter, searchQuery]);

  const sortedRows = useMemo(() => {
    if (!sortField) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = typeof aVal === 'number' && typeof bVal === 'number'
        ? aVal - bVal
        : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDirection]);

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);

  const lowTrust = MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS.filter((s) => s.trustScore < 40).length;
  const avg = MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS.length > 0
    ? Math.round(MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS.reduce((a, s) => a + s.trustScore, 0) / MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS.length)
    : 0;

  const handleExportCsv = () => {
    const headers = ['Rank', 'Student Name', 'Smart ID', 'Shift', 'Trust Score', 'Total Promises', 'Times Changed', 'Fulfilled Count', 'Reliability Badge'];
    const csvLines = [headers.join(',')];
    for (const s of sortedRows) {
      csvLines.push([
        sanitizeManagerTrustScoresCsvCell(String(s.rank)),
        sanitizeManagerTrustScoresCsvCell(s.studentName),
        sanitizeManagerTrustScoresCsvCell(s.smartId),
        sanitizeManagerTrustScoresCsvCell(shiftLabels[s.shift] ?? s.shift),
        sanitizeManagerTrustScoresCsvCell(String(s.trustScore)),
        sanitizeManagerTrustScoresCsvCell(String(s.totalPromises)),
        sanitizeManagerTrustScoresCsvCell(String(s.timesChanged)),
        sanitizeManagerTrustScoresCsvCell(String(s.fulfilledCount)),
        sanitizeManagerTrustScoresCsvCell(s.badge),
      ].join(','));
    }
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `trust_scores_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div
      className="space-y-6"
      data-testid="manager-finance-trust-scores-page"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <h1 className="fin-page-title">{tManagerUi('trust_scores')}</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Reliability Desk
            </span>
          </div>
          <p className="fin-page-subtitle">{tManagerUi('student_reliability_rankings_based_on_payment_promise_hi_3c43fe')}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none"
            title="Export trust rankings to CSV spreadsheet"
          >
            <Download size={13} className="text-secondary" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover text-primary border border-border shadow-xs cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none"
            title="Print or Save as PDF"
          >
            <Printer size={13} className="text-secondary" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'none' }} role="status">
        <p className="fin-input-hint fin-text-warning mt-2" data-testid="manager-finance-trust-score-sample-warning">
          {tManagerUi('student_names_and_trust_scores_are_illustrative_sample_d_0de711')}
        </p>
        <button
          type="button"
          disabled
          className="fin-btn fin-btn--outline opacity-50 cursor-not-allowed"
          title={tManagerUi('payment_collection_is_disabled_until_a_verified_backend_42f394')}
        >
          {tManagerUi('actions')} (Unavailable)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="fin-kpi-card group relative overflow-hidden rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#181c4b] to-indigo-900/60 p-4 sm:p-5 shadow-lg shadow-indigo-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-400/60 hover:shadow-xl flex flex-col justify-between">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{tManagerUi('scored_students')}</span>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
                  {MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS.length}
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  Total Ranked
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Student profiles with reliability tracking</p>
            </div>
          </div>
        </div>

        <div className="fin-kpi-card fin-kpi-card--danger group relative overflow-hidden rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-950/80 via-[#260e19] to-rose-900/60 p-4 sm:p-5 shadow-lg shadow-rose-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-rose-400/60 hover:shadow-xl flex flex-col justify-between">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{tManagerUi('low_trust_less_than_40')}</span>
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
                <ShieldX size={20} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-400 font-sans">
                  {lowTrust}
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  High Risk
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Low reliability profiles · Requires advance deposit</p>
            </div>
          </div>
        </div>

        <div className="fin-kpi-card group relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-[#0e2c21] to-emerald-900/60 p-4 sm:p-5 shadow-lg shadow-emerald-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-400/60 hover:shadow-xl flex flex-col justify-between">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,34 Q25,18 55,20 T105,8 T150,14" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{tManagerUi('average_trust_score')}</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
                <ShieldCheck size={20} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400 font-sans">
                  {avg}<span className="text-sm font-normal text-emerald-300/60">/100</span>
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Campus Standing
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Campus-wide reliability benchmark</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-surface border border-border">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          <input maxLength={30}
            id="trust-scores-search-input"
            name="searchQuery"
            type="search"
            placeholder="Search student or smart ID..."
            aria-label={tManagerUi('search_by_name_or_smart_id') || 'Search student or smart ID'}
            className="mgr-input !pl-10 !pr-9 text-xs w-full focus-visible:ring-2 focus-visible:ring-primary outline-none"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setPage(0);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary p-0.5 rounded-full hover:bg-surface-hover transition-colors"
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <select
          id="trust-scores-level-filter"
          name="levelFilter"
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary hover:border-primary focus-visible:ring-2 focus-visible:ring-primary shadow-xs cursor-pointer w-full sm:w-auto min-w-[130px] outline-none"
          value={levelFilter}
          onChange={(e) => {
            setUrlFilter('level', e.target.value);
            setPage(0);
          }}
          aria-label={tManagerUi('all_levels')}
        >
          <option value="all">{tManagerUi('all_levels')}</option>
          <option value="reliable">{tManagerUi('reliable')}</option>
          <option value="moderate">{tManagerUi('moderate_ea8b09')}</option>
          <option value="low">{tManagerUi('low_trust_056d0a')}</option>
        </select>
        <select
          id="trust-scores-shift-filter"
          name="shiftFilter"
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary hover:border-primary focus-visible:ring-2 focus-visible:ring-primary shadow-xs cursor-pointer w-full sm:w-auto min-w-[130px] outline-none"
          value={shiftFilter}
          onChange={(e) => {
            setUrlFilter('shift', e.target.value);
            setPage(0);
          }}
          aria-label={tManagerUi('all_shifts')}
        >
          <option value="all">{tManagerUi('all_shifts')}</option>
          <option value="Morning">{tManagerUi('morning')}</option>
          <option value="Afternoon">{tManagerUi('afternoon')}</option>
          <option value="Evening">{tManagerUi('evening')}</option>
          <option value="Night">{tManagerUi('night')}</option>
          <option value="Full Day">{tManagerUi('full_day')}</option>
        </select>
        {(levelFilter !== 'all' || shiftFilter !== 'all' || searchQuery.trim() !== '') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setUrlFilter('level', 'all');
              setUrlFilter('shift', 'all');
              setPage(0);
            }}
            className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer focus-visible:ring-2 focus-visible:ring-primary shadow-xs outline-none transition-colors"
          >
            <X size={13} /> Reset Filters
          </button>
        )}
      </div>

      <ManagerFinanceTrustScoresTable
        paginated={paginated}
        totalRows={totalRows}
        filteredCount={filtered.length}
        searchQuery={searchQuery}
        shiftLabels={shiftLabels}
        sortField={sortField}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        page={effectivePage}
        pageSize={pageSize}
        pageCount={pageCount}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(0);
        }}
      />
    </div>
  );
}

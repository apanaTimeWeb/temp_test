'use client';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS } from '@/app/frontend_manager/manager_finance/finance_trust_scores/hooks/ManagerFinanceTrustScoresDemoRepository';
import { useManagerTrustScoresUrlFilters } from '@/app/frontend_manager/manager_finance/finance_trust_scores/hooks/useManagerFinanceTrustScoresUrlFilters';
import { ShieldCheck, ShieldX, Users, Search } from 'lucide-react';
import type { ManagerFinanceTrustScoresRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_trust_scores/types/ManagerFinanceTrustScoresComponentTypes';
import { ManagerFinanceTrustScoresTable, type TrustSortField } from './ManagerFinanceTrustScoresTable';

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

  return (
    <div
      className="space-y-6"
      data-testid="manager-finance-trust-scores-page"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="fin-page-title">{tManagerUi('trust_scores')}</h1>
          <p className="fin-page-subtitle">{tManagerUi('student_reliability_rankings_based_on_payment_promise_hi_3c43fe')}</p>
          <p className="fin-input-hint fin-text-warning mt-2" data-testid="manager-finance-trust-score-sample-warning" role="status">
            {tManagerUi('student_names_and_trust_scores_are_illustrative_sample_d_0de711')}
          </p>
        </div>
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
      <div className="grid gap-4 md:grid-cols-3">
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label">{tManagerUi('scored_students')}</span>
            <Users size={16} className="fin-icon-muted" />
          </div>
          <p className="fin-kpi-value">{MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS.length}</p>
        </div>
        <div className="fin-kpi-card fin-kpi-card--danger">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label fin-kpi-label--danger">{tManagerUi('low_trust_less_than_40')}</span>
            <ShieldX size={16} className="fin-text-danger" />
          </div>
          <p className="fin-kpi-value fin-kpi-value--danger">{lowTrust}</p>
        </div>
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label">{tManagerUi('average_trust_score')}</span>
            <ShieldCheck size={16} className="fin-icon-muted" />
          </div>
          <p className="fin-kpi-value">{avg}</p>
        </div>
      </div>

      <div className="fin-filter-bar flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            placeholder="Search student or smart ID..."
            className="mgr-input pl-8 text-xs w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <select
          className="fin-select w-40"
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
          className="fin-select w-40"
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
        page={page}
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

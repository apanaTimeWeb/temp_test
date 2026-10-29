'use client';
import { useTranslations } from 'next-intl';
import { MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS } from '@/app/frontend_manager/manager_finance/finance_trust_scores/hooks/ManagerFinanceTrustScoresDemoRepository';
import { useManagerTrustScoresUrlFilters } from '@/app/frontend_manager/manager_finance/finance_trust_scores/hooks/useManagerFinanceTrustScoresUrlFilters';

// RESPONSIBILITY: Entry page for the manager_trust_scores module.
// DATA FLOW: Next.js Router -> Page -> Components


// RESPONSIBILITY: Entry page for the manager_trust_scores module.
// DATA FLOW: Next.js Router -> Page -> Components
import { ShieldCheck, ShieldAlert, ShieldX, Users } from 'lucide-react';
import { ManagerFinanceTrustScoresEmptyState } from '@/app/frontend_manager/manager_finance/finance_trust_scores/components/manager_finance_trust_scores_empty_states/ManagerFinanceTrustScoresEmptyState';
import type { ManagerFinanceTrustScoresRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_trust_scores/types/ManagerFinanceTrustScoresComponentTypes';


const BADGE_CLASS: Record<string, string> = {
  reliable: 'fin-badge fin-badge--success',
  moderate: 'fin-badge fin-badge--warning',
  low:      'fin-badge fin-badge--danger',
};

const BADGE_ICON: Record<string, typeof ShieldCheck> = {
  reliable: ShieldCheck,
  moderate: ShieldAlert,
  low:      ShieldX,
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

const URL_FILTERS = {
  level: { defaultValue: 'all', allowedValues: ['all', 'reliable', 'moderate', 'low'] },
  shift: { defaultValue: 'all', allowedValues: ['all', 'Morning', 'Evening', 'Full Day'] },
} as const;


export default function ManagerFinanceTrustScoresTrustScorePage(_routeQuery: ManagerFinanceTrustScoresRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_trust_scores.ui');
  const { values: urlFilters, setValue: setUrlFilter } = useManagerTrustScoresUrlFilters(URL_FILTERS);
  const levelFilter = urlFilters.level;
  const shiftFilter = urlFilters.shift;
  const shiftLabels: Record<string, string> = { Morning: tManagerUi('shift_morning'), Afternoon: tManagerUi('shift_afternoon'), Evening: tManagerUi('shift_evening'), Night: tManagerUi('shift_night'), 'Full Day': tManagerUi('shift_full_day') };

  const filtered = MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS.filter((s) => {
    const lm = levelFilter === 'all' || s.badge === levelFilter;
    const sm = shiftFilter === 'all' || s.shift === shiftFilter;
    return lm && sm;
  });

  const lowTrust = MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS.filter((s) => s.trustScore < 40).length;
  const avg = Math.round(MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS.reduce((a, s) => a + s.trustScore, 0) / MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fin-page-title">{tManagerUi('trust_scores')}</h1>
        <p className="fin-page-subtitle">{tManagerUi('student_reliability_rankings_based_on_payment_promise_hi_3c43fe')}</p>
        <p className="fin-input-hint fin-text-warning mt-2" data-testid="manager-finance-trust-score-sample-warning" role="status">{tManagerUi('student_names_and_trust_scores_are_illustrative_sample_d_0de711')}</p>
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

      <div className="fin-filter-bar">
        <select className="fin-select w-40" value={levelFilter} onChange={(e) => setUrlFilter('level', e.target.value)} aria-label={tManagerUi('all_levels')}>
          <option value="all">{tManagerUi('all_levels')}</option>
          <option value="reliable">{tManagerUi('reliable')}</option>
          <option value="moderate">{tManagerUi('moderate_ea8b09')}</option>
          <option value="low">{tManagerUi('low_trust_056d0a')}</option>
        </select>
        <select className="fin-select w-40" value={shiftFilter} onChange={(e) => setUrlFilter('shift', e.target.value)} aria-label={tManagerUi('all_shifts')}>
          <option value="all">{tManagerUi('all_shifts')}</option>
          <option value="Morning">{tManagerUi('morning')}</option>
          <option value="Evening">{tManagerUi('evening')}</option>
          <option value="Full Day">{tManagerUi('full_day')}</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tManagerUi('rank')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('student')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('shift')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('trust_score')}</th>
              <th className="text-center py-3 px-4">{tManagerUi('total_promises')}</th>
              <th className="text-center py-3 px-4">{tManagerUi('times_changed')}</th>
              <th className="text-center py-3 px-4">{tManagerUi('fulfilled')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('badge')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <ManagerFinanceTrustScoresEmptyState className="fin-empty-state">
                    <div className="fin-empty-state__icon">🛡️</div>
                    <p className="fin-empty-state__title">{tManagerUi('start_recording_payment_promises_to_build_trust_scores')}</p>
                  </ManagerFinanceTrustScoresEmptyState>
                </td>
              </tr>
            ) : (
              filtered.map((s) => {
                const Icon = BADGE_ICON[s.badge] || ShieldCheck;
                return (
                  <tr key={s.smartId} className="fin-table-hover-row fin-table-row">
                    <td className="py-3 px-4 fin-mono">#{s.rank}</td>
                    <td className="py-3 px-4">
                      <div className="fin-cell-name"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>{s.studentName}</div>
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
      </div>
    </div>
  );
}

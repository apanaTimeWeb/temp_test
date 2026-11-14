'use client';
import SuperadminFinanceTrustScoreEmptyState from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/components/SuperadminUsersOverviewMemberTrustScoreEmptyState';
/** Responsibility: Superadmin Finance Trust Score Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route props -> SuperadminUsersOverviewMemberTrustScorePageClient -> typed leaf-owned child components; sibling business modules are not required. */
import { useSuperadminUsersOverviewMemberTrustScoreUrlFilter } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/hooks/useSuperadminUsersOverviewMemberTrustScoreUrlFilter';

import { useTranslations } from 'next-intl';

import { ShieldCheck, ShieldX, Users } from 'lucide-react';
import { SUPERADMIN_FINANCE_TRUST_SCORE_PAGE_CLIENT_TRUST_TONE_TEXT_CLASS } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/constants/SuperadminUsersOverviewMemberTrustScoreStaticConstants';
import { SUPERADMIN_FINANCE_TRUST_SCORE_PAGE_CLIENT_BADGE_ICON } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/constants/SuperadminUsersOverviewMemberTrustScoreStaticConstants';
import { SUPERADMIN_FINANCE_TRUST_SCORE_PAGE_CLIENT_BADGE_CLASS } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/constants/SuperadminUsersOverviewMemberTrustScoreStaticConstants';
import { SUPERADMIN_MEMBER_TRUST_SCORE_THRESHOLDS } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/constants/SuperadminUsersOverviewMemberTrustScoreStaticConstants';
import type { Student, TrustTone } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/types/SuperadminUsersOverviewMemberTrustScorePageClientComponentTypes';
import { SUPERADMIN_USERS_MEMBER_TRUST_SCORE_MOCK_STUDENTS } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/mocks/fixtures/SuperadminUsersOverviewMemberTrustScoreMockFixtures';
import { useSuperadminUsersMemberTrustScorePreviewScenario } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/state/SuperadminUsersMemberTrustScorePreviewScenario';


function TrustGauge({ score, ariaLabel }: { score: number; ariaLabel: string }) {
  const tone: TrustTone = score >= SUPERADMIN_MEMBER_TRUST_SCORE_THRESHOLDS.RELIABLE_MIN ? 'success' : score >= SUPERADMIN_MEMBER_TRUST_SCORE_THRESHOLDS.LOW_MAX_EXCLUSIVE ? 'warning' : 'danger';
  return (
    <div className="flex items-center gap-2">
      <progress className={`fin-semantic-progress fin-semantic-progress--${tone}`} max={100} value={score} aria-label={ariaLabel} />
      <span className={`text-sm font-semibold ${SUPERADMIN_FINANCE_TRUST_SCORE_PAGE_CLIENT_TRUST_TONE_TEXT_CLASS[tone]}`}>{score}</span>
    </div>
  );
}

/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminUsersOverviewMemberTrustScorePageClient`.
 * Renders explicitly labeled local preview trust-score data without a simulated network delay.
 */
export default function SuperadminUsersOverviewMemberTrustScorePageClient() {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const [levelFilter, setLevelFilter] = useSuperadminUsersOverviewMemberTrustScoreUrlFilter('trustLevel', 'all');
  const [shiftFilter, setShiftFilter] = useSuperadminUsersOverviewMemberTrustScoreUrlFilter('shift', 'all');
  const scenario = useSuperadminUsersMemberTrustScorePreviewScenario();
  const mockStudents = scenario === 'EMPTY_DATA' ? [] : SUPERADMIN_USERS_MEMBER_TRUST_SCORE_MOCK_STUDENTS;

  const filtered = mockStudents.filter((s) => {
    const lm = levelFilter === 'all' || s.badge === levelFilter;
    const sm = shiftFilter === 'all' || s.shift === shiftFilter;
    return lm && sm;
  });

  const lowTrust = mockStudents.filter((s) => s.trustScore < SUPERADMIN_MEMBER_TRUST_SCORE_THRESHOLDS.LOW_MAX_EXCLUSIVE).length;
  const avg = mockStudents.length ? Math.round(mockStudents.reduce((a, s) => a + s.trustScore, 0) / mockStudents.length) : 0;

  return (
    <div className="space-y-6" data-preview-scenario={scenario}>
      {filtered.length === 0 && <SuperadminFinanceTrustScoreEmptyState filtered />}
      <div>
        <h1 className="fin-page-title">{tCopy("COPY.TRUST_SCORES")}</h1>
        <p className="fin-page-subtitle">{tCopy("COPY.STUDENT_RELIABILITY_RANKINGS_BASED_ON_PAYMENT_PROMISE_HISTORY")}</p>
        <p className="mt-3 rounded-lg border border-border bg-info-bg p-3 text-sm text-info" role="status">{tCopy("COPY.PREVIEW_ONLY_DISCLOSURE")}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label">{tCopy("COPY.SCORED_STUDENTS")}</span>
            <Users size={16} className="fin-icon-muted" />
          </div>
          <p className="fin-kpi-value">{mockStudents.length}</p>
        </div>
        <div className="fin-kpi-card fin-kpi-card--danger">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label fin-kpi-label--danger">{tCopy("COPY.LOW_TRUST_40")}</span>
            <ShieldX size={16} className="fin-text-danger" />
          </div>
          <p className="fin-kpi-value fin-kpi-value--danger">{lowTrust}</p>
        </div>
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label">{tCopy("COPY.AVERAGE_TRUST_SCORE")}</span>
            <ShieldCheck size={16} className="fin-icon-muted" />
          </div>
          <p className="fin-kpi-value">{avg}</p>
        </div>
      </div>

      <div className="fin-filter-bar">
        <select aria-label={tCopy("COPY.LEVEL_FILTER")} className="fin-select w-40" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} data-testid="superadmin-finance-finance-trust-score-level-filter-1">
          <option value="all">{tCopy("COPY.ALL_LEVELS")}</option>
          <option value="reliable">{tCopy("COPY.RELIABLE")}</option>
          <option value="moderate">{tCopy("COPY.MODERATE")}</option>
          <option value="low">{tCopy("COPY.LOW_TRUST")}</option>
        </select>
        <select aria-label={tCopy("COPY.SHIFT_FILTER")} className="fin-select w-40" value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)} data-testid="superadmin-finance-finance-trust-score-shift-filter-2">
          <option value="all">{tCopy("COPY.ALL_SHIFTS")}</option>
          <option value="Morning">{tCopy("COPY.MORNING")}</option>
          <option value="Evening">{tCopy("COPY.EVENING")}</option>
          <option value="Full Day">{tCopy("COPY.FULL_DAY")}</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tCopy("COPY.RANK")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.STUDENT")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.SHIFT")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.TRUST_SCORE")}</th>
              <th className="text-center py-3 px-4">{tCopy("COPY.TOTAL_PROMISES")}</th>
              <th className="text-center py-3 px-4">{tCopy("COPY.TIMES_CHANGED")}</th>
              <th className="text-center py-3 px-4">{tCopy("COPY.FULFILLED")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.BADGE")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="fin-empty-state">
                    <div className="fin-empty-state__icon">🛡️</div>
                    <p className="fin-empty-state__title">{tCopy("COPY.START_RECORDING_PAYMENT_PROMISES_TO_BUILD_TRUST_SCORES")}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((s) => {
                const Icon = SUPERADMIN_FINANCE_TRUST_SCORE_PAGE_CLIENT_BADGE_ICON[s.badge] || ShieldCheck;
                return (
                  <tr key={s.smartId} className="fin-table-hover-row fin-table-row">
                    <td className="py-3 px-4 fin-mono">#{s.rank}</td>
                    <td className="py-3 px-4">
                      <div className="fin-cell-name">{s.studentName}</div>
                      <div className="fin-cell-subtext">{s.smartId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="fin-badge fin-badge--neutral">{s.shift}</span>
                    </td>
                    <td className="py-3 px-4">
                      <TrustGauge score={s.trustScore} ariaLabel={tCopy("COPY.TRUST_SCORE_OUT_OF_100_ARIA_LABEL", { score: s.trustScore })} />
                    </td>
                    <td className="py-3 px-4 text-center fin-text-body">{s.totalPromises}</td>
                    <td className="py-3 px-4 text-center">
                      {s.timesChanged > 0 ? (
                        <span className="fin-text-warning">{s.timesChanged}{tCopy("COPY.X")}</span>
                      ) : (
                        <span className="fin-text-muted">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center fin-text-body">{s.fulfilledCount}</td>
                    <td className="py-3 px-4">
                      <span className={`${SUPERADMIN_FINANCE_TRUST_SCORE_PAGE_CLIENT_BADGE_CLASS[s.badge] || 'fin-badge'} flex items-center gap-1 w-fit`}>
                        <Icon size={11} />
                        {s.badge === 'reliable' ? tCopy('COPY.TRUST_RELIABLE') : s.badge === 'moderate' ? tCopy('COPY.TRUST_MODERATE') : tCopy('COPY.TRUST_LOW')}
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

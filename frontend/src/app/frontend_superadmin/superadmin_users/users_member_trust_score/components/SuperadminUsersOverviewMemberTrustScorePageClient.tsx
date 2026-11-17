'use client';
import SuperadminFinanceTrustScoreEmptyState from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/components/SuperadminUsersOverviewMemberTrustScoreEmptyState';
/** Responsibility: Superadmin Finance Trust Score Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route props -> SuperadminUsersOverviewMemberTrustScorePageClient -> typed leaf-owned child components; sibling business modules are not required. */
import { useSuperadminUsersOverviewMemberTrustScoreUrlFilter } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/hooks/useSuperadminUsersOverviewMemberTrustScoreUrlFilter';

import { useTranslations } from 'next-intl';

import { ShieldCheck, ShieldX, Users, Award, RotateCcw, Sparkles } from 'lucide-react';
import { SUPERADMIN_FINANCE_TRUST_SCORE_PAGE_CLIENT_TRUST_TONE_TEXT_CLASS } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/constants/SuperadminUsersOverviewMemberTrustScoreStaticConstants';
import { SUPERADMIN_FINANCE_TRUST_SCORE_PAGE_CLIENT_BADGE_ICON } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/constants/SuperadminUsersOverviewMemberTrustScoreStaticConstants';
import { SUPERADMIN_MEMBER_TRUST_SCORE_THRESHOLDS } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/constants/SuperadminUsersOverviewMemberTrustScoreStaticConstants';
import type { TrustTone } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/types/SuperadminUsersOverviewMemberTrustScorePageClientComponentTypes';
import { SUPERADMIN_USERS_MEMBER_TRUST_SCORE_MOCK_STUDENTS } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/mocks/fixtures/SuperadminUsersOverviewMemberTrustScoreMockFixtures';
import { useSuperadminUsersMemberTrustScorePreviewScenario } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/state/SuperadminUsersMemberTrustScorePreviewScenario';

function TrustGauge({ score, ariaLabel }: { score: number; ariaLabel: string }) {
  const tone: TrustTone = score >= SUPERADMIN_MEMBER_TRUST_SCORE_THRESHOLDS.RELIABLE_MIN ? 'success' : score >= SUPERADMIN_MEMBER_TRUST_SCORE_THRESHOLDS.LOW_MAX_EXCLUSIVE ? 'warning' : 'danger';
  const barColor = tone === 'success' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : tone === 'warning' ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-rose-500 to-rose-400';
  const textColor = tone === 'success' ? 'text-emerald-400' : tone === 'warning' ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="flex items-center gap-2.5 min-w-28">
      <div className="h-2 w-20 rounded-full bg-slate-800 overflow-hidden" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label={ariaLabel}>
        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
      </div>
      <span className={`text-xs font-bold tabular-nums ${textColor}`}>{score}</span>
    </div>
  );
}

/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminUsersOverviewMemberTrustScorePageClient`.
 * Renders explicitly labeled local preview trust-score data without a simulated network delay.
 */
export default function SuperadminUsersOverviewMemberTrustScorePageClient() {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const [levelFilter, setLevelFilter] = useSuperadminUsersOverviewMemberTrustScoreUrlFilter<string>('trustLevel', 'all');
  const [shiftFilter, setShiftFilter] = useSuperadminUsersOverviewMemberTrustScoreUrlFilter<string>('shift', 'all');
  const scenario = useSuperadminUsersMemberTrustScorePreviewScenario();
  const mockStudents = scenario === 'EMPTY_DATA' ? [] : SUPERADMIN_USERS_MEMBER_TRUST_SCORE_MOCK_STUDENTS;

  const filtered = mockStudents.filter((s) => {
    const lm = levelFilter === 'all' || s.badge === levelFilter;
    const sm = shiftFilter === 'all' || s.shift === shiftFilter;
    return lm && sm;
  });

  const lowTrust = mockStudents.filter((s) => s.trustScore < SUPERADMIN_MEMBER_TRUST_SCORE_THRESHOLDS.LOW_MAX_EXCLUSIVE).length;
  const avg = mockStudents.length ? Math.round(mockStudents.reduce((a, s) => a + s.trustScore, 0) / mockStudents.length) : 0;

  const handleResetFilters = () => {
    setLevelFilter('all');
    setShiftFilter('all');
  };

  const isFiltered = levelFilter !== 'all' || shiftFilter !== 'all';

  return (
    <div className="w-full max-w-full min-w-0 space-y-6" data-preview-scenario={scenario}>
      {filtered.length === 0 && <SuperadminFinanceTrustScoreEmptyState filtered />}

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card/90 border border-border/80 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-sm">
            <Award size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">{tCopy("COPY.TRUST_SCORES")}</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Scoring Active</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{tCopy("COPY.STUDENT_RELIABILITY_RANKINGS_BASED_ON_PAYMENT_PROMISE_HISTORY")}</p>
          </div>
        </div>
      </div>

      <p className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3.5 text-xs sm:text-sm text-indigo-300 flex items-start gap-2.5" role="status">
        <Sparkles size={16} className="text-indigo-400 shrink-0 mt-0.5" />
        <span>{tCopy("COPY.PREVIEW_ONLY_DISCLOSURE")}</span>
      </p>

      {/* 3 KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* KPI 1: Scored Students (Indigo) */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-card/90 to-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300/80 uppercase tracking-wider">{tCopy("COPY.SCORED_STUDENTS")}</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Users size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-100 tabular-nums">{mockStudents.length}</p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-indigo-950/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* KPI 2: Low Trust (Rose) */}
        <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-card/90 to-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300/80 uppercase tracking-wider">{tCopy("COPY.LOW_TRUST_40")}</span>
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <ShieldX size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-rose-400 tabular-nums">{lowTrust}</p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-rose-950/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full" style={{ width: `${(lowTrust / Math.max(1, mockStudents.length)) * 100}%` }} />
          </div>
        </div>

        {/* KPI 3: Average Trust Score (Emerald) */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-card/90 to-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300/80 uppercase tracking-wider">{tCopy("COPY.AVERAGE_TRUST_SCORE")}</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">{avg} / 100</p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-emerald-950/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${avg}%` }} />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card/90 border border-border/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label={tCopy("COPY.LEVEL_FILTER")}
            className="w-full sm:w-44 rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            data-testid="superadmin-finance-finance-trust-score-level-filter-1"
          >
            <option value="all" className="bg-slate-900 text-slate-100">{tCopy("COPY.ALL_LEVELS")}</option>
            <option value="reliable" className="bg-slate-900 text-slate-100">{tCopy("COPY.RELIABLE")}</option>
            <option value="moderate" className="bg-slate-900 text-slate-100">{tCopy("COPY.MODERATE")}</option>
            <option value="low" className="bg-slate-900 text-slate-100">{tCopy("COPY.LOW_TRUST")}</option>
          </select>

          <select
            aria-label={tCopy("COPY.SHIFT_FILTER")}
            className="w-full sm:w-44 rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            data-testid="superadmin-finance-finance-trust-score-shift-filter-2"
          >
            <option value="all" className="bg-slate-900 text-slate-100">{tCopy("COPY.ALL_SHIFTS")}</option>
            <option value="Morning" className="bg-slate-900 text-slate-100">{tCopy("COPY.MORNING")}</option>
            <option value="Evening" className="bg-slate-900 text-slate-100">{tCopy("COPY.EVENING")}</option>
            <option value="Full Day" className="bg-slate-900 text-slate-100">{tCopy("COPY.FULL_DAY")}</option>
          </select>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <RotateCcw size={14} className="text-rose-400" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-b border-border/80">{tCopy("COPY.RANK")}</th>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-b border-border/80">{tCopy("COPY.STUDENT")}</th>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-b border-border/80">{tCopy("COPY.SHIFT")}</th>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-b border-border/80">{tCopy("COPY.TRUST_SCORE")}</th>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-b border-border/80 text-center">{tCopy("COPY.TOTAL_PROMISES")}</th>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-b border-border/80 text-center">{tCopy("COPY.TIMES_CHANGED")}</th>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-b border-border/80 text-center">{tCopy("COPY.FULFILLED")}</th>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-b border-border/80">{tCopy("COPY.BADGE")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">{tCopy("COPY.START_RECORDING_PAYMENT_PROMISES_TO_BUILD_TRUST_SCORES")}</p>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const Icon = SUPERADMIN_FINANCE_TRUST_SCORE_PAGE_CLIENT_BADGE_ICON[s.badge] || ShieldCheck;
                  return (
                    <tr key={s.smartId} className="hover:bg-indigo-500/5 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400 font-semibold">#{s.rank}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-100">{s.studentName}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{s.smartId}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-border/80">{s.shift}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <TrustGauge score={s.trustScore} ariaLabel={tCopy("COPY.TRUST_SCORE_OUT_OF_100_ARIA_LABEL", { score: s.trustScore })} />
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-100 tabular-nums">{s.totalPromises}</td>
                      <td className="py-3.5 px-4 text-center">
                        {s.timesChanged > 0 ? (
                          <span className="font-semibold text-amber-400 tabular-nums">{s.timesChanged}{tCopy("COPY.X")}</span>
                        ) : (
                          <span className="text-slate-500 tabular-nums">0</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-100 tabular-nums">{s.fulfilledCount}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          s.badge === 'reliable' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                          s.badge === 'moderate' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
                          'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}>
                          <Icon size={12} />
                          <span>{s.badge === 'reliable' ? tCopy('COPY.TRUST_RELIABLE') : s.badge === 'moderate' ? tCopy('COPY.TRUST_MODERATE') : tCopy('COPY.TRUST_LOW')}</span>
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
    </div>
  );
}

'use client';
import SuperadminUsersOverviewMemberReferralsEmptyState from '@/app/frontend_superadmin/superadmin_users/users_member_referrals/components/SuperadminUsersOverviewMemberReferralsEmptyState';
import { useSuperadminUsersMemberReferralsExpandedState } from '@/app/frontend_superadmin/superadmin_users/users_member_referrals/hooks/useSuperadminUsersMemberReferralsExpandedState';
/** Responsibility: Superadmin Finance Referrals Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route props -> SuperadminUsersOverviewMemberReferralsPageClient -> typed leaf-owned child components; sibling business modules are not required. */

import { useTranslations, useLocale } from 'next-intl';

import { formatMajorUnitPreviewCurrency } from '@/app/frontend_superadmin/superadmin_users/users_member_referrals/utils/SuperadminUsersOverviewMemberReferralsFormatters';
import { Users, Trophy, IndianRupee, Share2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import type { Referrer } from '@/app/frontend_superadmin/superadmin_users/users_member_referrals/types/SuperadminUsersOverviewMemberReferralsPageClientComponentTypes';
import { SUPERADMIN_USERS_MEMBER_REFERRALS_MOCK_REFERRERS } from '@/app/frontend_superadmin/superadmin_users/users_member_referrals/mocks/fixtures/SuperadminUsersOverviewMemberReferralsMockFixtures';
import { useSuperadminUsersMemberReferralsPreviewScenario } from '@/app/frontend_superadmin/superadmin_users/users_member_referrals/state/SuperadminUsersMemberReferralsPreviewScenario';

/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminUsersOverviewMemberReferralsPageClient`.
 * Renders explicitly labeled local preview data without a simulated network delay.
 */
export default function SuperadminUsersOverviewMemberReferralsPageClient() {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const { expanded, setExpanded } = useSuperadminUsersMemberReferralsExpandedState();
  const scenario = useSuperadminUsersMemberReferralsPreviewScenario();
  const mockReferrers = scenario === 'EMPTY_DATA' ? [] : SUPERADMIN_USERS_MEMBER_REFERRALS_MOCK_REFERRERS;
  const totalReferrals = mockReferrers.reduce((total, row) => total + row.referredCount, 0);
  const totalBonus = mockReferrers.reduce((total, row) => total + row.bonusEarned, 0);
  const totalRedeemed = mockReferrers.reduce((total, row) => total + row.redeemed, 0);
  const totalBalance = mockReferrers.reduce((total, row) => total + row.balance, 0);
  const topReferrer = mockReferrers[0];

  return (
    <div className="w-full max-w-full min-w-0 space-y-6" data-preview-scenario={scenario}>
      {(mockReferrers?.length === 0) && <SuperadminUsersOverviewMemberReferralsEmptyState filtered />}

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card/90 border border-border/80 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-sm">
            <Share2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">{tCopy("COPY.REFERRALS_AND_BONUSES")}</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Program Active</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{tCopy("COPY.STUDENT_REFERRAL_LEADERBOARD_AND_BONUS_TRACKING")}</p>
          </div>
        </div>
      </div>

      <p className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3.5 text-xs sm:text-sm text-indigo-300 flex items-start gap-2.5" role="status">
        <Sparkles size={16} className="text-indigo-400 shrink-0 mt-0.5" />
        <span>{tCopy("COPY.PREVIEW_ONLY_DISCLOSURE")}</span>
      </p>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* KPI 1: Total Referrals */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-card/90 to-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300/80 uppercase tracking-wider">{tCopy("COPY.TOTAL_REFERRALS_MADE")}</span>
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Users size={16} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-100 tabular-nums">{totalReferrals}</p>
          <div className="mt-2.5 h-1.5 w-full rounded-full bg-indigo-950/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" style={{ width: '80%' }} />
          </div>
        </div>

        {/* KPI 2: Total Bonus */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-card/90 to-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300/80 uppercase tracking-wider">{tCopy("COPY.TOTAL_BONUS_ISSUED")}</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <IndianRupee size={16} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">{formatMajorUnitPreviewCurrency(totalBonus, 'INR', locale)}</p>
          <div className="mt-2.5 h-1.5 w-full rounded-full bg-emerald-950/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '70%' }} />
          </div>
        </div>

        {/* KPI 3: Redeemed */}
        <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/40 via-card/90 to-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-300/80 uppercase tracking-wider">{tCopy("COPY.REDEEMED")}</span>
            <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <IndianRupee size={16} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-100 tabular-nums">{formatMajorUnitPreviewCurrency(totalRedeemed, 'INR', locale)}</p>
          <div className="mt-2.5 h-1.5 w-full rounded-full bg-sky-950/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full" style={{ width: '60%' }} />
          </div>
        </div>

        {/* KPI 4: Balance */}
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-card/90 to-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-300/80 uppercase tracking-wider">{tCopy("COPY.BALANCE")}</span>
            <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
              <IndianRupee size={16} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-100 tabular-nums">{formatMajorUnitPreviewCurrency(totalBalance, 'INR', locale)}</p>
          <div className="mt-2.5 h-1.5 w-full rounded-full bg-purple-950/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" style={{ width: '45%' }} />
          </div>
        </div>

        {/* KPI 5: Top Referrer */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-card/90 to-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300/80 uppercase tracking-wider">{tCopy("COPY.TOP_REFERRER")}</span>
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Trophy size={16} />
            </div>
          </div>
          <p className="mt-3 text-xl font-extrabold text-amber-300 truncate">{topReferrer?.name ?? '—'}</p>
          <p className="text-xs text-amber-400/80 mt-1 font-semibold">{topReferrer ? `${topReferrer.referredCount} ${tCopy("COPY.REFERRALS")}` : '—'}</p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-b border-border/80">{tCopy("COPY.RANK")}</th>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-b border-border/80">{tCopy("COPY.REFERRER")}</th>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-b border-border/80">{tCopy("COPY.REFERRED_STUDENTS")}</th>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-b border-border/80 text-center">{tCopy("COPY.REFERRED_COUNT")}</th>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-b border-border/80 text-right">{tCopy("COPY.BONUS_EARNED")}</th>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-b border-border/80 text-right">{tCopy("COPY.REDEEMED")}</th>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-b border-border/80 text-right">{tCopy("COPY.BALANCE")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockReferrers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">{tCopy("COPY.NO_REFERRALS_RECORDED_YET")}</p>
                  </td>
                </tr>
              ) : (
                mockReferrers.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-indigo-500/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                        idx === 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        idx === 1 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40' :
                        idx === 2 ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40' :
                        'text-slate-400'
                      }`}>
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{r.name}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{r.smartId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        id={`superadmin-referrals-trigger-${String(r.id)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold cursor-pointer transition-all"
                        onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                        aria-expanded={expanded === r.id}
                        aria-controls={`superadmin-referrals-students-${String(r.id)}`}
                        data-testid={`superadmin-finance-finance-referrals-students-1-${String(r.id)}`}
                      >
                        {expanded === r.id ? <ChevronUp size={13} className="text-indigo-400" /> : <ChevronDown size={13} className="text-indigo-400" />}
                        <span>{r.referredCount} {tCopy("COPY.STUDENTS")}</span>
                      </button>
                      <div
                        id={`superadmin-referrals-students-${String(r.id)}`}
                        role="region"
                        aria-labelledby={`superadmin-referrals-trigger-${String(r.id)}`}
                        hidden={expanded !== r.id}
                        className={expanded === r.id ? 'flex flex-wrap gap-1.5 mt-2.5' : 'hidden'}
                      >
                        {r.referredNames.map((name) => (
                          <span key={name} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-border/80">
                            {name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-100 tabular-nums">{r.referredCount}</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-emerald-400 tabular-nums">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                    <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-100 tabular-nums">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

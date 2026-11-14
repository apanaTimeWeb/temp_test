'use client';
import SuperadminUsersOverviewMemberReferralsEmptyState from '@/app/frontend_superadmin/superadmin_users/users_member_referrals/components/SuperadminUsersOverviewMemberReferralsEmptyState';
import { useSuperadminUsersMemberReferralsExpandedState } from '@/app/frontend_superadmin/superadmin_users/users_member_referrals/hooks/useSuperadminUsersMemberReferralsExpandedState';
/** Responsibility: Superadmin Finance Referrals Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route props -> SuperadminUsersOverviewMemberReferralsPageClient -> typed leaf-owned child components; sibling business modules are not required. */

import { useTranslations, useLocale } from 'next-intl';

import { formatMajorUnitPreviewCurrency } from '@/app/frontend_superadmin/superadmin_users/users_member_referrals/utils/SuperadminUsersOverviewMemberReferralsFormatters';
import { Users, Trophy, IndianRupee } from 'lucide-react';
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
    <div className="space-y-6" data-preview-scenario={scenario}>
      {(mockReferrers?.length === 0) && <SuperadminUsersOverviewMemberReferralsEmptyState filtered />}

      <div>
        <h1 className="fin-page-title">{tCopy("COPY.REFERRALS_AND_BONUSES")}</h1>
        <p className="fin-page-subtitle">{tCopy("COPY.STUDENT_REFERRAL_LEADERBOARD_AND_BONUS_TRACKING")}</p>
        <p className="mt-3 rounded-lg border border-border bg-info-bg p-3 text-sm text-info" role="status">{tCopy("COPY.PREVIEW_ONLY_DISCLOSURE")}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label">{tCopy("COPY.TOTAL_REFERRALS_MADE")}</span>
            <Users size={16} className="fin-icon-muted" />
          </div>
          <p className="fin-kpi-value">{totalReferrals}</p>
        </div>
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label">{tCopy("COPY.TOTAL_BONUS_ISSUED")}</span>
            <IndianRupee size={16} className="fin-icon-muted" />
          </div>
          <p className="fin-kpi-value fin-text-success">{formatMajorUnitPreviewCurrency(totalBonus, 'INR', locale)}</p>
        </div>
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label">{tCopy("COPY.REDEEMED")}</span>
            <IndianRupee size={16} className="fin-icon-muted" />
          </div>
          <p className="fin-kpi-value">{formatMajorUnitPreviewCurrency(totalRedeemed, 'INR', locale)}</p>
        </div>
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label">{tCopy("COPY.BALANCE")}</span>
            <IndianRupee size={16} className="fin-icon-muted" />
          </div>
          <p className="fin-kpi-value">{formatMajorUnitPreviewCurrency(totalBalance, 'INR', locale)}</p>
        </div>
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label">{tCopy("COPY.TOP_REFERRER")}</span>
            <Trophy size={16} className="fin-text-warning" />
          </div>
          <p className="fin-kpi-value">{topReferrer?.name ?? '—'}</p>
          <p className="fin-cell-subtext">{topReferrer ? `${topReferrer.referredCount} ${tCopy("COPY.REFERRALS")}` : '—'}</p>
        </div>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tCopy("COPY.RANK")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.REFERRER")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.REFERRED_STUDENTS")}</th>
              <th className="text-center py-3 px-4">{tCopy("COPY.REFERRED_COUNT")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.BONUS_EARNED")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.REDEEMED")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.BALANCE")}</th>
            </tr>
          </thead>
          <tbody>
            {mockReferrers.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="fin-empty-state">
                    <div className="fin-empty-state__icon">👥</div>
                    <p className="fin-empty-state__title">{tCopy("COPY.NO_REFERRALS_RECORDED_YET")}</p>
                  </div>
                </td>
              </tr>
            ) : (
              mockReferrers.map((r, idx) => (
                <tr key={r.id} className="fin-table-hover-row fin-table-row">
                    <td className="py-3 px-4">
                      <span className={idx === 0 ? 'fin-text-warning font-bold' : 'fin-text-muted'}>#{idx + 1}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="fin-cell-name">{r.name}</div>
                      <div className="fin-cell-subtext">{r.smartId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <button type="button"
                        id={`superadmin-referrals-trigger-${String(r.id)}`}
                        className="fin-badge fin-badge--neutral cursor-pointer"
                        onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                        aria-expanded={expanded === r.id}
                        aria-controls={`superadmin-referrals-students-${String(r.id)}`}
                       data-testid={`superadmin-finance-finance-referrals-students-1-${String(r.id)}`}>
                        {expanded === r.id ? '▲' : '▼'} {r.referredCount} {tCopy("COPY.STUDENTS")}</button>
                      <div
                        id={`superadmin-referrals-students-${String(r.id)}`}
                        role="region"
                        aria-labelledby={`superadmin-referrals-trigger-${String(r.id)}`}
                        hidden={expanded !== r.id}
                        className={expanded === r.id ? 'flex flex-wrap gap-1 mt-2' : 'hidden'}>
                        {r.referredNames.map((name) => (
                          <span key={name} className="fin-badge fin-badge--neutral">{name}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold fin-text-body">{r.referredCount}</td>
                    <td className="py-3 px-4 text-right fin-text-success">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                    <td className="py-3 px-4 text-right fin-text-body">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                    <td className="py-3 px-4 text-right font-semibold fin-text-body">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                  </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

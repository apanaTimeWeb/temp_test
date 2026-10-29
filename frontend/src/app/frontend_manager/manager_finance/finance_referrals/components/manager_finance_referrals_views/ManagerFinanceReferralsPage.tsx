'use client';
import { useTranslations } from 'next-intl';
import { MANAGER_FINANCE_SAMPLE_REFERRERS } from '@/app/frontend_manager/manager_finance/finance_referrals/hooks/ManagerFinanceReferralsDemoRepository';

import { useManagerReferralsFormatting } from '@/app/frontend_manager/manager_finance/finance_referrals/hooks/ManagerFinanceReferralsFormattingHook';

// RESPONSIBILITY: Entry page for the manager_referrals module.
// DATA FLOW: Next.js Router -> Page -> Components

// RESPONSIBILITY: Entry page for the manager_referrals module.
// DATA FLOW: Next.js Router -> Page -> Components
import { useState } from 'react';
import { Users, Trophy, IndianRupee } from 'lucide-react';
import { ManagerFinanceReferralsEmptyState } from '@/app/frontend_manager/manager_finance/finance_referrals/components/manager_finance_referrals_empty_states/ManagerFinanceReferralsEmptyState';
import type { ManagerFinanceReferralsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_referrals/types/ManagerFinanceReferralsComponentTypes';




const totalReferrals = MANAGER_FINANCE_SAMPLE_REFERRERS.reduce((a, r) => a + r.referredCount, 0);
const totalBonus = MANAGER_FINANCE_SAMPLE_REFERRERS.reduce((a, r) => a + r.bonusEarned, 0);
const topReferrer = MANAGER_FINANCE_SAMPLE_REFERRERS[0];


export default function ManagerFinanceReferralsPage(_routeQuery: ManagerFinanceReferralsRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_referrals.ui');
  const { formatCurrency } = useManagerReferralsFormatting();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
      <div>
        <h1 className="fin-page-title">{tManagerUi('referrals_and_bonuses')}</h1>
        <p className="fin-page-subtitle">{tManagerUi('student_referral_leaderboard_and_bonus_tracking')}</p>
        <p className="fin-input-hint fin-text-warning mt-2" data-testid="manager-finance-referrals-sample-warning" role="status">{tManagerUi('all_names_referral_counts_and_bonus_amounts_on_this_page_17edc6')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label">{tManagerUi('total_referrals_made')}</span>
            <Users size={16} className="fin-icon-muted" />
          </div>
          <p className="fin-kpi-value">{totalReferrals}</p>
        </div>
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label">{tManagerUi('total_bonus_issued_inr')}</span>
            <IndianRupee size={16} className="fin-icon-muted" />
          </div>
          <p className="fin-kpi-value fin-text-success">{formatCurrency(totalBonus)}</p>
        </div>
        <div className="fin-kpi-card">
          <div className="fin-kpi-card__header">
            <span className="fin-kpi-label">{tManagerUi('top_referrer')}</span>
            <Trophy size={16} className="fin-text-warning" />
          </div>
          <p className="fin-kpi-value">{topReferrer.name}</p>
          <p className="fin-cell-subtext">{topReferrer.referredCount} {tManagerUi('referrals')}</p>
        </div>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tManagerUi('rank')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('referrer')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('referred_students')}</th>
              <th className="text-center py-3 px-4">{tManagerUi('referred_count')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('bonus_earned_inr')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('redeemed_inr')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('balance_inr')}</th>
            </tr>
          </thead>
          <tbody>
            {MANAGER_FINANCE_SAMPLE_REFERRERS.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <ManagerFinanceReferralsEmptyState className="fin-empty-state">
                    <div className="fin-empty-state__icon">👥</div>
                    <p className="fin-empty-state__title">{tManagerUi('no_referrals_recorded_yet')}</p>
                  </ManagerFinanceReferralsEmptyState>
                </td>
              </tr>
            ) : (
              MANAGER_FINANCE_SAMPLE_REFERRERS.map((r, idx) => (
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
                        className="fin-badge fin-badge--neutral cursor-pointer"
                        onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                      >
                        {expanded === r.id ? '▲' : '▼'} {r.referredCount} {tManagerUi('students')}
                      </button>
                      {expanded === r.id && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {r.referredNames.map((name, i) => (
                            <span key={`${r.id}-referred-${name}`} className="fin-badge fin-badge--neutral">{name}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold fin-text-body">{r.referredCount}</td>
                    <td className="py-3 px-4 text-right fin-text-success">{formatCurrency(r.bonusEarned)}</td>
                    <td className="py-3 px-4 text-right fin-text-body">{formatCurrency(r.redeemed)}</td>
                    <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(r.balance)}</td>
                  </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

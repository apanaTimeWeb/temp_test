'use client';
// Responsibility: AdminFinanceReferralsPage component owned by admin_finance; responsibility folder: admin_finance_components_views.

// RESPONSIBILITY: Entry page for the admin_finance module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { formatAdminFinanceCurrency } from '@/app/frontend_admin/admin_finance/finance_referrals/utils/AdminFinanceReferralsFormat';
import { Users, Trophy, IndianRupee } from 'lucide-react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_FINANCE_DEMO_REFERRERS } from '@/app/frontend_admin/admin_finance/finance_referrals/mocks/AdminFinanceReferralsDemoFixtures';


const totalReferrals = ADMIN_FINANCE_DEMO_REFERRERS.reduce((a, referrer) => a + referrer.referredNames.length, 0);
const totalBonus = ADMIN_FINANCE_DEMO_REFERRERS.reduce((a, r) => a + r.bonusEarned, 0);
const topReferrer = [...ADMIN_FINANCE_DEMO_REFERRERS].sort((left, right) => right.referredNames.length - left.referredNames.length)[0] ?? { name: '—', referredNames: [] as string[] };

export function AdminFinanceReferralsPage() {
  const t = useTranslations('ADMIN_FINANCE_REFERRALS');
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  if (!isFrontendDemoModeEnabled()) {
    return <div className="rounded-lg border border-border bg-card p-6" role="status"><h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1><p className="mt-2 text-text-secondary">{t('LIVE_UNAVAILABLE')}</p></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
        <p className="mt-1 text-body text-text-secondary">{t('SUBTITLE')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{t('TOTAL_REFERRALS')}</span>
            <Users size={18} strokeWidth={2} className="text-text-secondary" />
          </div>
          <p className="mt-2 text-kpi font-bold text-text-primary">{totalReferrals}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{t('TOTAL_BONUS')}</span>
            <IndianRupee size={18} className="text-text-secondary"  strokeWidth={2}/>
          </div>
          <p className="mt-2 text-kpi font-bold text-text-primary text-success-text">{formatAdminFinanceCurrency(totalBonus)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{t('TOP_REFERRER')}</span>
            <Trophy size={18} className="text-warning-text"  strokeWidth={2}/>
          </div>
          <p className="mt-2 text-kpi font-bold text-text-primary">{topReferrer.name}</p>
          <p className="text-caption text-text-secondary">{t('LISTED_REFERRALS', { count: topReferrer.referredNames.length })}</p>
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-highlight text-caption text-text-secondary">
              <th className="text-left py-3 px-4">{t('RANK')}</th>
              <th className="text-left py-3 px-4">{t('REFERRER')}</th>
              <th className="text-left py-3 px-4">{t('REFERRED_STUDENTS')}</th>
              <th className="text-center py-3 px-4">{t('REFERRED_COUNT')}</th>
              <th className="text-right py-3 px-4">{t('BONUS_EARNED')}</th>
              <th className="text-right py-3 px-4">{t('REDEEMED')}</th>
              <th className="text-right py-3 px-4">{t('BALANCE')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={`skeleton-${i + 1}`} className="border-b border-border text-text-primary">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={`skeleton-cell-${j + 1}`} className="py-3 px-4">
                      <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-16" />
                    </td>
                  ))}
                </tr>
              ))
            ) : ADMIN_FINANCE_DEMO_REFERRERS.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div data-testid="admin_finance-page-state-001" className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center">
                    <div data-testid="admin_finance-page-state-002" className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-subtle text-primary">👥</div>
                    <p data-testid="admin_finance-page-state-003" className="text-section-title font-semibold text-text-primary">{t('EMPTY')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              ADMIN_FINANCE_DEMO_REFERRERS.map((r, idx) => (
                <tr key={r.id} className="motion-safe:transition-colors hover:bg-primary-subtle border-b border-border text-text-primary">
                    <td className="py-3 px-4">
                      <span className={idx === 0 ? 'text-warning-text font-bold' : 'text-text-secondary'}>#{idx + 1}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-body font-semibold text-text-primary">{r.name}</div>
                      <div className="text-caption text-text-secondary">{r.smartId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <button data-testid={`admin_finance-referral-expand-${r.id}`}
                        aria-expanded={expanded === r.id}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer"
                        onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                      >
                        {expanded === r.id ? '▲' : '▼'} {t(expanded === r.id ? 'COLLAPSE_STUDENTS' : 'EXPAND_STUDENTS')} ({r.referredNames.length})
                      </button>
                      {expanded === r.id && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {r.referredNames.map((name) => (
                            <span data-testid="admin_finance-page-state-005" key={name} className="inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-card text-text-secondary border-border">{name}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-body text-text-primary">{r.referredNames.length}</td>
                    <td className="py-3 px-4 text-right text-success-text">{formatAdminFinanceCurrency(r.bonusEarned)}</td>
                    <td className="py-3 px-4 text-right text-body text-text-primary">{formatAdminFinanceCurrency(r.redeemed)}</td>
                    <td className="py-3 px-4 text-right font-semibold text-body text-text-primary">{formatAdminFinanceCurrency(r.balance)}</td>
                  </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

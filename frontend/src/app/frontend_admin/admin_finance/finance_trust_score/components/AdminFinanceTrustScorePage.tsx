'use client';
// Responsibility: AdminFinanceTrustScorePage component owned by admin_finance; responsibility folder: admin_finance_components_views.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';

// RESPONSIBILITY: Entry page for the admin_finance module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { ShieldCheck, ShieldAlert, ShieldX, Users } from 'lucide-react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_FINANCE_DEMO_TRUST_SCORE_STUDENTS } from '@/app/frontend_admin/admin_finance/finance_trust_score/mocks/AdminFinanceTrustScoreDemoFixtures';
import type { AdminFinanceTrustScoreStudent } from '@/app/frontend_admin/admin_finance/finance_trust_score/types/AdminFinanceTrustScoreTypes';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';

const BADGE_CLASS: Record<string, string> = {
  reliable: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-success-bg text-success-text border-success-bg',
  moderate: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-warning-bg text-warning-text border-warning-bg',
  low:      'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-danger-bg text-danger-text border-danger-bg',
};

const BADGE_ICON: Record<string, typeof ShieldCheck> = {
  reliable: ShieldCheck,
  moderate: ShieldAlert,
  low:      ShieldX,
};

function renderTrustGauge(score: number) {
  const color = score >= 70 ? 'success' : score >= 40 ? 'warning' : 'danger';
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-border max-sm:w-12"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Trust Score: ${score}/100`}
      >
        <div className={`block h-full rounded-full admin-dynamic-width-${Math.min(100, Math.max(0, Math.round(score)))}`} data-admin-bg={color} />
      </div>
      <span className="text-sm font-semibold" data-admin-color={color}>{score}</span>
    </div>
  );
}

export function AdminFinanceTrustScorePage() {
  const t = useTranslations('ADMIN_FINANCE_TRUST_SCORE');
  const [levelFilter, setLevelFilter] = useAdminApplicationInfrastructureUrlQueryState<string>('levelFilter', 'all', { validValues: ['all', 'low', 'moderate', 'reliable'] });
  const [shiftFilter, setShiftFilter] = useAdminApplicationInfrastructureUrlQueryState<string>('shiftFilter', 'all', { validValues: ['all', 'Morning', 'Evening', 'Full Day'] });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const isDemoMode = isFrontendDemoModeEnabled();
  const visibleStudents: readonly AdminFinanceTrustScoreStudent[] = isDemoMode ? ADMIN_FINANCE_DEMO_TRUST_SCORE_STUDENTS : [];
  const filtered = useMemo(() => visibleStudents.filter((s) => {
    const lm = levelFilter === 'all' || s.badge === levelFilter;
    const sm = shiftFilter === 'all' || s.shift === shiftFilter;
    return lm && sm;
  }), [visibleStudents, levelFilter, shiftFilter]);
  const paginated = useMemo(() => filtered.slice(page * pageSize, (page + 1) * pageSize), [filtered, page, pageSize]);

  const lowTrust = visibleStudents.filter((s) => s.trustScore < 40).length;
  const avg = visibleStudents.length ? Math.round(visibleStudents.reduce((a, s) => a + s.trustScore, 0) / visibleStudents.length) : 0;

  if (!isDemoMode) {
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
            <span className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{t('SCORED_STUDENTS')}</span>
            <Users size={18} className="text-text-secondary"  strokeWidth={2}/>
          </div>
          <p className="mt-2 text-kpi font-bold text-text-primary">{visibleStudents.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card border-danger-bg bg-danger-bg">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary text-danger-text">🔴 {t('LOW_TRUST')}</span>
            <ShieldX size={18} className="text-danger-text"  strokeWidth={2}/>
          </div>
          <p className="mt-2 text-kpi font-bold text-text-primary text-danger-text">{lowTrust}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{t('AVERAGE_SCORE')}</span>
            <ShieldCheck size={18} strokeWidth={2} className="text-text-secondary" />
          </div>
          <p className="mt-2 text-kpi font-bold text-text-primary">{avg}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select data-testid="admin_finance-page-control-001" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 pr-8 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-40" aria-label={t('FILTER_LEVEL')} value={levelFilter} onChange={(e) => { setLevelFilter(e.target.value); setPage(0); }}>
          <option value="all">{t('ALL_LEVELS')}</option>
          <option value="reliable">{t('RELIABLE')}</option>
          <option value="moderate">{t('MODERATE')}</option>
          <option value="low">{t('LOW_TRUST_LABEL')}</option>
        </select>
        <select data-testid="admin_finance-page-control-002" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 pr-8 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-40" aria-label={t('FILTER_SHIFT')} value={shiftFilter} onChange={(e) => { setShiftFilter(e.target.value); setPage(0); }}>
          <option value="all">{t('ALL_SHIFTS')}</option>
          <option value="Morning">{t('MORNING')}</option>
          <option value="Evening">{t('EVENING')}</option>
          <option value="Full Day">{t('FULL_DAY')}</option>
        </select>
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
              <th className="text-left py-3 px-4">{t('RANK')}</th>
              <th className="text-left py-3 px-4">{t('STUDENT')}</th>
              <th className="text-left py-3 px-4">{t('SHIFT')}</th>
              <th className="text-left py-3 px-4">{t('TRUST_SCORE')}</th>
              <th className="text-center py-3 px-4">{t('TOTAL_PROMISES')}</th>
              <th className="text-center py-3 px-4">{t('TIMES_CHANGED')}</th>
              <th className="text-center py-3 px-4">{t('FULFILLED')}</th>
              <th className="text-left py-3 px-4">{t('STATUS')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i + 1}`} className="h-12 border-b border-border text-text-primary">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={`skeleton-cell-${j + 1}`} className="py-3 px-4">
                      <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-16" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div data-testid="admin_finance-page-state-003" className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center">
                    <div data-testid="admin_finance-page-state-004" className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-subtle text-primary">🛡️</div>
                    <p data-testid="admin_finance-page-state-005" className="text-section-title font-semibold text-text-primary">{t('EMPTY')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((s) => {
                const Icon = BADGE_ICON[s.badge] || ShieldCheck;
                return (
                  <tr key={s.smartId} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra/30">
                    <td className="py-3 px-4 font-mono text-caption text-text-secondary">#{s.rank}</td>
                    <td className="py-3 px-4">
                      <div className="text-body font-semibold text-text-primary">{s.studentName}</div>
                      <div className="text-caption text-text-secondary">{s.smartId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span data-testid="admin_finance-page-state-006" className="inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-card text-text-secondary border-border">{s.shift === 'Morning' ? t('MORNING') : s.shift === 'Evening' ? t('EVENING') : t('FULL_DAY')}</span>
                    </td>
                    <td className="py-3 px-4">
                      {renderTrustGauge(s.trustScore)}
                    </td>
                    <td className="py-3 px-4 text-center text-body text-text-primary">{s.totalPromises}</td>
                    <td className="py-3 px-4 text-center">
                      {s.timesChanged > 0 ? (
                        <span className="text-warning-text">{s.timesChanged}x</span>
                      ) : (
                        <span className="text-text-secondary">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-body text-text-primary">{s.fulfilledCount}</td>
                    <td className="py-3 px-4">
                      <span data-testid="admin_finance-page-state-007" className={`${BADGE_CLASS[s.badge] || 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap'} flex items-center gap-1 w-fit`}>
                        <Icon size={18} strokeWidth={2} />
                        {s.badge === 'reliable' ? `🟢 ${t('RELIABLE')}` : s.badge === 'moderate' ? `🟡 ${t('MODERATE')}` : `🔴 ${t('LOW_TRUST_LABEL')}`}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {filtered.length > 0 && (
          <AdminTablePagination
            page={page}
            pageSize={pageSize}
            totalCount={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={(newSize: number) => {
              setPageSize(newSize);
              setPage(0);
            }}
          />
        )}
      </div>
    </div>
  );
}

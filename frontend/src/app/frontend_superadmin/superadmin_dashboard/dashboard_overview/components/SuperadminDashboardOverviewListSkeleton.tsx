/** Feature-local loading skeleton for dashboard_overview; presentation only, no fetch or mutation behavior. */
/** Responsibility: SuperadminDashboardOverviewListSkeleton; provide a stable, accessible loading placeholder for dashboard_overview without fetching data or mutating feature state. */
'use client';

import { useTranslations } from 'next-intl';

const SUMMARY_SKELETON_IDS = ['one', 'two', 'three', 'four'] as const;
const ROW_SKELETON_IDS = ['one', 'two', 'three', 'four', 'five'] as const;

/**
 * Renders the accessible loading skeleton for dashboard overview.
 */
export default function SuperadminDashboardOverviewListSkeleton() {
  const t = useTranslations('SUPERADMIN_DASHBOARD');
  return (
    <section className="w-full max-w-full min-w-0 space-y-6 pb-10" role="status" aria-busy="true" aria-label={t('COPY.LOADING_MODULE')} data-testid="superadmin_dashboard_overview-dashboard_overview-list-skeleton">
      <span className="sr-only">{t('COPY.LOADING_MODULE')}</span>

      {/* Hero Banner Skeleton */}
      <div className="rounded-2xl border border-indigo-500/20 bg-[#0c0f28]/80 p-6 space-y-3" aria-hidden="true">
        <div className="flex gap-2">
          <div className="h-5 w-24 rounded-full bg-slate-800/80 motion-safe:animate-pulse motion-reduce:animate-none" />
          <div className="h-5 w-32 rounded-full bg-slate-800/80 motion-safe:animate-pulse motion-reduce:animate-none" />
        </div>
        <div className="h-8 w-64 rounded-xl bg-slate-800/80 motion-safe:animate-pulse motion-reduce:animate-none" />
        <div className="h-4 w-96 max-w-full rounded-lg bg-slate-800/60 motion-safe:animate-pulse motion-reduce:animate-none" />
      </div>

      {/* 4 KPI Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
        {SUMMARY_SKELETON_IDS.map((key) => (
          <div key={key} className="h-36 rounded-2xl border border-slate-800 bg-[#0c0f28]/60 p-5 space-y-3 motion-safe:animate-pulse motion-reduce:animate-none">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 rounded bg-slate-800" />
              <div className="h-8 w-8 rounded-xl bg-slate-800" />
            </div>
            <div className="h-8 w-32 rounded-lg bg-slate-800" />
            <div className="h-3 w-20 rounded bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Middle Row Skeleton */}
      <div className="grid grid-cols-12 gap-5" aria-hidden="true">
        <div className="col-span-12 lg:col-span-7 h-64 rounded-2xl border border-slate-800 bg-[#0c0f28]/60 p-6 motion-safe:animate-pulse motion-reduce:animate-none" />
        <div className="col-span-12 lg:col-span-5 h-64 rounded-2xl border border-slate-800 bg-[#0c0f28]/60 p-6 motion-safe:animate-pulse motion-reduce:animate-none" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c0f28]/60 p-6 space-y-4" aria-hidden="true">
        <div className="h-6 w-48 rounded bg-slate-800" />
        <div className="space-y-3">
          {ROW_SKELETON_IDS.map((key) => (
            <div key={key} className="h-10 rounded-xl bg-slate-800/50 motion-safe:animate-pulse motion-reduce:animate-none" />
          ))}
        </div>
      </div>
    </section>
  );
}

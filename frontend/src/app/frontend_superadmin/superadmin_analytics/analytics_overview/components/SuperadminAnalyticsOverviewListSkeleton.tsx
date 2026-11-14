/** Feature-local loading skeleton; column/card shape follows the owning PageClient. */
/** Responsibility: SuperadminAnalyticsOverviewListSkeleton; provide a stable, accessible loading placeholder for analytics_overview without fetching data or mutating feature state. */
/** Data-Flow: route loading boundary -> SuperadminAnalyticsOverviewListSkeleton -> stable skeleton presentation; no API request or mutation is performed. */
'use client';

import { useTranslations } from 'next-intl';

/**
 * Renders the accessible loading skeleton for analytics overview; it does not fetch data or mutate feature state.
 */
export default function SuperadminAnalyticsOverviewListSkeleton() {
  const t = useTranslations('SUPERADMIN_REPORTS');
  const columnKeys = ['column-1', 'column-2', 'column-3', 'column-4', 'column-5', 'column-6', 'column-7'];
  const rowKeys = ['row-1', 'row-2', 'row-3', 'row-4', 'row-5'];
  const kpiKeys = ['kpi-1', 'kpi-2', 'kpi-3', 'kpi-4'];
  return (
    <section className="min-w-0 space-y-6 p-4 md:p-6" role="status" aria-busy="true" aria-label={t('COPY.LOADING_MODULE')} data-testid="superadmin_analytics-analytics_overview-list-skeleton">
      <span className="sr-only">{t('COPY.LOADING_MODULE')}</span>
      <div className="flex flex-wrap items-center justify-between gap-3" aria-hidden="true">
        <div className="h-8 w-56 rounded-lg bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
        <div className="h-10 w-36 rounded-lg bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
        {kpiKeys.map((key) => <div key={key} className="h-24 rounded-xl border border-border bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />)}
      </div>
      <div className="flex flex-wrap gap-3" aria-hidden="true">
        <div className="h-10 min-w-48 flex-1 rounded-lg border border-border bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
        <div className="h-10 w-32 rounded-lg border border-border bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <div className="min-w-0">
          <div className="grid grid-flow-col auto-cols-fr gap-4 border-b border-border bg-surface-hover px-4 py-3" aria-hidden="true">
            {columnKeys.map((key) => <div key={key} className="h-4 rounded bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />)}
          </div>
          <div className="divide-y divide-border">
            {rowKeys.map((rowKey) => (
              <div key={rowKey} className="grid grid-flow-col auto-cols-fr gap-4 px-4 py-4" aria-hidden="true">
                {columnKeys.map((columnKey, columnIndex) => <div key={`${rowKey}-${columnKey}`} className={`h-4 rounded bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none ${columnIndex === 0 ? 'w-4/5' : 'w-full'}`} />)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

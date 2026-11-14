// RESPONSIBILITY: Render the route loading state for Superadmin; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
'use client';

import { useTranslations } from 'next-intl';
/**
 * Performs the superadmin loading operation within the Superadmin role shell; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminLoading() {
  const t = useTranslations('SUPERADMIN_SHELL');
  return (
    <div className="sa-page-animate" role="status" aria-label={t("COPY.LOADING_SUPERADMIN_WORKSPACE")} aria-busy="true">
      <div className="mb-6 space-y-3 motion-safe:animate-pulse motion-reduce:animate-none">
        <div className="h-4 w-32 rounded bg-surface-highlight" />
        <div className="h-8 w-64 max-w-full rounded bg-surface-highlight" />
        <div className="h-4 w-96 max-w-full rounded bg-surface-hover" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 motion-safe:animate-pulse motion-reduce:animate-none">
        {['summary-primary', 'summary-secondary', 'summary-tertiary', 'summary-quaternary'].map((skeletonKey) => <div key={skeletonKey} className="h-28 rounded-xl border border-border bg-card" />)}
      </div>
      <div className="mt-6 h-72 rounded-xl border border-border bg-card motion-safe:animate-pulse motion-reduce:animate-none" />
      <span className="sr-only">{t("COPY.LOADING_PAGE_CONTENT")}</span>
    </div>
  );
}

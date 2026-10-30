// RESPONSIBILITY: Layout-matching loading skeleton for the Admin System feature.
// DATA FLOW: Next.js Router -> loading.tsx

import { useTranslations } from 'next-intl';
export default function Loading() {
  const t = useTranslations('ADMIN_NAVIGATION');
  return (
    <main className="space-y-6 p-6" aria-busy="true" aria-label={t('LOADING_PAGE')}>
      <div className="space-y-2">
        <div className="h-6 w-56 motion-safe:animate-pulse rounded-md bg-skeleton-base motion-reduce:animate-none" />
        <div className="h-4 w-80 max-w-full motion-safe:animate-pulse rounded-md bg-skeleton-highlight motion-reduce:animate-none" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={`skeleton-${index + 1}`} className="rounded-lg border border-border bg-card p-4">
            <div className="h-3 w-24 motion-safe:animate-pulse rounded bg-skeleton-base motion-reduce:animate-none" />
            <div className="mt-4 h-7 w-16 motion-safe:animate-pulse rounded bg-skeleton-highlight motion-reduce:animate-none" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-4 h-5 w-40 motion-safe:animate-pulse rounded bg-skeleton-base motion-reduce:animate-none" />
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={`skeleton-${index + 1}`} className="grid grid-cols-1 gap-3 border-b border-border pb-3 sm:grid-cols-3">
              <div className="h-4 w-32 motion-safe:animate-pulse rounded bg-skeleton-base motion-reduce:animate-none" />
              <div className="h-4 w-full motion-safe:animate-pulse rounded bg-skeleton-highlight motion-reduce:animate-none" />
              <div className="h-4 w-20 motion-safe:animate-pulse rounded bg-skeleton-base motion-reduce:animate-none" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

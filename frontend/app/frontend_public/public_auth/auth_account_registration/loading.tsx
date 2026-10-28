import { useTranslations } from 'next-intl';

/** Route-segment loading UI for the canonical auth view entry. */
export default function PublicAuthLoading() {
  const t = useTranslations('AUTH.loading');
  return (
    <main className="min-h-screen bg-page p-4 text-primary" aria-busy="true">
      <div className="mx-auto mt-12 w-full max-w-md space-y-4">
        <div role="status" aria-live="polite" aria-label={t('label')}>
          <span className="sr-only">{t('label')}</span>
        </div>
        <div aria-hidden="true" className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mx-auto h-10 w-10 rounded-full bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
          <div className="mx-auto h-5 w-2/3 rounded bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
          <div className="h-10 rounded-lg bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
          <div className="h-10 rounded-lg bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
          <div className="h-11 rounded-lg bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
        </div>
      </div>
    </main>
  );
}

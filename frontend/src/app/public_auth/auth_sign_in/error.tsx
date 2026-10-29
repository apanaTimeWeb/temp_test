'use client';

import { useTranslations } from 'next-intl';

/** Auth route-segment error boundary; avoids exposing internal exception details. */
export default function PublicAuthError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('AUTH.errors.boundary');
  return (
    <main className="flex min-h-[50vh] items-center justify-center bg-page p-4 text-primary">
      <section className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-6 text-center" role="alert" aria-live="assertive">
        <h1 className="text-xl font-semibold">{t('title')}</h1>
        <p className="text-sm text-secondary">{t('description')}</p>
        <button type="button" onClick={() => reset()} className="min-h-11 rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('retry')}</button>
      </section>
    </main>
  );
}

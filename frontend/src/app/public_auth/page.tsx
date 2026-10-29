'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

const PUBLIC_AUTH_TARGET_BY_VIEW: Readonly<Record<string, string>> = Object.freeze({
  login: '/public_auth/auth_sign_in',
  signup: '/public_auth/auth_account_registration',
  'forgot-password': '/public_auth/auth_password_recovery',
  'reset-password': '/public_auth/auth_password_reset',
});

/** Route-only compatibility shell. It redirects the legacy allowlisted ?view= URLs to autonomous child routes. */
function PublicAuthRouteRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('AUTH.loading');
  const rawView = searchParams?.get('view');
  const requestedView = rawView === null || rawView === undefined || rawView === '' ? 'login' : rawView;
  // A plain object lookup also sees inherited keys (for example, `constructor`). Only own allowlisted keys are routes.
  const isAllowedView = Object.prototype.hasOwnProperty.call(PUBLIC_AUTH_TARGET_BY_VIEW, requestedView);
  const target = isAllowedView ? PUBLIC_AUTH_TARGET_BY_VIEW[requestedView] : undefined;

  // Redirect only after the allowlisted URL value resolves; router and target are the complete dependency set.
  useEffect(() => {
    if (target) router.replace(target);
  }, [router, target]);

  if (!target) return <PublicAuthUnknownView />;
  return (
    <main className="flex min-h-screen items-center justify-center bg-page text-primary" aria-busy="true">
      <span role="status" aria-live="polite" className="sr-only">{t('label')}</span>
    </main>
  );
}

/** Localized fallback shown while useSearchParams suspends. */
function PublicAuthRouteLoading() {
  const t = useTranslations('AUTH.loading');
  return (
    <main className="min-h-screen bg-page text-primary" aria-busy="true">
      <div role="status" aria-live="polite" aria-label={t('label')}>
        <span className="sr-only">{t('label')}</span>
      </div>
    </main>
  );
}

function PublicAuthUnknownView() {
  const t = useTranslations('AUTH.errors.viewNotFound');
  return (
    <main data-testid="public-auth-unknown-view" className="flex min-h-screen items-center justify-center bg-page p-4 text-primary">
      <section aria-labelledby="public-auth-unknown-view-title" className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-6 text-center shadow-card">
        <h1 id="public-auth-unknown-view-title" className="text-xl font-semibold">{t('title')}</h1>
        <p className="text-sm text-secondary">{t('description')}</p>
        <Link href="/auth/login" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('backToLogin')}</Link>
      </section>
    </main>
  );
}

export default function PublicAuthRoutePage() {
  return <Suspense fallback={<PublicAuthRouteLoading />}><PublicAuthRouteRedirect /></Suspense>;
}

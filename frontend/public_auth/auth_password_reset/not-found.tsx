import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PUBLIC_AUTH_PASSWORD_RESET_URLS } from '@/app/frontend_public/public_auth/auth_password_reset/config/public_auth_password_reset_url_config';

/** Branded, localized 404 state for paths owned by the auth feature module. */
export default function PublicAuthNotFound() {
  const t = useTranslations('AUTH.notFound');
  return (
    <main className="flex min-h-screen items-center justify-center bg-page p-4 text-primary">
      <section className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-6 text-center shadow-card" aria-labelledby="auth-not-found-title">
        <h1 id="auth-not-found-title" className="text-xl font-semibold">{t('title')}</h1>
        <p className="text-sm text-secondary">{t('description')}</p>
        <Link href={PUBLIC_AUTH_PASSWORD_RESET_URLS.LOGIN} className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('backToLogin')}</Link>
      </section>
    </main>
  );
}

'use client';
import { useTranslations } from 'next-intl';

// RESPONSIBILITY: Renders the Next.js native loading skeleton for the admin_settings module.
// DATA FLOW: Next.js Router -> loading.tsx

export default function Loading() {
  const t = useTranslations('ADMIN_BRANCHES');
  return (
    <div className="flex h-full w-full items-center justify-center p-8" role="status" aria-label={t('ROUTE_LOADING.ARIA_LABEL')}>
      <span className="sr-only">{t('ROUTE_LOADING.SCREEN_READER_TEXT')}</span>
      <div className="motion-safe:animate-pulse space-y-4 w-full max-w-3xl">
        <div className="h-8 bg-surface-highlight rounded w-1/4"></div>
        <div className="h-64 bg-surface-highlight rounded w-full"></div>
      </div>
    </div>
  );
}

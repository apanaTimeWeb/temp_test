'use client';

// RESPONSIBILITY: Renders the Next.js native loading skeleton for the admin_dashboard module.
// DATA FLOW: Next.js Router -> loading.tsx
import { useTranslations } from 'next-intl';

export default function Loading() {
  const t = useTranslations('ADMIN_REPORTS');
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="flex h-full w-full items-center justify-center p-8">
      <span className="sr-only">{t('LOADING_DASHBOARD')}</span>
      <div className="motion-safe:animate-pulse space-y-4 w-full max-w-3xl">
        <div className="h-8 bg-surface-highlight rounded w-1/4"></div>
        <div className="h-64 bg-surface-highlight rounded w-full"></div>
      </div>
    </div>
  );
}

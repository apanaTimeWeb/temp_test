'use client';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { reportAdminError } from '@/lib/errorMonitoring';

export default function AdminAssetsRegisterRouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('ADMIN_ACCOUNTING.ERROR_BOUNDARY');
  useEffect(() => { reportAdminError(error, { module: 'admin_accounts_assets/assets_register', digest: error.digest }); }, [error]);
  return <div role="alert" aria-live="assertive" className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center"><h2 className="text-section-title font-semibold text-text-primary">{t('TITLE')}</h2><p className="text-sm text-text-secondary">{t('DESCRIPTION')}</p><button type="button" onClick={reset} className="min-h-11 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('RETRY')}</button></div>;
}

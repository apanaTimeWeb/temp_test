'use client';

import { useTranslations } from 'next-intl';

import { useEffect } from 'react';
import { reportAdminError } from '@/app/frontend_admin/lib/errorMonitoring';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('ADMIN_NAVIGATION');

  useEffect(() => { reportAdminError(error, { module: 'admin_system/system_offline', digest: error.digest }); }, [error]);
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="alert">
      <h2 className="text-section-title font-semibold text-text-primary">{t('ROUTE_ERROR_TITLE')}</h2>
      <p className="text-body text-text-secondary">{t('ROUTE_ERROR_DESCRIPTION')}</p>
      <button type="button" data-testid="admin_system_system_offline-error-control-001" onClick={reset} className="min-h-11 rounded-md bg-primary px-4 py-2 text-body font-medium text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('ROUTE_ERROR_RETRY')}</button>
    </div>
  );
}

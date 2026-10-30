'use client';

import { useTranslations } from 'next-intl';

import { useEffect } from 'react';
import { reportAdminError } from '@/lib/errorMonitoring';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('ADMIN_SYSTEM_ERROR');

  useEffect(() => { reportAdminError(error, { module: 'admin_system/system_settings', digest: error.digest }); }, [error]);
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="alert">
      <h2 className="text-section-title font-semibold text-text-primary">{t('TITLE')}</h2>
      <p className="text-body text-text-secondary">{t('DESCRIPTION')}</p>
      <button type="button" data-testid="admin_system_system_settings-error-control-001" onClick={reset} className="min-h-11 rounded-md bg-primary px-4 py-2 text-body font-medium text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('RETRY')}</button>
    </div>
  );
}

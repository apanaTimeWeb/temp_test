'use client';

import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function AdminStaffAttendanceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('ADMIN_STAFF_ATTENDANCE');
  useEffect(() => {
    // Log error securely
  }, [error]);

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-danger-border bg-card p-6 text-center">
      <AlertCircle className="h-10 w-10 text-danger-text" />
      <h2 className="mt-3 text-lg font-bold text-text-primary">{t('ERR_TITLE')}</h2>
      <p className="mt-1 text-sm text-text-secondary">
        {t('ERR_DESC')}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-hover"
      >
        {t('ERR_RETRY')}
      </button>
    </div>
  );
}


'use client';
// RESPONSIBILITY: Provides localized route-segment recovery for Admin Members.
// DATA FLOW: Next.js error boundary -> reportAdminError -> user-triggered reset().

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { reportAdminError } from '@/app/frontend_admin/lib/errorMonitoring';

export default function AdminMembersError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('ADMIN_ENQUIRIES');

  useEffect(() => {
    reportAdminError(error, { module: 'admin_members/members_enquiries', digest: error.digest });
  }, [error]);

  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="alert">
      <h2 className="text-section-title font-semibold text-text-primary">{t('ERROR_BOUNDARY.TITLE')}</h2>
      <p className="text-body text-text-secondary">{t('ERROR_BOUNDARY.DESCRIPTION')}</p>
      <button type="button" data-testid="admin_members_members_enquiries-error-control-001" onClick={reset} className="min-h-11 rounded-md bg-primary px-4 py-2 text-body font-medium text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{t('ERROR_BOUNDARY.RETRY')}</button>
    </div>
  );
}

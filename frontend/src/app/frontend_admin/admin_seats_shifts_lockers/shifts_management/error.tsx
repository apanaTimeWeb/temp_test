'use client';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { reportAdminError } from '@/app/frontend_admin/lib/errorMonitoring';
export default function FeatureError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { const t = useTranslations('ADMIN_NAVIGATION'); useEffect(() => { reportAdminError(error, { module: 'admin_seats_shifts_lockers/shifts_management', digest: error.digest }); }, [error]); return <div role="alert" className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center"><h2 className="text-section-title font-semibold text-text-primary">{t('ROUTE_ERROR_TITLE')}</h2><p className="text-body text-text-secondary">{t('ROUTE_ERROR_DESCRIPTION')}</p><button type="button" onClick={reset} className="min-h-11 rounded-md bg-primary px-4 py-2 text-on-primary">{t('ROUTE_ERROR_RETRY')}</button></div>; }

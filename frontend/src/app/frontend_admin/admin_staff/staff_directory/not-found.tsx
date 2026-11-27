import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import { FileQuestion } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const t = await getTranslations('ADMIN_NAVIGATION');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 rounded-2xl border border-border bg-card p-4 text-text-secondary">
        <FileQuestion size={32} strokeWidth={1.75} aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold text-text-primary">{t('ROUTE_ERROR_TITLE')}</h2>
      <p className="mt-2 max-w-md text-sm text-text-secondary">{t('ROUTE_ERROR_DESCRIPTION')}</p>
      <Link
        href={ADMIN_ROUTES.STAFF_DIRECTORY}
        className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-hover motion-safe:transition-colors"
      >
        {t('SUBMODULE_STAFF_DIRECTORY')}
      </Link>
    </div>
  );
}

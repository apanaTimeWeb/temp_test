import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const t = await getTranslations('ADMIN_NAVIGATION');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-section-title font-semibold text-text-primary">{t('ROUTE_ERROR_TITLE')}</h2>
      <p className="text-body text-text-secondary">{t('ROUTE_ERROR_DESCRIPTION')}</p>
      <Link href={ADMIN_ROUTES.COMMUNICATION_NOTIFICATION_CENTER} className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-body font-medium text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {t('SUBMODULE_COMMUNICATION_NOTIFICATION_CENTER')}
      </Link>
    </div>
  );
}

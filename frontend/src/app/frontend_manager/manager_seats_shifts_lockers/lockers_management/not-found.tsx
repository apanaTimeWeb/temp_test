import { MANAGER_LOCKERS_MANAGEMENT_ROUTES } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/config/manager_lockers_management.url_config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const tManagerUi = await getTranslations('manager.manager_lockers.ui');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-foreground">{tManagerUi('lockers')}</h2>
      <p className="text-sm text-muted-foreground">{tManagerUi('no_lockers_match_current_filter')}</p>
      <Link
        href={MANAGER_LOCKERS_MANAGEMENT_ROUTES.lockers}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {tManagerUi('lockers')}
      </Link>
    </div>
  );
}

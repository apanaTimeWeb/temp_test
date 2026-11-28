import { MANAGER_ATTENDANCE_MONTHLY_HISTORY_ROUTES } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/config/manager_attendance_monthly_history.url_config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const tManagerUi = await getTranslations('manager.manager_attendance_monthly_history.ui');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-foreground">{tManagerUi('not_found_title')}</h2>
      <p className="text-sm text-muted-foreground">{tManagerUi('not_found_body')}</p>
      <Link
        href={MANAGER_ATTENDANCE_MONTHLY_HISTORY_ROUTES.root}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {tManagerUi('title')}
      </Link>
    </div>
  );
}

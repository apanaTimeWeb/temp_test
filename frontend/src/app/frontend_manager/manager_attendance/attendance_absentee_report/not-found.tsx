import { MANAGER_ATTENDANCE_ABSENTEE_REPORT_ROUTES } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/config/manager_attendance_absentee_report.url_config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const tManagerUi = await getTranslations('manager.manager_absentee_report.ui');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-foreground">{tManagerUi('absentee_report')}</h2>
      <p className="text-sm text-muted-foreground">{tManagerUi('no_absentees_above_threshold')}</p>
      <Link
        href={MANAGER_ATTENDANCE_ABSENTEE_REPORT_ROUTES.absenteeReport}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {tManagerUi('absentee_report')}
      </Link>
    </div>
  );
}

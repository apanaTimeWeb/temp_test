import { MANAGER_COMMUNICATION_NOTIFICATION_CENTER_ROUTES } from '@/app/frontend_manager/manager_communication/communication_notification_center/config/manager_communication_notification_center.url_config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const tManagerUi = await getTranslations('manager.manager_notification_center.ui');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-foreground">{tManagerUi('notification_center')}</h2>
      <p className="text-sm text-muted-foreground">{tManagerUi('log_of_all_manual_and_automated_alerts_sent')}</p>
      <Link
        href={MANAGER_COMMUNICATION_NOTIFICATION_CENTER_ROUTES.root}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {tManagerUi('notification_center')}
      </Link>
    </div>
  );
}

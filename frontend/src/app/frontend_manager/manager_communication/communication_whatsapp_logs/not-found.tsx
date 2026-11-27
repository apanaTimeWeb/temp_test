import { MANAGER_COMMUNICATION_WHATSAPP_LOGS_ROUTES } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/config/manager_communication_whatsapp_logs.url_config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const tManagerUi = await getTranslations('manager.manager_whatsapp_logs.ui');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-foreground">{tManagerUi('invalid_resource_title')}</h2>
      <p className="text-sm text-muted-foreground">{tManagerUi('invalid_resource_description')}</p>
      <Link
        href={MANAGER_COMMUNICATION_WHATSAPP_LOGS_ROUTES.root}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {tManagerUi('communication')}
      </Link>
    </div>
  );
}

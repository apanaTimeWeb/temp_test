import { MANAGER_SETTINGS_HELP_SUPPORT_ROUTES } from '@/app/frontend_manager/manager_settings/settings_help_support/config/manager_settings_help_support.url_config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const tManagerUi = await getTranslations('manager.manager_help_support.ui');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-foreground">{tManagerUi('help_support')}</h2>
      <p className="text-sm text-muted-foreground">{tManagerUi('no_tickets_found')}</p>
      <Link
        href={MANAGER_SETTINGS_HELP_SUPPORT_ROUTES.root}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {tManagerUi('help_support')}
      </Link>
    </div>
  );
}

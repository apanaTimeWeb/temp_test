import { MANAGER_ACCOUNTS_DAILY_SETTLEMENT_ROUTES } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/config/manager_accounts_daily_settlement.url_config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const tManagerUi = await getTranslations('manager.manager_daily_settlement.ui');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-foreground">{tManagerUi('invalid_resource_title')}</h2>
      <p className="text-sm text-muted-foreground">{tManagerUi('invalid_resource_description')}</p>
      <Link
        href={MANAGER_ACCOUNTS_DAILY_SETTLEMENT_ROUTES.root}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {tManagerUi('daily_settlement')}
      </Link>
    </div>
  );
}

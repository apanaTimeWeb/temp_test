import { MANAGER_FINANCE_FINES_PAYMENTS_ROUTES } from '@/app/frontend_manager/manager_finance/finance_fines_payments/config/manager_finance_fines_payments.url_config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const tManagerUi = await getTranslations('manager.manager_fines_payments.ui');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-primary">{tManagerUi('fines_payments')}</h2>
      <p className="text-sm text-secondary">{tManagerUi('manage_fine_collections_view_pending_dues_and_request_re_7b6cc6')}</p>
      <Link
        href={MANAGER_FINANCE_FINES_PAYMENTS_ROUTES.FINES_AND_PAYMENTS}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {tManagerUi('fines_payments')}
      </Link>
    </div>
  );
}

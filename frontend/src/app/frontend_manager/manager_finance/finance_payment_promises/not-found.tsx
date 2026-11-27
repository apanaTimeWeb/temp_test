import { MANAGER_FINANCE_PAYMENT_PROMISES_ROUTES } from '@/app/frontend_manager/manager_finance/finance_payment_promises/config/manager_finance_payment_promises.url_config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const tManagerUi = await getTranslations('manager.manager_payment_promises.ui');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-primary">{tManagerUi('payment_promises')}</h2>
      <p className="text-sm text-secondary">{tManagerUi('track_and_manage_student_payment_commitments')}</p>
      <Link
        href={MANAGER_FINANCE_PAYMENT_PROMISES_ROUTES.PAYMENT_PROMISES}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {tManagerUi('payment_promises')}
      </Link>
    </div>
  );
}

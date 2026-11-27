import { MANAGER_FINANCE_AUTO_SUSPEND_ROUTES } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/config/manager_finance_auto_suspend.url_config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const tManagerUi = await getTranslations('manager.manager_auto_suspend.ui');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-primary">{tManagerUi('auto_suspend_policy')}</h2>
      <p className="text-sm text-secondary">{tManagerUi('manage_automatic_suspension_and_student_restoration')}</p>
      <Link
        href={MANAGER_FINANCE_AUTO_SUSPEND_ROUTES.AUTO_SUSPEND}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {tManagerUi('auto_suspend_policy')}
      </Link>
    </div>
  );
}

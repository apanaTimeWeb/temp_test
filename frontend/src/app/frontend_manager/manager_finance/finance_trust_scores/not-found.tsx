import { MANAGER_FINANCE_TRUST_SCORES_ROUTES } from '@/app/frontend_manager/manager_finance/finance_trust_scores/config/manager_finance_trust_scores.url_config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const tManagerUi = await getTranslations('manager.manager_trust_scores.ui');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-primary">{tManagerUi('trust_scores')}</h2>
      <p className="text-sm text-secondary">{tManagerUi('student_reliability_rankings_based_on_payment_promise_hi_3c43fe')}</p>
      <Link
        href={MANAGER_FINANCE_TRUST_SCORES_ROUTES.TRUST_SCORE}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {tManagerUi('trust_scores')}
      </Link>
    </div>
  );
}

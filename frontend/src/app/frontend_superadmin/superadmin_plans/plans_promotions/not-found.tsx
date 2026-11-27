// FLOW: Route/resource miss -> superadmin_plans/plans_promotions/not-found.tsx -> localized not-found UI.
/** Responsibility: localized not-found boundary for the owning Superadmin leaf. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_PLANS_PROMOTIONS_ROUTES } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/config/superadmin_plans_promotions.url_config';
import { SearchX, ArrowLeft } from 'lucide-react';

/**
 * Performs the superadmin module not found operation within plans promotions; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminModuleNotFound() {
  const t = useTranslations('SUPERADMIN_BILLING');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-6 sm:p-8 shadow-xl backdrop-blur-md text-slate-100" role="status">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400">
          <SearchX className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-bold">{t('COPY.MODULE_NOT_FOUND_TITLE')}</h1>
      </div>
      <p className="mt-2 text-sm text-slate-400">{t('COPY.MODULE_NOT_FOUND_MESSAGE')}</p>
      <Link
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 motion-safe:transition-all active:scale-95"
        href={SUPERADMIN_PLANS_PROMOTIONS_ROUTES.SUPERADMIN_BILLING_PROMO_CODES_URLS.DASHBOARD_OVERVIEW}
        data-testid="superadmin-plans-promotions-not-found-dashboard-link"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{t('COPY.BACK_TO_DASHBOARD')}</span>
      </Link>
    </section>
  );
}

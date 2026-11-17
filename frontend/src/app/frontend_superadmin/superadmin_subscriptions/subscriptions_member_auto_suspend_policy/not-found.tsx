// FLOW: Route/resource miss -> superadmin_subscriptions/subscriptions_member_auto_suspend_policy/not-found.tsx -> localized not-found UI.
/** Responsibility: localized not-found boundary for the owning Superadmin leaf. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SearchX, ArrowLeft } from 'lucide-react';

const SUPERADMIN_DASHBOARD_ROUTE = '/superadmin/superadmin_dashboard/dashboard_overview';

export default function ModuleNotFound() {
  const t = useTranslations('SUPERADMIN_FINANCE');
  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-indigo-500/30 bg-[#0c0f28]/95 p-6 sm:p-8 text-center shadow-xl backdrop-blur-md flex flex-col items-center justify-center" role="status">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
        <SearchX className="h-7 w-7" />
      </div>
      <h1 className="text-lg sm:text-xl font-bold text-slate-100">{t('COPY.MODULE_NOT_FOUND_TITLE')}</h1>
      <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md">{t('COPY.MODULE_NOT_FOUND_MESSAGE')}</p>
      <Link
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
        href={SUPERADMIN_DASHBOARD_ROUTE}
        data-testid="superadmin_subscriptions-subscriptions_member_auto_suspend_policy-not-found-dashboard-link"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t('COPY.BACK_TO_DASHBOARD')}</span>
      </Link>
    </section>
  );
}

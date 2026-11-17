// FLOW: Route/resource miss -> superadmin_users/users_member_trust_score/not-found.tsx -> localized not-found UI.
/** Responsibility: localized not-found boundary for the owning Superadmin leaf. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FileQuestion, ArrowLeft } from 'lucide-react';

const SUPERADMIN_DASHBOARD_ROUTE = '/superadmin/superadmin_dashboard/dashboard_overview';

export default function ModuleNotFound() {
  const t = useTranslations('SUPERADMIN_FINANCE');
  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-indigo-500/25 bg-card/90 backdrop-blur-md p-8 text-center shadow-xl shadow-black/20 my-10 space-y-4" role="status">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 mx-auto shadow-md">
        <FileQuestion size={28} />
      </div>
      <div>
        <h1 className="text-xl font-bold text-slate-100">{t('COPY.MODULE_NOT_FOUND_TITLE')}</h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">{t('COPY.MODULE_NOT_FOUND_MESSAGE')}</p>
      </div>
      <div>
        <Link
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
          href={SUPERADMIN_DASHBOARD_ROUTE}
          data-testid="superadmin_users-users_member_trust_score-not-found-dashboard-link"
        >
          <ArrowLeft size={16} />
          {t('COPY.BACK_TO_DASHBOARD')}
        </Link>
      </div>
    </section>
  );
}

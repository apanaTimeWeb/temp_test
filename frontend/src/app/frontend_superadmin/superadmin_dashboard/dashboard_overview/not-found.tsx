// FLOW: Route/resource miss -> superadmin_dashboard/dashboard_overview/not-found.tsx -> localized not-found UI.
/** Responsibility: localized not-found boundary for the owning Superadmin leaf. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config';

/**
 * Performs the superadmin module not found operation within dashboard overview.
 */
export default function SuperadminModuleNotFound() {
  const t = useTranslations('SUPERADMIN_DASHBOARD');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-6 sm:p-8 shadow-md" role="status">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
          <FileQuestion size={22} />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">{t('COPY.MODULE_NOT_FOUND_TITLE')}</h1>
      </div>
      <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">{t('COPY.MODULE_NOT_FOUND_MESSAGE')}</p>
      <Link
        className="inline-flex items-center gap-2 min-h-10 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-950/50 motion-safe:transition-all hover:scale-[1.02] cursor-pointer mt-5"
        href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.SUPERADMIN_DASHBOARD_OVERVIEW_URLS.PAGE}
        data-testid="superadmin-dashboard-overview-not-found-dashboard-link"
      >
        <ArrowLeft size={14} className="text-white" />
        <span>{t('COPY.BACK_TO_DASHBOARD')}</span>
      </Link>
    </section>
  );
}

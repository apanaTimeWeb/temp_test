// FLOW: Route/resource miss -> superadmin_security/security_overview/not-found.tsx -> localized not-found UI.
/** Responsibility: localized not-found boundary for the owning Superadmin leaf. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { SUPERADMIN_SECURITY_OVERVIEW_ROUTES } from '@/app/frontend_superadmin/superadmin_security/security_overview/config/superadmin_security_overview.url_config';

/**
 * Performs the superadmin module not found operation within security overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminModuleNotFound() {
  const t = useTranslations('SUPERADMIN_SECURITY');
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center p-4">
      <section className="w-full max-w-lg rounded-2xl border border-border/80 bg-card/80 p-6 sm:p-8 text-center backdrop-blur-md shadow-xl" role="status">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
          <FileQuestion size={28} aria-hidden="true" />
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-100">{t('COPY.MODULE_NOT_FOUND_TITLE')}</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">{t('COPY.MODULE_NOT_FOUND_MESSAGE')}</p>
        <div className="mt-6 flex justify-center">
          <Link
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-indigo-600 active:scale-95 cursor-pointer"
            href={SUPERADMIN_SECURITY_OVERVIEW_ROUTES.SUPERADMIN_SECURITY_OVERVIEW_URLS.DASHBOARD_OVERVIEW}
            data-testid="superadmin-security-overview-not-found-dashboard-link"
          >
            <ArrowLeft size={15} />
            <span>{t('COPY.BACK_TO_DASHBOARD')}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

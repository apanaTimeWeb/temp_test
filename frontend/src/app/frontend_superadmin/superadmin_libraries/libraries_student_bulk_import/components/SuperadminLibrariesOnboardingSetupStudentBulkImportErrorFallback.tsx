// RESPONSIBILITY: Render the Libraries Onboarding Setup Student Bulk Import Error Fallback UI unit for libraries student bulk import; it does not own host routing or unsupported backend writes.
// FLOW: Feature screen/page client -> superadmin_libraries/libraries_student_bulk_import/components/SuperadminLibrariesOnboardingSetupStudentBulkImportErrorFallback.tsx -> typed props and local state -> rendered accessible UI.
/**
 * Feature-local retry fallback; hides raw exception details and never implies a mutation succeeded.
 */
'use client';

import { useTranslations } from 'next-intl';
import { AlertCircle, RotateCcw } from 'lucide-react';

type SuperadminLibrariesOnboardingSetupStudentBulkImportErrorFallbackProps = { onRetry: () => void };

export default function SuperadminLibrariesOnboardingSetupStudentBulkImportErrorFallback({ onRetry }: SuperadminLibrariesOnboardingSetupStudentBulkImportErrorFallbackProps) {
  const t = useTranslations('SUPERADMIN_SYSTEM');
  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-rose-500/30 bg-card/90 backdrop-blur-md p-8 text-center shadow-xl shadow-black/20 my-10 space-y-4" role="alert" data-testid="superadmin_libraries-libraries_student_bulk_import-error-fallback">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 mx-auto shadow-md">
        <AlertCircle size={28} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-100">{t('COPY.MODULE_ROUTE_ERROR_TITLE')}</h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">{t('COPY.MODULE_ROUTE_ERROR_MESSAGE')}</p>
      </div>
      <div>
        <button
          type="button"
          className="sa-btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
          onClick={onRetry}
          data-testid="superadmin_libraries-libraries_student_bulk_import-error-retry"
        >
          <RotateCcw size={16} />
          {t('COPY.RETRY_MODULE_ROUTE')}
        </button>
      </div>
    </section>
  );
}

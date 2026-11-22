/** Feature-local retry fallback for users_roles_permissions; never renders raw exception details or stack traces. */
/** Responsibility: SuperadminUsersRolesPermissionsErrorFallback; render a feature-local retry/error state without exposing raw exception details or implying that a backend operation succeeded. */
/** Data-Flow: route error boundary -> typed error and retry/reset callback -> safe localized error presentation; raw exception details remain hidden. */
'use client';

import { useTranslations } from 'next-intl';
import { AlertCircle, RotateCcw } from 'lucide-react';

/**
 * Defines the public SuperadminUsersRolesPermissionsErrorFallbackProps contract for users roles permissions. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property error User-safe error or explanatory message; raw exception details are not implied. Declared type: Error & { digest?: string; }.
 * @property reset Value defined by the existing feature-local contract. Declared type: () => void.
 */
export type SuperadminUsersRolesPermissionsErrorFallbackProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Renders the safe retry state for users roles permissions without exposing raw exception details.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminUsersRolesPermissionsErrorFallbackProps.
 */
export default function SuperadminUsersRolesPermissionsErrorFallback({ reset }: SuperadminUsersRolesPermissionsErrorFallbackProps) {
  const t = useTranslations('SUPERADMIN_USERS');
  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-rose-500/30 bg-card/90 backdrop-blur-md p-8 text-center shadow-xl shadow-black/20 my-10 space-y-4" role="alert" data-testid="superadmin_users_roles_permissions-users_roles_permissions-error-fallback">
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
          onClick={reset}
          data-testid="superadmin_users_roles_permissions-users_roles_permissions-error-retry"
        >
          <RotateCcw size={16} />
          {t('COPY.RETRY_MODULE_ROUTE')}
        </button>
      </div>
    </section>
  );
}

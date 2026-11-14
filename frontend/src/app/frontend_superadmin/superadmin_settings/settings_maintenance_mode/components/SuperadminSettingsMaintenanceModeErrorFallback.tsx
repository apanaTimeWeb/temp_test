/** Feature-local retry fallback for settings_maintenance_mode; never renders raw exception details or stack traces. */
/** Responsibility: SuperadminSettingsMaintenanceModeErrorFallback; render a feature-local retry/error state without exposing raw exception details or implying that a backend operation succeeded. */
/** Data-Flow: route error boundary -> typed error and retry/reset callback -> safe localized error presentation; raw exception details remain hidden. */
'use client';

import { useTranslations } from 'next-intl';

/**
 * Defines the public SuperadminSettingsMaintenanceModeErrorFallbackProps contract for settings maintenance mode. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property error User-safe error or explanatory message; raw exception details are not implied. Declared type: Error & { digest?: string; }.
 * @property reset Value defined by the existing feature-local contract. Declared type: () => void.
 */
export type SuperadminSettingsMaintenanceModeErrorFallbackProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Renders the safe retry state for settings maintenance mode without exposing raw exception details.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSettingsMaintenanceModeErrorFallbackProps.
 */
export default function SuperadminSettingsMaintenanceModeErrorFallback({ reset }: SuperadminSettingsMaintenanceModeErrorFallbackProps) {
  const t = useTranslations('SUPERADMIN_SETTINGS');
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-danger-bg p-6 text-danger" role="alert" data-testid="superadmin_settings_maintenance_mode-settings_maintenance_mode-error-fallback">
      <h2 className="text-lg font-semibold">{t('COPY.MODULE_ROUTE_ERROR_TITLE')}</h2>
      <p className="mt-2 text-sm">{t('COPY.MODULE_ROUTE_ERROR_MESSAGE')}</p>
      <button type="button" className="sa-btn-primary mt-4 min-h-11 min-w-28" onClick={reset} data-testid="superadmin_settings_maintenance_mode-settings_maintenance_mode-error-retry">{t('COPY.RETRY_MODULE_ROUTE')}</button>
    </section>
  );
}

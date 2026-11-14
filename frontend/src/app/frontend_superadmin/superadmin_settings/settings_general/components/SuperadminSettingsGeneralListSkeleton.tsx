/** Feature-local loading skeleton for settings_general; presentation only, no fetch or mutation behavior. */
/** Responsibility: SuperadminSettingsGeneralListSkeleton; provide a stable, accessible loading placeholder for settings_general without fetching data or mutating feature state. */
/** Data-Flow: route loading boundary -> SuperadminSettingsGeneralListSkeleton -> stable skeleton presentation; no API request or mutation is performed. */
'use client';

import { useTranslations } from 'next-intl';

const SUMMARY_SKELETON_IDS = ['one', 'two', 'three', 'four'] as const;
const ROW_SKELETON_IDS = ['one', 'two', 'three', 'four', 'five'] as const;

/**
 * Renders the accessible loading skeleton for settings general; it does not fetch data or mutate feature state.
 */
export default function SuperadminSettingsGeneralListSkeleton() {
  const t = useTranslations('SUPERADMIN_SETTINGS');
  return (
    <section className="min-w-0 space-y-6 p-4 md:p-6" role="status" aria-busy="true" aria-label={t('COPY.LOADING_MODULE')} data-testid="superadmin_settings_general-settings_general-list-skeleton">
      <span className="sr-only">{t('COPY.LOADING_MODULE')}</span>
      <div className="h-8 w-56 rounded-lg bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" aria-hidden="true" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
        {SUMMARY_SKELETON_IDS.map((key) => <div key={key} className="h-24 rounded-xl bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />)}
      </div>
      <div className="h-12 rounded-xl bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" aria-hidden="true" />
      <div className="space-y-3" aria-hidden="true">
        {ROW_SKELETON_IDS.map((key) => <div key={key} className="h-12 rounded-lg bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />)}
      </div>
    </section>
  );
}

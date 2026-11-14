import { notFound, redirect } from 'next/navigation';
// RESPONSIBILITY: Resolve the canonical libraries_onboarding_setup route and dispatch internal workflow views without creating sibling route modules.
// FLOW: Canonical URL -> query view dispatcher -> owner-local workflow navigation -> selected screen -> leaf components/hooks.
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminLibrariesOnboardingSetupScreen from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/components/SuperadminLibrariesOnboardingSetupScreen';
import SuperadminLibrariesOnboardingSetupWorkflowNavigation from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/components/SuperadminLibrariesOnboardingSetupWorkflowNavigation';
import { SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/config/superadmin_libraries_onboarding_setup.url_config';



type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

/**
 * Resolves the canonical route for libraries onboarding setup and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function LibrariesOnboardingSetupRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const view = firstValue(query.view);
  const tCopy = await getTranslations('SUPERADMIN_SETUP_WIZARD');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;
  if (view === "student_bulk_import") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect(SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES.LEGACY_DESTINATIONS.STUDENT_BULK_IMPORT + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "student_smart_id") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect(SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES.LEGACY_DESTINATIONS.STUDENT_SMART_ID + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view && !['student_bulk_import', 'student_smart_id'].includes(view)) notFound();
  return (
    <div className="min-w-0" data-feature-module="superadmin_libraries" data-feature-route="libraries_onboarding_setup">
      <SuperadminLibrariesOnboardingSetupWorkflowNavigation currentView={view} />
      <Suspense fallback={fallback}>
        <SuperadminLibrariesOnboardingSetupScreen id={id} />
      </Suspense>
    </div>
  );
}

import { notFound, redirect } from 'next/navigation';
// RESPONSIBILITY: Resolve the canonical settings_general route and dispatch internal workflow views without creating sibling route modules.
// FLOW: Canonical URL -> query view dispatcher -> owner-local workflow navigation -> selected screen -> leaf components/hooks.
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminSettingsGeneralScreen from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralScreen';
import SuperadminSettingsGeneralWorkflowNavigation from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralWorkflowNavigation';


type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

/**
 * Resolves the canonical route for settings general and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SettingsGeneralRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const view = firstValue(query.view);
  const tCopy = await getTranslations('SUPERADMIN_SETTINGS');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;
  if (view === "settings_library_configuration") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_settings/settings_library_configuration" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view && !['settings_library_configuration'].includes(view)) notFound();
  return (
    <div className="min-w-0" data-feature-module="superadmin_settings" data-feature-route="settings_general">
      <SuperadminSettingsGeneralWorkflowNavigation currentView={view} />
      <Suspense fallback={fallback}>
        <SuperadminSettingsGeneralScreen id={id} />
      </Suspense>
    </div>
  );
}

// RESPONSIBILITY: Adapt the canonical route for settings maintenance mode to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_settings/settings_maintenance_mode/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical, directly refreshable route for the Maintenance Mode workflow. */
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminSettingsMaintenanceModeScreen from '@/app/frontend_superadmin/superadmin_settings/settings_maintenance_mode/components/SuperadminSettingsMaintenanceModeScreen.tsx';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }
/**
 * Resolves the canonical route for settings maintenance mode and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SuperadminSettingsMaintenanceModeRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations("SUPERADMIN_SETTINGS");
  return <div className="min-w-0" data-feature-module="superadmin_settings" data-feature-route="settings_maintenance_mode">
    <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy("COPY.MODULE_ROUTE_LOADING")}</div>}>
      <SuperadminSettingsMaintenanceModeScreen id={id} />
    </Suspense>
  </div>;
}

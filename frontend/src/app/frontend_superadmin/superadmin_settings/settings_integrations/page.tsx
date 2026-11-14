// RESPONSIBILITY: Adapt the canonical route for settings integrations to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_settings/settings_integrations/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical, directly refreshable route for the APIs & Integrations workflow. */
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminSettingsIntegrationsScreen from '@/app/frontend_superadmin/superadmin_settings/settings_integrations/components/SuperadminSettingsIntegrationsScreen.tsx';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }
/**
 * Resolves the canonical route for settings integrations and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SuperadminSettingsIntegrationsRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations("SUPERADMIN_SETTINGS");
  return <div className="min-w-0" data-feature-module="superadmin_settings" data-feature-route="settings_integrations">
    <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy("COPY.MODULE_ROUTE_LOADING")}</div>}>
      <SuperadminSettingsIntegrationsScreen id={id} />
    </Suspense>
  </div>;
}

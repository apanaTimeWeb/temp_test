// RESPONSIBILITY: Adapt the canonical route for settings profile overview to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_settings/settings_profile_overview/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical single-leaf route; secondary workflows are selected by the view query parameter. */
import SuperadminProfileOverviewScreen from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/components/SuperadminProfileOverviewScreen';
import SuperadminProfileOverviewEditScreen from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/components/SuperadminProfileOverviewEditScreen';
import SuperadminProfileOverviewDetailsScreen from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/components/SuperadminProfileOverviewDetailsScreen';
type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }
/**
 * Renders the profile overview route boundary and delegates business presentation to feature-local components.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SuperadminProfileOverviewPage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const view = firstValue(query.view);
  const id = firstValue(query.id);
  if (view === 'edit') return <div data-feature-module="superadmin_settings" data-feature-route="settings_profile_overview" data-feature-view="edit"><SuperadminProfileOverviewEditScreen id={id} /></div>;
  if (view === 'details') return <div data-feature-module="superadmin_settings" data-feature-route="settings_profile_overview" data-feature-view="details"><SuperadminProfileOverviewDetailsScreen id={id} /></div>;
  return <div data-feature-module="superadmin_settings" data-feature-route="settings_profile_overview"><SuperadminProfileOverviewScreen /></div>;
}

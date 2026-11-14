import { notFound, redirect } from 'next/navigation';
// RESPONSIBILITY: Resolve the canonical libraries_overview route and dispatch internal workflow views without creating sibling route modules.
// FLOW: Canonical URL -> query view dispatcher -> owner-local workflow navigation -> selected screen -> leaf components/hooks.
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminLibrariesOverviewScreen from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewScreen';
import SuperadminLibrariesOverviewWorkflowNavigation from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewWorkflowNavigation';











type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

/**
 * Resolves the canonical route for libraries overview and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function LibrariesOverviewRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const view = firstValue(query.view);
  const tCopy = await getTranslations('SUPERADMIN_LIBRARIES');
  const fallback = <div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy('COPY.MODULE_ROUTE_LOADING')}</div>;
  if (view === "facility_asset_maintenance") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_libraries/libraries_facility_asset_maintenance" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "facility_asset_registry") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_libraries/libraries_facility_asset_registry" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "facility_maintenance_work_orders") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "facility_power_management") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_libraries/libraries_facility_power_management" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "library_capacity_analysis") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_libraries/libraries_library_capacity_analysis" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "library_capacity_gap_filling") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_libraries/libraries_library_capacity_gap_filling" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "library_capacity_scaling_recommendations") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "library_offline_operations") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_libraries/libraries_library_offline_operations" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "library_shift_gap_analysis") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_libraries/libraries_library_shift_gap_analysis" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view === "library_waitlist_automation") {
    const legacyQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key === 'view' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => legacyQuery.append(key, item));
      else legacyQuery.set(key, value);
    }
    const preservedQuery = legacyQuery.toString();
    redirect("/superadmin/superadmin_libraries/libraries_library_waitlist_automation" + (preservedQuery ? `?${preservedQuery}` : ''));
  }
  if (view && !['facility_asset_maintenance', 'facility_asset_registry', 'facility_maintenance_work_orders', 'facility_power_management', 'library_capacity_analysis', 'library_capacity_gap_filling', 'library_capacity_scaling_recommendations', 'library_offline_operations', 'library_shift_gap_analysis', 'library_waitlist_automation'].includes(view)) notFound();
  return (
    <div className="min-w-0" data-feature-module="superadmin_libraries" data-feature-route="libraries_overview">
      <SuperadminLibrariesOverviewWorkflowNavigation currentView={view} />
      <Suspense fallback={fallback}>
        <SuperadminLibrariesOverviewScreen id={id} />
      </Suspense>
    </div>
  );
}

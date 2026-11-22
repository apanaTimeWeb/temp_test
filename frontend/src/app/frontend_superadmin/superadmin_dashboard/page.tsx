// RESPONSIBILITY: Adapt the canonical Dashboard domain route to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_dashboard/page.tsx -> canonical URL contract -> owning leaf screen or redirect.
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
import { redirect } from 'next/navigation';



type SearchParams = Record<string, string | string[] | undefined>;

/** Canonical domain entry: redirect to the first approved submodule and preserve URL state. */
export default async function DomainIndexPage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
    else if (value !== undefined) params.set(key, value);
  }
  const suffix = params.toString();
  redirect(SUPERADMIN_NAVIGATION_ROUTES.dashboard_overview + (suffix ? `?${suffix}` : ''));
}

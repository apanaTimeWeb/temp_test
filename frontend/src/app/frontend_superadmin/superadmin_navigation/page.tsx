// RESPONSIBILITY: Adapt the canonical Navigation domain route to primary dashboard overview.
// FLOW: App Router -> superadmin_navigation/page.tsx -> canonical URL contract -> primary dashboard.
import { redirect } from 'next/navigation';

type SearchParams = Record<string, string | string[] | undefined>;

/** Canonical domain entry: redirect to dashboard overview and preserve URL state. */
export default async function SuperadminNavigationDomainIndexPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams> | SearchParams;
}) {
  const query = searchParams ? await searchParams : {};
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
    else if (value !== undefined) params.set(key, value);
  }
  const suffix = params.toString();
  redirect('/superadmin/superadmin_dashboard/dashboard_overview' + (suffix ? `?${suffix}` : ''));
}

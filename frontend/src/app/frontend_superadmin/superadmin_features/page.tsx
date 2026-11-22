import { redirect } from 'next/navigation';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function SuperadminFeaturesIndexPage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
    else if (value !== undefined) params.set(key, value);
  }
  const suffix = params.toString();
  redirect(SUPERADMIN_NAVIGATION_ROUTES.features_overview + (suffix ? `?${suffix}` : ''));
}

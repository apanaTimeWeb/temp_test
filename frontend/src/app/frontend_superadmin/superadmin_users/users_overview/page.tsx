import { redirect } from 'next/navigation';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function UsersOverviewRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const view = firstValue(query.view);

  if (view === 'member_referrals') {
    redirect('/superadmin/superadmin_users/users_member_referrals');
  }
  if (view === 'member_trust_score') {
    redirect('/superadmin/superadmin_users/users_member_trust_score');
  }

  redirect(SUPERADMIN_NAVIGATION_ROUTES.users_directory);
}

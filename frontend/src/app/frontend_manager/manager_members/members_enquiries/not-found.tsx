import { MANAGER_MEMBERS_ENQUIRIES_ROUTES } from '@/app/frontend_manager/manager_members/members_enquiries/config/manager_members_enquiries.url_config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const tManagerUi = await getTranslations('manager.manager_enquiries.ui');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-foreground">{tManagerUi('enquiry_not_found')}</h2>
      <p className="text-sm text-muted-foreground">{tManagerUi('track_every_prospect_from_enquiry_to_admission')}</p>
      <Link
        href={MANAGER_MEMBERS_ENQUIRIES_ROUTES.LIST}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {tManagerUi('back_to_pipeline')}
      </Link>
    </div>
  );
}

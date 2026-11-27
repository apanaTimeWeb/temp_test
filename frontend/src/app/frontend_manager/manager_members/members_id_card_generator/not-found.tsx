import { MANAGER_MEMBERS_ID_CARD_GENERATOR_ROUTES } from '@/app/frontend_manager/manager_members/members_id_card_generator/config/manager_members_id_card_generator.url_config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const tManagerUi = await getTranslations('manager.manager_id_card_generator.ui');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-foreground">{tManagerUi('id_card_generator')}</h2>
      <p className="text-sm text-muted-foreground">{tManagerUi('back_to_students_6de7b0')}</p>
      <Link
        href={MANAGER_MEMBERS_ID_CARD_GENERATOR_ROUTES.ID_CARD}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {tManagerUi('id_card_generator')}
      </Link>
    </div>
  );
}

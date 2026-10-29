import { redirect } from 'next/navigation';
import { MANAGER_MEMBERS_ID_CARD_GENERATOR_ROUTES } from '@/app/frontend_manager/manager_members/members_id_card_generator/config/manager_members_id_card_generator.url_config';
import { ManagerMembersIdCardGeneratorMain } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/ManagerMembersIdCardGeneratorMain';
import type { ManagerMembersIdCardGeneratorMainProps } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorMainTypes';
import type { ManagerMembersIdCardGeneratorPageProps } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerMembersIdCardGeneratorPage({ searchParams }: ManagerMembersIdCardGeneratorPageProps) {
  const params = searchParams ? await searchParams : {};
  const requestedView = firstValue(params.view);
  // Legacy links may still point to ?view=admission. Keep compatibility without
  // letting the ID-card route own the independent admission lifecycle.
  if (requestedView === 'admission') {
    redirect(MANAGER_MEMBERS_ID_CARD_GENERATOR_ROUTES.ADMISSION_PREVIEW);
  }
  const mainProps: ManagerMembersIdCardGeneratorMainProps = {
    view: requestedView === undefined || requestedView === 'id_card' ? requestedView : '__invalid_view__',
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerMembersIdCardGeneratorMain {...mainProps} />;
}

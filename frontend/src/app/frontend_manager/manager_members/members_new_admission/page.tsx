import { ManagerMembersNewAdmissionMain } from '@/app/frontend_manager/manager_members/members_new_admission/components/ManagerMembersNewAdmissionMain';
import type { ManagerMembersNewAdmissionMainProps } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionMainTypes';
import type { ManagerMembersNewAdmissionPageProps } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerMembersNewAdmissionPage({ searchParams }: ManagerMembersNewAdmissionPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerMembersNewAdmissionMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerMembersNewAdmissionMain {...mainProps} />;
}

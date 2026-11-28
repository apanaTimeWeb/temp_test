import { ManagerMembersGroupAdmissionMain } from '@/app/frontend_manager/manager_members/members_group_admission/components/ManagerMembersGroupAdmissionMain';
import type { ManagerMembersGroupAdmissionPageProps } from '@/app/frontend_manager/manager_members/members_group_admission/types/ManagerMembersGroupAdmissionComponentTypes';
import type { ManagerMembersGroupAdmissionMainProps } from '@/app/frontend_manager/manager_members/members_group_admission/types/ManagerMembersGroupAdmissionMainTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerMembersGroupAdmissionPage({ searchParams }: ManagerMembersGroupAdmissionPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerMembersGroupAdmissionMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerMembersGroupAdmissionMain view={mainProps.view} id={mainProps.id} name={mainProps.name} phone={mainProps.phone} smartId={mainProps.smartId} />;
}

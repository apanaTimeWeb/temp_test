import { ManagerMembersAlumniMain } from '@/app/frontend_manager/manager_members/members_alumni/components/ManagerMembersAlumniMain';
import type { ManagerMembersAlumniPageProps } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniComponentTypes';
import type { ManagerMembersAlumniMainProps } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniMainTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerMembersAlumniPage({ searchParams }: ManagerMembersAlumniPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerMembersAlumniMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerMembersAlumniMain view={mainProps.view} id={mainProps.id} name={mainProps.name} phone={mainProps.phone} smartId={mainProps.smartId} />;
}

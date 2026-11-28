import { ManagerMembersEnquiriesMain } from '@/app/frontend_manager/manager_members/members_enquiries/components/ManagerMembersEnquiriesMain';
import type { ManagerMembersEnquiriesPageProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';
import type { ManagerMembersEnquiriesMainProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesMainTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerMembersEnquiriesPage({ searchParams }: ManagerMembersEnquiriesPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerMembersEnquiriesMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerMembersEnquiriesMain view={mainProps.view} id={mainProps.id} name={mainProps.name} phone={mainProps.phone} smartId={mainProps.smartId} />;
}

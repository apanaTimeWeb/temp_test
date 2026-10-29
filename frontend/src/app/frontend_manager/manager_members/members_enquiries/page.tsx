import { ManagerMembersEnquiriesMain } from '@/app/frontend_manager/manager_members/members_enquiries/components/ManagerMembersEnquiriesMain';
import type { ManagerMembersEnquiriesMainProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesMainTypes';
import type { ManagerMembersEnquiriesPageProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';



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
  return <ManagerMembersEnquiriesMain {...mainProps} />;
}

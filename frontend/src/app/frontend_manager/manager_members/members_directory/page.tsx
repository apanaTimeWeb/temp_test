import { ManagerMembersDirectoryMain } from '@/app/frontend_manager/manager_members/members_directory/components/ManagerMembersDirectoryMain';
import type { ManagerMembersDirectoryPageProps } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

export default async function ManagerMembersDirectoryPage({ searchParams }: ManagerMembersDirectoryPageProps) {
  const params = searchParams ? await searchParams : {};
  return <ManagerMembersDirectoryMain
    view={firstValue(params.view)} id={firstValue(params.id)} name={firstValue(params.name)}
    phone={firstValue(params.phone)} smartId={firstValue(params.smartId)} seat={firstValue(params.seat)}
  />;
}

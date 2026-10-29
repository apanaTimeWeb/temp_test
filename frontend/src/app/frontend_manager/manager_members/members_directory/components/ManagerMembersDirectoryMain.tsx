'use client';

import ManagerMembersDirectoryPage from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_views/ManagerMembersDirectoryPage.tsx';
import type { ManagerMembersDirectoryMainProps } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryComponentTypes';


export function ManagerMembersDirectoryMain(props: ManagerMembersDirectoryMainProps) {
  return <ManagerMembersDirectoryPage
    view={props.view} id={props.id} name={props.name} phone={props.phone} smartId={props.smartId}
  />;
}

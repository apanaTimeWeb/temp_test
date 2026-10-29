'use client';
import { ManagerMembersAlumniClient } from '@/app/frontend_manager/manager_members/members_alumni/components/manager_members_alumni_views/ManagerMembersAlumniClient';
import { ManagerMembersAlumniErrorBoundary } from '@/app/frontend_manager/manager_members/members_alumni/components/manager_members_alumni_states/ManagerMembersAlumniErrorBoundary';
import type { ManagerMembersAlumniMainProps } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniMainTypes';

// RESPONSIBILITY: Preserve route query context for the manager members alumni feature.
// DATA FLOW: Next.js route page -> typed Main props -> feature client/view.


export function ManagerMembersAlumniMain(props: ManagerMembersAlumniMainProps) {
  return (
    <div
      data-route-view={props.view}
      data-route-id={props.id}
      data-route-name={props.name}
      data-route-phone={props.phone}
      data-route-smart-id={props.smartId}
    >
      <ManagerMembersAlumniErrorBoundary><ManagerMembersAlumniClient /></ManagerMembersAlumniErrorBoundary>
    </div>
  );
}

'use client';
import ManagerMembersGroupAdmissionGroupPage from '@/app/frontend_manager/manager_members/members_group_admission/components/manager_members_group_admission_views/ManagerMembersGroupAdmissionGroupPage';
import { ManagerMembersGroupAdmissionErrorBoundary } from '@/app/frontend_manager/manager_members/members_group_admission/components/manager_members_group_admission_states/ManagerMembersGroupAdmissionErrorBoundary';
import type { ManagerMembersGroupAdmissionMainProps } from '@/app/frontend_manager/manager_members/members_group_admission/types/ManagerMembersGroupAdmissionMainTypes';

// RESPONSIBILITY: Preserve route query context for the manager members group admission feature.
// DATA FLOW: Next.js route page -> typed Main props -> feature client/view.


export function ManagerMembersGroupAdmissionMain(props: ManagerMembersGroupAdmissionMainProps) {
  return (
    <ManagerMembersGroupAdmissionErrorBoundary>
      <ManagerMembersGroupAdmissionGroupPage
        view={props.view}
        id={props.id}
        name={props.name}
        phone={props.phone}
        smartId={props.smartId}
      />
    </ManagerMembersGroupAdmissionErrorBoundary>
  );
}

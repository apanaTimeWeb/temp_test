'use client';
import { ManagerMembersIdCardGeneratorIdCardClient } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorIdCardClient';
import { ManagerMembersIdCardGeneratorErrorBoundary } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_states/ManagerMembersIdCardGeneratorErrorBoundary';
import type { ManagerMembersIdCardGeneratorMainProps } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorMainTypes';

// RESPONSIBILITY: Preserve route query context for the manager members id card generator feature.
// DATA FLOW: Next.js route page -> typed Main props -> feature client/view.


export function ManagerMembersIdCardGeneratorMain(props: ManagerMembersIdCardGeneratorMainProps) {
  return (
    <div
      data-route-view={props.view}
      data-route-id={props.id}
      data-route-name={props.name}
      data-route-phone={props.phone}
      data-route-smart-id={props.smartId}
    >
      <ManagerMembersIdCardGeneratorErrorBoundary><ManagerMembersIdCardGeneratorIdCardClient /></ManagerMembersIdCardGeneratorErrorBoundary>
    </div>
  );
}
